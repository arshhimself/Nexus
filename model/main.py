from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Dict, TypedDict, Annotated
import operator
from dotenv import load_dotenv
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from langchain_openai import ChatOpenAI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()


class Result(BaseModel):
    feedback:str = Field(description='tell if the answer is right or wrong if wrong then where did it went wrong wit respect to github ')
    score:int = Field(description='give a score to this answer based on how correct it is if completely out of context give 0 if completely right give 10', ge=0 ,le=10)


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


model = ChatOpenAI(model='gpt-4o-mini').with_structured_output(Result)


def split_tasks(state: State):
    """Create parallel analysis tasks"""
    return [Send("analyze", qa) for qa in state["questions_answers"]]

def analyze(qa: dict):
    """Analyze one Q&A pair"""
    output = model.invoke(
  f"Evaluate the given question and answer to you and give a feedback on how good of a solution is it if its not even related then straightup give 0 and if its 100% right then 10 and score it from 0-10.\nQ: {qa['q']}\nA: {qa['a']}"

    )
    return {"feedbacks": [output.feedback], "scores": [output.score]}

def summarize(state: State):
    """Calculate average and return summary"""
    avg = sum(state['scores']) / len(state['scores'])
    return {"avg_score": round(avg, 2)}


graph = StateGraph(State)
graph.add_node("analyze", analyze)
graph.add_node("summarize", summarize)
graph.add_conditional_edges(START, split_tasks, ["analyze"])
graph.add_edge("analyze", "summarize")
graph.add_edge("summarize", END)

workflow = graph.compile()

# ---------- FASTAPI APP ----------
app = FastAPI(title="GitHub Q&A Evaluator API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "GitHub Q&A Evaluator API is running 🚀"}

@app.post("/analyze")
def analyze_qas(data: QARequest):
    """Analyze the given Q&A pairs and return feedback, scores, and average score."""
    qas = [qa.dict() for qa in data.questions_answers]
    result = workflow.invoke({"questions_answers": qas})
    return result
