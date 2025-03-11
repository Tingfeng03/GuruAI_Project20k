from typing import Dict, Any
from .state import AgentState, Queries
from services.llm import LLMService
from services.tavilySearch import SearchService
from services.itinerary import ItineraryService
from prompts.templates import PlannerPrompts
from settings.logging import setup_logger
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import END

# Set up logger
logger = setup_logger("agents.nodes")

class AgentNodes:
    """Node functions for the travel planning agent workflow"""
    
    def __init__(self, llm_service: LLMService, search_service: SearchService, itinerary_service: ItineraryService):
        self.llm = llm_service
        self.search = search_service
        self.itinerary = itinerary_service
    
    def plan_node(self, state: AgentState) -> AgentState:
        logger.info("Running plan node")
        messages = [
            SystemMessage(content=PlannerPrompts.VACATION_PLANNING_SUPERVISOR), 
            HumanMessage(content=state['task'])
        ]
        response = self.llm.model.invoke(messages)
        logger.info("Plan generated")
        
        return {**state, "plan": response.content}
    
    def research_plan_node(self, state: AgentState) -> AgentState:
        """
        Research the plan by generating and executing search queries
        
        Args:
            state: Current agent state
            
        Returns:
            Updated agent state with queries and answers
        """
        logger.info("Running research plan node")
        past_queries = state.get('queries', [])
        answers = state.get('answers', [])
        
        queries = self.llm.with_structured_output(
            Queries,
            PlannerPrompts.PLANNER_ASSISTANT,
            state['plan']
        )
        
        for q in queries.queries:
            logger.info(f"Executing query: {q}")
            past_queries.append(q)
            results = self.search.search(q)
            
            for result in results:
                answers.append(result["combined_info"])
        
        return {**state, "queries": past_queries, "answers": answers}
    
    def generation_node(self, state: AgentState) -> AgentState:
        """
        Generate an itinerary based on the current state
        
        Args:
            state: Current agent state
            
        Returns:
            Updated agent state with draft itinerary
        """
        logger.info("Running generation node")
        itinerary_params = state.get("itinerary_params", {})
        dynamic_query = self.itinerary.build_dynamic_itinerary_query(itinerary_params)
        refined_itinerary = self.itinerary.generate_refined_itinerary(dynamic_query)
        
        return {
            **state, 
            "draft": refined_itinerary, 
            "revision_number": state.get("revision_number", 1) + 1
        }
    
    def reflection_node(self, state: AgentState) -> AgentState:
        """
        Generate critique of the current draft itinerary
        
        Args:
            state: Current agent state
            
        Returns:
            Updated agent state with critique
        """
        logger.info("Running reflection node")
        messages = [
            SystemMessage(content=PlannerPrompts.PLANNER_CRITIQUE), 
            HumanMessage(content=state['draft'])
        ]
        response = self.llm.model.invoke(messages)
        
        return {**state, "critique": response.content}
    
    def research_critique_node(self, state: AgentState) -> AgentState:
        """
        Research the critique by generating and executing search queries
        
        Args:
            state: Current agent state
            
        Returns:
            Updated agent state with additional queries and answers
        """
        logger.info("Running research critique node")
        past_queries = state.get('queries', [])
        answers = state.get('answers', [])
        
        # Format the queries and answers for prompt
        queries_str = "\n".join(past_queries)
        answers_str = "\n".join(answers)
        
        prompt = PlannerPrompts.PLANNER_CRITIQUE_ASSISTANT.format(
            queries=queries_str, 
            answers=answers_str
        )
        
        queries = self.llm.with_structured_output(
            Queries,
            prompt,
            state['critique']
        )
        
        for q in queries.queries:
            logger.info(f"Executing query: {q}")
            past_queries.append(q)
            results = self.search.search(q)
            
            for result in results:
                answers.append(result["combined_info"])
        
        return {**state, "queries": past_queries, "answers": answers}
    
    def should_continue(self, state: AgentState) -> str:
        """
        Determine whether to continue or end the workflow
        
        Args:
            state: Current agent state
            
        Returns:
            Next node name or END
        """
        if state["revision_number"] > state["max_revisions"]:
            logger.info(f"Reached max revisions ({state['max_revisions']}), stopping workflow")
            return END
        logger.info(f"Continuing with revision {state['revision_number']}")
        return "reflect"