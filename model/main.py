from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, TypedDict, Annotated
import operator
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from langchain_openai import ChatOpenAI
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
from dotenv import load_dotenv
import os
import io

load_dotenv()

SCOPES = ["https://www.googleapis.com/auth/drive"]
PARENT_FOLDER_ID = "1sltxx-kH3tZjX0-9YAY_XUokGqw1nad4"  # your Drive folder ID

def authenticate():
    """Authenticate using service account info from .env"""
    service_account_info = {
        "type": os.getenv("GDRIVE_TYPE"),
        "project_id": os.getenv("GDRIVE_PROJECT_ID"),
        "private_key_id": os.getenv("GDRIVE_PRIVATE_KEY_ID"),
        "private_key": os.getenv("GDRIVE_PRIVATE_KEY").replace("\\n", "\n"),
        "client_email": os.getenv("GDRIVE_CLIENT_EMAIL"),
        "client_id": os.getenv("GDRIVE_CLIENT_ID"),
        "auth_uri": os.getenv("GDRIVE_AUTH_URI"),
        "token_uri": os.getenv("GDRIVE_TOKEN_URI"),
        "auth_provider_x509_cert_url": os.getenv("GDRIVE_AUTH_PROVIDER_X509_CERT_URL"),
        "client_x509_cert_url": os.getenv("GDRIVE_CLIENT_X509_CERT_URL"),
    }
    creds = service_account.Credentials.from_service_account_info(service_account_info, scopes=SCOPES)
    service = build("drive", "v3", credentials=creds)
    return service


def upload_video_to_drive(video_bytes, filename):
    """Uploads MP4 to Google Drive using service account"""
    service = authenticate()

    # Temporarily save file
    temp_path = f"temp_{filename}"
    with open(temp_path, "wb") as f:
        f.write(video_bytes)

    file_metadata = {
        "name": filename,
        "parents": [PARENT_FOLDER_ID],
    }

    media = MediaFileUpload(temp_path, mimetype="video/mp4", resumable=True)
    uploaded_file = service.files().create(body=file_metadata, media_body=media, fields="id").execute()
    file_id = uploaded_file.get("id")

    # Make it public
    service.permissions().create(fileId=file_id, body={"type": "anyone", "role": "reader"}).execute()

    # Public URL
    public_url = f"https://drive.google.com/uc?id={file_id}&export=download"

    # Cleanup
    os.remove(temp_path)

    return {"file_id": file_id, "public_url": public_url}




class Result(BaseModel):
    feedback: str = Field(
        description="tell if the answer is right or wrong, if wrong then where it went wrong with respect to GitHub"
    )
    score: int = Field(
        description="give a score to this answer based on how correct it is; if completely out of context give 0, if completely right give 10",
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
        f"Evaluate this Q&A and give feedback and score out of 10.\n"
        f"Q: {qa['q']}\nA: {qa['a']}"
    )
    return {"feedbacks": [output.feedback], "scores": [output.score]}

def summarize(state: State):
    avg = sum(state["scores"]) / len(state["scores"])
    return {"avg_score": round(avg, 2)}

graph = StateGraph(State)
graph.add_node("analyze", analyze)
graph.add_node("summarize", summarize)
graph.add_conditional_edges(START, split_tasks, ["analyze"])
graph.add_edge("analyze", "summarize")
graph.add_edge("summarize", END)
workflow = graph.compile()



app = FastAPI(title="GitHub Q&A Evaluator + Proctored API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend origin later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "GitHub Q&A Evaluator + Proctoring API is running 🚀"}


@app.post("/analyze")
def analyze_qas(data: QARequest):
    qas = [qa.dict() for qa in data.questions_answers]
    result = workflow.invoke({"questions_answers": qas})
    return result


@app.post("/upload-video/")
async def upload_video(file: UploadFile = File(...)):
    """
    Upload MP4 video to Google Drive via service account.
    """
    try:
        contents = await file.read()
        result = upload_video_to_drive(contents, file.filename)
        return {"status": "success", **result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
