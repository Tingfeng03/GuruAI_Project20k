import os
import re
import json
import logging
from typing import TypedDict, List
from langchain_community.adapters.openai import convert_openai_messages
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv
from tavily import TavilyClient
# from langgraph.checkpoint.sqlite import SqliteSaver
from pydantic import BaseModel

load_dotenv(dotenv_path='.env')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
TAVILY_API_KEY = os.getenv('TAVILY_API_KEY')

class AgentState(TypedDict):
    task: str
    plan: str
    draft: str
    critique: str
    queries: List[str]
    answers: List[str]
    revision_number: int
    max_revisions: int
    itinerary_params: dict

class Queries(BaseModel):
    queries: List[str]

model = ChatGoogleGenerativeAI(
            temperature=0,
            model="gemini-1.5-flash", #gemini-1.5-flash, gemini-1.5-pro (I ran out of prompts for pro)
            convert_system_message_to_human=True,
            google_api_key=GOOGLE_API_KEY
        )

tavily = TavilyClient(api_key=TAVILY_API_KEY)

VACATION_PLANNING_SUPERVISOR_PROMPT="""You are the vacation planning supervisor. You have to give a detailed outline of what the planning agent \
has to consider when planning the vacation according to the user input."""

PLANNER_ASSISTANT_PROMPT = """You are an assistant charged with providing information that can be used by the planner to plan the vacation.
Generate a list of search queries that will be useful for the planner. Generate a maximum of 3 queries."""

PLANNER_CRITIQUE_PROMPT = """Your duty is to criticize the planning done by the vacation planner.
In your response include if you agree with options presented by the planner, if not then give detailed suggestions on what should be changed.
You can also suggest some other destination that should be checked out.
"""

PLANNER_CRITIQUE_ASSISTANT_PROMPT = """You are a assistant charged with providing information that can be used to make any requested revisions.
Generate a list of search queries that will gather any relevent information. Only generate 3 queries max. 
You should consider the queries and answers that were previously used:
QUERIES:
{queries}

ANSWERS:
{answers}
"""

