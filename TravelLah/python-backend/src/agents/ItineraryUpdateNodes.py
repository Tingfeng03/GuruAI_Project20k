from src.agents.state import AgentState
from src.services.llm import llm_service, Queries
from src.services.tavilySearch import search_service
from src.services.itinerary import planner_service
from src.prompts.ItineraryUpdateTemplates import ItineraryUpdatePrompts
from src.settings.logging import app_logger as logger
from langchain_core.messages import HumanMessage, SystemMessage


def plan_node(state: AgentState):
    messages = [
        SystemMessage(content=ItineraryUpdatePrompts.VACATION_PLANNING_SUPERVISOR), 
        HumanMessage(content=state['task'])
    ]
    response = llm_service.model.invoke(messages)
    print("**********************************************************")
    print("Plan: ")
    print(response.content)
    print("**********************************************************")
    state["plan"] = response.content

    return {**state, "plan": response.content}

def research_plan_node(state: AgentState):
    pastQueries = state.get('queries', [])
    answers = state.get('answers', [])
    queries = llm_service.model.with_structured_output(Queries).invoke([
        SystemMessage(content=ItineraryUpdatePrompts.PLANNER_ASSISTANT_PROMPT),
        HumanMessage(content=state['plan'])
    ])   
    print("**********************************************************")
    print("Queries and Response: ")
    for q in queries.queries:
        print("Query: " + q)
        pastQueries.append(q)
        response = search_service.client.search(query=q, max_results=2)
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
    dynamic_query = planner_service.travel_agent_planner.build_dynamic_activity_query(activity_params)
    
    refined_activity = planner_service.travel_agent_planner.generate_refined_activity(dynamic_query)
    
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
        SystemMessage(content=ItineraryUpdatePrompts.PLANNER_CRITIQUE_PROMPT), 
        HumanMessage(content=state['draft'])
    ]
    response = llm_service.model.invoke(messages)
    print("**********************************************************")
    print("Critique: ")
    print(response.content)
    print("**********************************************************")

    return {**state, "critique": response.content}

def research_critique_node(state: AgentState):
    pastQueries = state['queries'] or []
    answers = state['answers'] or []
    queries = llm_service.model.with_structured_output(Queries).invoke([
        SystemMessage(content=ItineraryUpdatePrompts.PLANNER_CRITIQUE_ASSISTANT_PROMPT.format(
            queries=pastQueries, answers=answers
            )
        ),
        HumanMessage(content=state['critique'])
    ])
    print("**********************************************************")
    print("Queries and Response:")
    for q in queries.queries:
        print("Query: " + q)
        pastQueries.append(q)
        response = search_service.tavily.search(query=q, max_results=2)
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

def should_continue(state: AgentState) -> str:
    """
    Decision function to determine if the workflow should continue
    
    Args:
        state: Current state of the agent
        
    Returns:
        Next node name or END
    """
    from langgraph.graph import END
    
    if state["revision_number"] > state["max_revisions"]:
        logger.info(f"Reached max revisions ({state['max_revisions']}), ending workflow")
        return END
    
    logger.info(f"Continuing to reflection (revision {state['revision_number']} of {state['max_revisions']})")
    return "reflect"