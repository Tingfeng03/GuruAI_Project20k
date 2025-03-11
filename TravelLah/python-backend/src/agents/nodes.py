from src.agents.state import AgentState
from src.services.llm import llm_service, Queries
from src.services.tavilySearch import search_service
from src.services.itinerary import planner_service
from src.prompts.templates import PlannerPrompts
from src.settings.logging import app_logger as logger
from langchain_core.messages import HumanMessage, SystemMessage


def plan_node(state: AgentState) -> AgentState:
    """
    Node that generates the initial vacation plan
    
    Args:
        state: Current state of the agent
        
    Returns:
        Updated state with plan
    """
    logger.info("Executing plan_node")
    messages = [
        SystemMessage(content=PlannerPrompts.VACATION_PLANNING_SUPERVISOR),
        HumanMessage(content=state['task'])
    ]
    
    response = llm_service.model.invoke(messages)
    print("**********************************************************")
    print("Plan: ")
    print(response.content)
    print("**********************************************************")
    logger.info("Generated vacation plan")
    return {**state, "plan": response.content}

def research_plan_node(state: AgentState) -> AgentState:
    """
    Node that researches the vacation plan
    
    Args:
        state: Current state of the agent
        
    Returns:
        Updated state with queries and answers
    """
    logger.info("Executing research_plan_node")
    pastQueries = state.get('queries', [])
    answers = state.get('answers', [])
    queries = llm_service.model.with_structured_output(Queries).invoke([
        SystemMessage(content=PlannerPrompts.PLANNER_ASSISTANT),
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
    

def generation_node(state: AgentState) -> AgentState:
    """
    Node that generates the itinerary
    
    Args:
        state: Current state of the agent
        
    Returns:
        Updated state with draft and incremented revision number
    """
    logger.info("Executing generation_node")
    itinerary_params = state.get("itinerary_params", {})
    
    # Build query and generate itinerary
    dynamic_query = planner_service.build_dynamic_itinerary_query(itinerary_params)
    refined_itinerary = planner_service.generate_refined_itinerary(dynamic_query)
    
    # Update state
    print("**********************************************************")
    print("Dynamic Itinerary Query: ")
    print(dynamic_query)
    print("**********************************************************")
    print("Refined Itinerary: ")
    print(refined_itinerary)
    print("**********************************************************")
    return {
        **state,
        "draft": refined_itinerary,
        "revision_number": state.get("revision_number", 1) + 1,
    }


def reflection_node(state: AgentState) -> AgentState:
    """
    Node that critiques the generated itinerary
    
    Args:
        state: Current state of the agent
        
    Returns:
        Updated state with critique
    """
    logger.info("Executing reflection_node")
    messages = [
        SystemMessage(content=PlannerPrompts.PLANNER_CRITIQUE),
        HumanMessage(content=state["draft"]),
    ]
    response = llm_service.model.invoke(messages)
    print("**********************************************************")
    print("Critique: ")
    print(response.content)
    print("**********************************************************")
    return {**state, "critique": response.content}

def research_critique_node(state: AgentState) -> AgentState:
    """
    Node that researches based on the critique
    
    Args:
        state: Current state of the agent
        
    Returns:
        Updated state with queries and answers
    """
    logger.info("Executing research_critique_node")
    pastQueries = state.get("queries", [])
    answers = state.get("answers", [])
    queries = llm_service.model.with_structured_output(Queries).invoke(
        [
            SystemMessage(
                content=PlannerPrompts.PLANNER_CRITIQUE_ASSISTANT.format(
                    queries=pastQueries, answers=answers
                )
            ),
            HumanMessage(content=state["critique"]),
        ]
    )
    print("**********************************************************")
    print("Queries and Response:")
    for q in queries.queries:
        print("Query: " + q)
        pastQueries.append(q)
        response = search_service.client.search(query=q, max_results=2)
        for r in response["results"]:
            lat = r.get("latitude", "")
            lng = r.get("longitude", "")
            addr = r.get("address", "")
            content = r.get("content", "")
            combined_info = f"{content}\nLat: {lat}, Long: {lng}, Address: {addr}"
            print("Tavily Response: " + combined_info)
            answers.append(combined_info)
    print("**********************************************************")
    return {**state, "queries": pastQueries, "answers": answers}

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