class TravelAgentPlanner:
    def __init__(self, llm, tavily):
        self.llm = llm
        self.tavily = tavily

    def build_dynamic_itinerary_query(self, itinerary_params: dict) -> str:
        userId = itinerary_params.get("userId", "Unknown User")
        tripId = itinerary_params.get("tripId", "Unknown Trip ID")
        destination = itinerary_params.get("destination", "Unknown Destination")
        num_days = itinerary_params.get("num_days", 1)
        dates = itinerary_params.get("dates", "Not specified")
        party_size = itinerary_params.get("party_size", 2)
        num_rooms = itinerary_params.get("num_rooms", 2)
        budget = itinerary_params.get("budget", "moderate")
        activities = itinerary_params.get("activities", "varied activities")
        food = itinerary_params.get("food", "local cuisine")
        pace = itinerary_params.get("pace", "relaxed")
        notes = itinerary_params.get("notes", "")
        
        query_parts = [
            f"User ID: {userId}",
            f"Trip ID: {tripId}",
            f"Destination: {destination}",
            f"Number of Days: {num_days}",
            f"Travel Dates: {dates}",
            f"Budget: {budget}",
            f"Travellers: {party_size}",
            f"Rooms: {num_rooms}",
            f"Activities: {activities}",
            f"Dining: {food}",
            f"Pace: {pace}",
            f"Notes: {notes}"
        ]
        query = " | ".join(query_parts)
        return query
    
    def generate_refined_itinerary(self, query_text) -> str:
        persona = (
            "You are an expert travel planner known for creating extremely well thought out, thorough, and personalized itineraries that follow a "
            "logically sequenced, realistically timed and time-conscious schedule."
        )
        task = (
            "Analyze the following user input and produce two sections in your final output:\n"
            #"1. **Chain-of-Thought (CoT) Reasoning:** Provide a detailed, step-by-step explanation of your planning process.\n"
            "1. **Final Itinerary:** Deliver a detailed, day-by-day itinerary. Each day should have a header, a list of recommended activities"
            " that covers 3 meals and 3 activities, and notes."
        )
        # prompt to cater to output.json has not been constructed yet
        # check with ting feng if the following restructuring is fine/does not necessitate alot of work on his part:
        #{
            #"userId": "userID", // backend
            #"tripSerialNo": "xxxx",
            #"TravelLocation": "location" // what country we going?
            #"longtitude": 6969.69,
            #"latitude": 22.22,
            #"tripFlow": {
            #
            #}
        #}
        condition = (
            #"Your final output must be valid JSON with exactly two keys: 'chain_of_thought' and 'itinerary' where "
            "Your final output must be valid JSON 'itinerary' it has the keys 'userId',"
            "'tripSerialNo', 'TravelLocation', 'latitute', 'longitude' and 'tripFlow'. tripFlow' is a JSON array, with each element containing the keys"
            " 'date', 'activity content'. 'activity content is a JSON array, with each element containing the keys:'specific_location', " \
            " 'address', 'latitude', 'longitude', 'start_time' and 'notes'."
        )
        context_prompt = (
            "Include relevant local and practical insights, destination-specific details, and tailored recommendations in your response."
        )
        format_condition = (
            "All mentioned JSON structures must exactly match the keys and structure described above, with no omissions."
        )

        # now address vs (long, lat) are max 3km away (except for the airport theres a very strange bug where the
        # displacement between the two locations are clearly a few hundred metres apart, but the "proper routes" are 6km long)

        # consider writing a safety measure for json parsing (function that checks all structures and keys are in tact
        # reprompt if they are not)
        
        sysmsg = f"{persona}\n{task}\n{context_prompt}\n{condition}\n{format_condition}"
        
        retrieval_context = ""
        tavily_response = self.tavily.search(query=query_text, max_results=2)
        destination_info = []
        if tavily_response and "results" in tavily_response:
            for r in tavily_response["results"]:
                lat = r.get("latitude", "")
                lng = r.get("longitude", "")
                addr = r.get("address", "")
                destination_info.append(f"Lat: {lat}, Long: {lng}, Address: {addr}")
            retrieval_context = "\n".join([r.get("content", "") for r in tavily_response["results"]])
        
        messages = [
            {"role": "system", "content": sysmsg},
            {"role": "user", "content": query_text}
        ]
        if retrieval_context:
            messages.append({"role": "system", "content": f"Retrieved Context:\n{retrieval_context}"})
        
        lc_messages = convert_openai_messages(messages)
        response = self.llm.invoke(lc_messages)
        logging.info("Raw LLM response (refined_itinerary): %s", response.content)

        return response.content

travel_agent_planner = TravelAgentPlanner(model, tavily)

def plan_node(state: AgentState):
    messages = [
        SystemMessage(content=VACATION_PLANNING_SUPERVISOR_PROMPT), 
        HumanMessage(content=state['task'])
    ]
    response = model.invoke(messages)
    print("**********************************************************")
    print("Plan: ")
    print(response.content)
    print("**********************************************************")

    return {**state, "plan": response.content}

def research_plan_node(state: AgentState):
    pastQueries = state.get('queries', [])
    answers = state.get('answers', [])
    queries = model.with_structured_output(Queries).invoke([
        SystemMessage(content=PLANNER_ASSISTANT_PROMPT),
        HumanMessage(content=state['plan'])
    ])   
    print("**********************************************************")
    print("Queries and Response: ")
    for q in queries.queries:
        print("Query: " + q)
        pastQueries.append(q)
        response = tavily.search(query=q, max_results=2)
        for r in response['results']:
            lat = r.get("latitude", "")
            lng = r.get("longitude", "")
            addr = r.get("address", "")
            content = r.get("content", "")
            combined_info = f"{content}\nLat: {lat}, Long: {lng}, Address: {addr}"
            print("Tavily Response: " + combined_info)
            answers.append(combined_info)
    print("**********************************************************")

    return {**state, "queries": pastQueries, "answers": answers}

def generation_node(state: AgentState):
    itinerary_params = state.get("itinerary_params", {})
    dynamic_query = travel_agent_planner.build_dynamic_itinerary_query(itinerary_params)
    
    refined_itinerary = travel_agent_planner.generate_refined_itinerary(dynamic_query)
    
    print("**********************************************************")
    print("Dynamic Itinerary Query: ")
    print(dynamic_query)
    print("**********************************************************")
    print("Refined Itinerary: ")
    print(refined_itinerary)
    print("**********************************************************")

    return {**state, "draft": refined_itinerary, "revision_number": state.get("revision_number", 1) + 1}

