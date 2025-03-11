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
from langgraph.checkpoint.sqlite import SqliteSaver
from pydantic import BaseModel

#TODO consider having an additional param "condition", where it describes the condition/reason the user might not be able to proceed
# with their activity to increase the value and relevance of the recalibrated prompt

'''
Future Considerations:
1. Agent returns a list of alternative activities instead of just one
2. Agent evaluates more than just weather conditions to establish feasibility of activity
'''


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
    activity_params: dict

class Queries(BaseModel):
    queries: List[str]

model = ChatGoogleGenerativeAI(
            temperature=0,
            model="gemini-1.5-flash", #gemini-1.5-flash, gemini-1.5-pro (I ran out of prompts for pro)
            convert_system_message_to_human=True,
            google_api_key=GOOGLE_API_KEY
        )

tavily = TavilyClient(api_key=TAVILY_API_KEY)

ACTIVITY_PLANNING_SUPERVISOR_PROMPT="""You are the activity planning supervisor. You have to give a detailed outline of what the planning agent \
has to consider when planning the activity according to the user input."""

PLANNER_ASSISTANT_PROMPT = """You are an assistant charged with providing information that can be used by the planner to plan the activity.
Generate a list of search queries that will be useful for the planner. Generate a maximum of 3 queries."""

PLANNER_CRITIQUE_PROMPT = """Your duty is to criticize the planning done by the activity planner.
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

    def build_dynamic_activity_query(self, activity_params: dict) -> str:
        # userId = activity_params.get("userId", "Unknown User")
        # tripId = activity_params.get("tripId", "Unknown Trip ID")
        activityId = activity_params.get("activityId", "Invalid Activity ID")
        address = activity_params.get("address", "Unknown Destination")
        date = activity_params.get("date", "Not specified")
        #party_size = activity_params.get("party_size", 2) # not stored in json
        #budget = activity_params.get("budget", "moderate") # not stored in json
        activity = activity_params.get("activity", "varied activity") # activity notes
        start_time = activity_params.get("start_time", "Invalid Start Time")
        end_time = activity_params.get("end_time", "Invalid End Time")
        activity_type = activity_params.get("activity_type", "")
        #pace = activity_params.get("pace", "relaxed") # not stored in json
        #notes = activity_params.get("notes", "") # not stored in json, refers to personal notes and not activity notes
        
        query_parts = [
            # f"User ID: {userId}",
            # f"Trip ID: {tripId}",
            f"Activity ID: {activityId}",
            f"Address: {address}", # confirm with other parts of the code if we are using address or specific location or long lat
            f"Travel Date: {date}",
            #f"Travellers: {party_size}",
            #f"Budget: {budget}",
            f"Activity: {activity}",
            f"Start Time: {start_time}",
            f"End Time: {end_time}",
            f"Activity Type: {activity_type}",
            #f"Pace: {pace}",
            #f"Notes: {notes}"
        ]
        query = " | ".join(query_parts)

        return query
    
    def generate_refined_activity(self, query_text) -> str:
        persona = (
            "You are an expert activity planner known for creating extremely well thought out, detailed, and personalized activities that follow a "
            "logically sequenced, realistically timed and time-conscious schedule."
        )
        task = (
            "Due to bad weather, the customer is unable to partake in their given activity. Provide an alternative activity that aligns to their preferences" \
            "of the kind of activity they were intending to do, time frame and other general preferences." #maybe include budget and travel party size
        )
        condition = (
            "Your final output must be valid JSON 'activity' it has the keys 'activityId', 'specific_location', 'address', 'latitute', "
            "'longitude', 'start_time', 'end_time', 'activity_type' and 'notes'. 'activity_type' is a either 'indoor' or 'outdoor'. 'activityId' is an identical" \
            " integer to the 'activityId' is passed in by the customer's input"
        )
        format_condition = (
            "All mentioned JSON structures must exactly match the keys and structure described above, with no omissions. All days must abide by the format provided, no omissions." \
            "All JSON structures and elements in the JSON array must be filled. No texts are allowed outside of any JSON structures"
        )
        
        sysmsg = f"{persona}\n{task}\n{condition}\n{format_condition}"
        
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
        logging.info("Raw LLM response (refined_activity): %s", response.content)

        return response.content

travel_agent_planner = TravelAgentPlanner(model, tavily)

def plan_node(state: AgentState):
    messages = [
        SystemMessage(content=ACTIVITY_PLANNING_SUPERVISOR_PROMPT), 
        HumanMessage(content=state['task'])
    ]
    response = model.invoke(messages)
    print("**********************************************************")
    print("Plan: ")
    print(response.content)
    print("**********************************************************")
    state["plan"] = response.content

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
    activity_params = state.get("activity_params", {})
    dynamic_query = travel_agent_planner.build_dynamic_activity_query(activity_params)
    
    refined_activity = travel_agent_planner.generate_refined_activity(dynamic_query)
    
    print("**********************************************************")
    print("Dynamic activity Query: ")
    print(dynamic_query)
    print("**********************************************************")
    print("Refined activity: ")
    print(refined_activity)
    print("**********************************************************")

    return {**state, "draft": refined_activity, "revision_number": state.get("revision_number", 1) + 1}

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

def run_activity_flow(builder):
    final_draft_dict = None

    with SqliteSaver.from_conn_string(":memory:") as memory:
        graph = builder.compile(checkpointer=memory)
        thread = {"configurable": {"thread_id": "4"}}
        output_states = []

        stream_options = {
            "activity_params": {
                "activityId": 1,
                "address": "Colline du Château",
                "date": "2025-04-05",
                #"party_size":
                #"budget":
                "activity": "Walking tour of Nice, the old town & the Coline du Château",
                "start_time": "08:30",
                "end_time": "12:00",
                "activity_type": "outdoor",
                #"pace":
                #"notes":
            },
            #"task": "Suggest a {pace}, {num_days} day trip to {destination} with {budget} budget. {party_size} people are going on the trip, splitting into {num_rooms} rooms. {notes}",
            "task": "Suggest an alternative activity that is similar in nature to {activity} on {date}, near {address}. The activity should not exceed the timeframe of"
            "{start_time} to {end_time}",
            "max_revisions": 1,  # was 3 and resource limit keeps being hit, anyways dont need so many for testing yet
            "revision_number": 1
        }

        activity_params = stream_options["activity_params"]
        stream_options["task"] = stream_options["task"].format(**activity_params)


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
                        print("Parsed draft activity successfully!")
                    except json.JSONDecodeError as e:
                        print("Error parsing the draft as JSON:", e)

            output_states.append(state)

    if not final_draft_dict:
        raise ValueError("Final draft activity not found in any state.")

    print("Final draft activity (dict):", final_draft_dict)
    return final_draft_dict


test_data = run_activity_flow(builder)
print("Formatted JSON:")
print(json.dumps(test_data, indent=4, ensure_ascii=False))