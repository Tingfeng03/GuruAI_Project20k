from langgraph.graph import END, StateGraph, START
import pandas as pd

from src.graph import GraphState
#from src.graph import check_intents, generate

workflow = StateGraph(GraphState)

# workflow.add_node("check_intents", check_intents)
# workflow.add_node("generate", generate)


workflow.add_edge(START, "check_relevance")
# workflow.add_conditional_edges("check_relevance",
#                                decide_to_proceed,
#                                {
#                                    "check_intents": "check_intents",
#                                    "END": END
#                                })

workflow.add_edge("check_intents", "generate")
workflow.add_edge("generate", END)


app = workflow.compile()


from fastapi import FastAPI,APIRouter
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
app = FastAPI()
router = APIRouter() 
origins = [
    "http://localhost:3000",
    "localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Define root route
@app.get("/")
def read_root():
    return {"message": "Hello, world!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)