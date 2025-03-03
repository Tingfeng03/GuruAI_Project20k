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