def reflection_node(state: AgentState):
    messages = [
        SystemMessage(content=PLANNER_CRITIQUE_PROMPT), 
        HumanMessage(content=state['draft'])
    ]
    response = model.invoke(messages)
    print("**********************************************************")
    print("Critique: ")
    print(response.content)
    print("**********************************************************")

    return {**state, "critique": response.content}

def research_critique_node(state: AgentState):
    pastQueries = state['queries'] or []
    answers = state['answers'] or []
    queries = model.with_structured_output(Queries).invoke([
        SystemMessage(content=PLANNER_CRITIQUE_ASSISTANT_PROMPT.format(queries=pastQueries, answers=answers)),
        HumanMessage(content=state['critique'])
    ])
    print("**********************************************************")
    print("Queries and Response:")
    for q in queries.queries:
        print("Query: " + q)
        pastQueries.append(q)
        response = tavily.search(query=q, max_results=2)
        for r in response['results']:
            lat = r.get("latitude", "")
            lng = r.get("longitude", "")
            addr = r.get("address", "")
            content = r.get("content", "")
            combined_info = f"{content}\nLat: {lat}, Long: {lng}, Address: {addr}"
            print("Tavily Response: " + combined_info)
            answers.append(combined_info)
    print("**********************************************************")  

    return {**state, "queries": pastQueries,"answers": answers}

def should_continue(state):
    if state["revision_number"] > state["max_revisions"]:
        return END
    return "reflect"

builder = StateGraph(AgentState)

builder.add_node("planner", plan_node)
builder.add_node("research_plan", research_plan_node)
builder.add_node("generate", generation_node)
builder.add_node("reflect", reflection_node)
builder.add_node("research_critique", research_critique_node)

builder.set_entry_point("planner")

builder.add_conditional_edges(
    "generate", 
    should_continue, 
    {END: END, "reflect": "reflect"}
)

builder.add_edge("planner", "research_plan")
builder.add_edge("research_plan", "generate")
builder.add_edge("reflect", "research_critique")
builder.add_edge("research_critique", "generate")

def run_itinerary_flow(builder):
    # with SqliteSaver.from_conn_string(":memory:") as memory:
    graph = builder.compile()
    thread = {"configurable": {"thread_id": "4"}}
    output_states = []

    stream_options = {
        'task': "Suggest me a fun, culturally immersive relaxed, 5 day trip to Hanoi, Vietnam",
        "max_revisions": 1,  # was 3 and resource limit keeps being hit, anyways dont need so many for testing yet
        "revision_number": 1,
        "itinerary_params": {
            "userId": "U123",
            "tripId": "T123",
            "destination": "Hanoi, Vietnam",
            "num_days": 5,
            "dates": "2025-0-01 to 2025-04-02",
            "party_size": 4,
            "num_rooms": 2,
            "budget": "moderate",
            "activities": "cultural tours, historical sites, local markets, local cuisines",
            "food": "local-cuisine",
            "pace": "relaxed",
            "notes": "Include both indoor and outdoor activities; mention local festivals if applicable."
        }
    }

    for state in graph.stream(stream_options, thread):
        if(state.get('generate') and state.get('generate').get("draft")):
            draft_str = state.get('generate').get("draft")
            if draft_str:
                draft_str = draft_str.strip()
                draft_str = re.sub(r'^```json\s*', '', draft_str)
                draft_str = re.sub(r'```$', '', draft_str)
                draft_str = draft_str.strip()

                try:
                    draft_json = json.loads(draft_str)
                    final_draft_dict = draft_json
                    print("Parsed draft itinerary successfully!")
                except json.JSONDecodeError as e:
                    print("Error parsing the draft as JSON:", e)

        output_states.append(state)

    if not final_draft_dict:
        raise ValueError("Final draft itinerary not found in any state.")

    print("Final draft itinerary (dict):", final_draft_dict)
    return final_draft_dict


test_data = run_itinerary_flow(builder)
print("Formatted JSON:")
print(json.dumps(test_data, indent=4))