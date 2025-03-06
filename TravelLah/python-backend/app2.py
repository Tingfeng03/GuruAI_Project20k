import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.adapters.openai import convert_openai_messages
from dotenv import load_dotenv
import os
import math

# Additional imports for the PDF functionality
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.vectorstores import InMemoryVectorStore

load_dotenv(dotenv_path='.env')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')


###################################################
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, AIMessage, ChatMessage
from langchain_core.pydantic_v1 import BaseModel

from tavily import TavilyClient
import os

class AgentState(TypedDict):
    query: str
    plan: str
    draft: str
    critique: str
    queries: List[str]
    answers: List[str]
    revision_number: int
    max_revisions: int
    tavily_answers:List[str]
    answer:str

class Queries(BaseModel):
    queries: List[str]

tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
llm = ChatGoogleGenerativeAI(
            temperature=0,
            model="gemini-1.5-pro",
            convert_system_message_to_human=True,
            google_api_key=GOOGLE_API_KEY
        )
model =llm



def build_dynamic_itinerary_query(itinerary_params: dict) -> str:
#catch wrong date and invalid data etc should be kept in the input field sections
#should display the "inputs taken in" for users to see, in case default fields are not to their liking (or just completely disallow submission of empty fields for some of the inputs)
    destination = itinerary_params.get("destination", "Unknown Destination")
    num_days = itinerary_params.get("num_days", 1)
    dates = itinerary_params.get("dates", "Not specified")
    party_size = itinerary_params.get("party_size", 2)
    num_rooms = itinerary_params.get("num_rooms",2)
    budget = itinerary_params.get("budget", "moderate")
    activities = itinerary_params.get("activities", "varied activities")
    food = itinerary_params.get("food", "local cuisine")
    pace = itinerary_params.get("pace", "relaxed")
    notes = itinerary_params.get("notes", "")
    
    query = f"""
        User Input:
        - Destination: {destination}
        - Number of Days: {num_days}
        - Travel Dates / Duration: {dates}
        - Budget: {budget}
        - Number of Travellers: {party_size}
        - Number of Rooms: {num_rooms}
        - Preferred Activities: {activities}
        - Dining Preferences: {food}
        - Travel Pace: {pace}
        - Additional Notes: {notes}
    """
    #return query.strip()
    return query


VACATION_PLANNING_SUPERVISOR_PROMPT = """You are the vacation planning supervisor. You have to give an outline of what the planning agent \
has to consider when planning the vacation according to the user input."""


def plan_node(state: AgentState):
    messages = [
        SystemMessage(content=VACATION_PLANNING_SUPERVISOR_PROMPT), 
        HumanMessage(content=state['query'])
    ]
    response = model.invoke(messages)
    print("**********************************************************")
    print("Plan: ")
    print(response.content)
    print("**********************************************************")
    return {"plan": response.content}



PLANNER_ASSISTANT_PROMPT = """You are an assistant charged with providing information that can be used by the planner to plan the vacation.
Generate a list of search queries that will be useful for the planner. Generate a maximum of 3 queries."""

def research_plan_node(state: AgentState):
    pastQueries =  []
    answers = []
    queries = model.with_structured_output(Queries).invoke([
        SystemMessage(content=PLANNER_ASSISTANT_PROMPT),
        HumanMessage(content=state['query']+ state['plan'])
    ])   
    print("**********************************************************")
    print("Queries and Response: ")
    for q in queries.queries:
        print("Query: " + q)
        pastQueries.append(q)
        response = tavily.search(query=q, max_results=2)
        for r in response['results']:
            print("Tavily Response: " + r['content'])
            answers.append(r['content'])
    print("**********************************************************")
    return {
        "queries": pastQueries,
        "tavily_answers": answers
        }


persona = (
        "You are an expert travel planner known for creating extremely well thought-out, "
        "thorough, and personalized itineraries."
        )
task = (
            "Analyze the following user input and generate a comprehensive travel plan. Your output must include two sections:\n\n"
            "1. **Chain-of-Thought (CoT) Reasoning:** Provide a detailed, step-by-step explanation of your planning process, "
            "highlighting how you incorporated local insights, destination-specific details, and tailored recommendations.\n\n"
            "2. **Final Itinerary:** Deliver a detailed itinerary broken down by day. Each entry should include specific details "
            "about the destination and planned activities."
        )
condition = (
            "Your final output must be valid JSON with exactly two keys: 'chain_of_thought' and 'itinerary'. The 'itinerary' value "
            "must be a JSON array where each element is an object with the following keys:\n"
            "- 'date': The date of the itinerary segment.\n"
            "- 'specificNameOfLocation': The precise name of the location or venue.\n"
            "- 'activities': A list of recommended activities or experiences at that location.\n"
            "- 'notes': Any additional insights, tips, or contextual information."
        )
context_prompt = (
            "Ensure that your recommendations reflect local insights and include destination-specific details that make the itinerary truly "
            "personalized for the user's travel experience."
        )
VACATION_PLANNER_PROMPT = f"{persona}\n{task}\n{context_prompt}\n{condition}"


def generation_node(state: AgentState):
    user_message = HumanMessage(
        content=f"{state['query']}\n\nHere is my plan:\n\n{state['plan']}")
    messages = [
        SystemMessage(
            content=VACATION_PLANNER_PROMPT
        ),
        user_message
        ]
    response = model.invoke(messages)
    print("**********************************************************")
    print("Draft: ")
    print(response.content)
    print("**********************************************************")
    return {
        "answer": response.content, 
    }


builder = StateGraph(AgentState)

builder.add_node("planner", plan_node)
builder.add_node("research_plan", research_plan_node)
builder.add_node("generate", generation_node)

builder.set_entry_point("planner")


builder.add_edge("planner", "research_plan")
builder.add_edge("research_plan", "generate")
builder.add_edge( "generate", END)

graph = builder.compile()
thread = {"configurable": {"thread_id": "4"}}
output = []
itinerary_params = {
    "destination": "Hanoi, Vietnam",
    "num_days": 14,
    "dates": "2025-02-20 to 2025-02-25",
    "party_size": 3,
    "num_rooms": 2,
    "budget": "moderate",
    "activities": "cultural tours, historical sites, local markets, local cuisines",
    "food": "Vietnamese cuisine",
    "pace": "relaxed",
    "notes": "Include both indoor and outdoor activities; mention local festivals if applicable."
}
query_text = build_dynamic_itinerary_query(itinerary_params)
streamOptions = {
    'query' :query_text,
}
for s in graph.stream(streamOptions, thread):
    output.append(s)