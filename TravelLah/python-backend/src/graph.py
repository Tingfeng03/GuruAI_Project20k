from typing import List
from typing_extensions import TypedDict


#from src.generate import generate_answer

#from src.tools.intentClassifier import classify_intent

class GraphState(TypedDict):
    question: str
    generation:str
    intent:str


# def check_intents(state):
#     print("---CHECK INTENTS START---")
#     question = state["question"]
#     print("Classify intents")
#     label = classify_intent(question)
#     print(label)
#     return {**state, "intent": label}

# def decide_to_proceed(state):
#     state["question"]
#     relevance = state["relevance"]

#     if relevance == "yes":
#         print("---DECIDE TO PROCEED---")
#         return "check_intents"
#     else:
#         print("---Sorry---")
#         state["generation"] = "Sorry I can't answer this question"
#         return "END"

# def generate(state):

#     print("---GENERATE---")
#     question = state["question"]
#     documents = state["documents"]
#     emotion = state["emotion"]
#     sentiment = state["sentiment"]
#     intent = state["intent"]

#     generation = generate_answer(documents, question, emotion, sentiment, intent)
#     print('question:', documents, emotion, sentiment, intent, generation)
#     return {**state, "generation": generation}