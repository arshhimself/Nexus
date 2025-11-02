from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, TypedDict, Annotated
import operator
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from s3.main import upload_to_s3

# Load .env environment variables
load_dotenv()

# ------------------------------
#  GitHub Q&A Evaluator Setup
# ------------------------------

class Result(BaseModel):
    feedback: str = Field(
        description="Tell if the answer is right or wrong, if wrong then where it went wrong with respect to GitHub"
    )
    score: int = Field(
        description="Give a score to this answer based on correctness; 0 if wrong, 10 if perfect",
        ge=0, le=10,
    )


class QAItem(BaseModel):
    q: str
    a: str


class QARequest(BaseModel):
    questions_answers: List[QAItem]


class State(TypedDict):
    questions_answers: list[dict]
    feedbacks: Annotated[list[str], operator.add]
    scores: Annotated[list[int], operator.add]
    avg_score: float


model = ChatOpenAI(model="gpt-4o-mini").with_structured_output(Result)


def split_tasks(state: State):
    return [Send("analyze", qa) for qa in state["questions_answers"]]


def analyze(qa: dict):
    output = model.invoke(
        f"Evaluate the following question and answer pair as a GitHub professor mentoring beginners. "
        f"Focus only on how accurately and appropriately the answer addresses the question. Ignore grammar mistakes. "
        f"Reward logical effort. If correct, give higher score. If adds useful insights, give bonus points. "
        f"If incorrect, deduct points. Provide brief feedback and score out of 10.\n"
        f"Q: {qa['q']}\nA: {qa['a']}"
    )
    return {"feedbacks": [output.feedback], "scores": [output.score]}


def summarize(state: State):
    avg = sum(state["scores"]) / len(state["scores"])
    return {"avg_score": round(avg, 2)}


# Build LangGraph workflow
graph = StateGraph(State)
graph.add_node("analyze", analyze)
graph.add_node("summarize", summarize)
graph.add_conditional_edges(START, split_tasks, ["analyze"])
graph.add_edge("analyze", "summarize")
graph.add_edge("summarize", END)
workflow = graph.compile()


# ------------------------------
#  FastAPI App Configuration
# ------------------------------

app = FastAPI(title="GitHub Q&A Evaluator + Proctored API", version="2.0.0")

# ✅ Allowed hosts (same as Django ALLOWED_HOSTS)
ALLOWED_HOSTS = [
    "nexus-ccz0.onrender.com",   # Render backend
    "nexus-rcoe.vercel.app",     # Vercel frontend
    "127.0.0.1",
    "localhost",
    "13.200.225.213",            # Your public IP
    "3.110.209.65",
    "nexus-fastapi.crodlin.in"
    "http://localhost:8000",
]

# ✅ CORS Origins (allowed frontend URLs)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "https://nexus-ccz0.onrender.com",
    "https://nexus-rcoe.vercel.app",
]

# ✅ Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Important for cookies/tokens
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        *ALLOWED_HOSTS,
        "*.onrender.com",  # allow any Render subdomain
        "*.vercel.app",    # allow any Vercel subdomain
    ],
)

# ------------------------------
#  API Routes
# ------------------------------

@app.get("/")
def root():
    return {"message": "GitHub Q&A Evaluator + Proctoring API is running 🚀"}


@app.post("/analyze")
def analyze_qas(data: QARequest):
    qas = [qa.dict() for qa in data.questions_answers]
    result = workflow.invoke({"questions_answers": qas})
    return result


@app.post("/upload/s3/")
async def upload_file(file: UploadFile = File(...), s3_file_name: str = Form(None)):
    """
    Uploads file to S3 bucket.
    """
    try:
        print(f"Uploading file: {file.filename} to S3")
        target_file_name = s3_file_name if s3_file_name else file.filename
        print(f"Target S3 file name: {target_file_name}")

        success = upload_to_s3(file.file, target_file_name)
        print(f"S3 upload success: {success}")

        if success:
            return {
                "message": f"File '{file.filename}' uploaded successfully to S3",
                "s3_file_name": target_file_name,
            }
        else:
            raise HTTPException(status_code=500, detail="Credentials not available")

    except Exception as e:
        print(f"Error uploading to S3: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
