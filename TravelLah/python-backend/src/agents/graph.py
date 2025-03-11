from typing import Dict, Any, List
from langgraph.graph import StateGraph, END
from requests import options
from state import AgentState
from nodes import AgentNodes
from settings.logging import setup_logger
from utils.json_utils import extract_json_from_llm_response

# Set up logger
logger = setup_logger("agents.graph")

class ItineraryWorkflow:
    """Workflow for generating travel itineraries using LangGraph"""
    
    def __init__(self, agent_nodes: AgentNodes):
        """
        Initialize the workflow with agent nodes
        
        Args:
            agent_nodes: Instance of AgentNodes containing node functions
        """
        self.nodes = agent_nodes
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """
        Build the workflow graph
        
        Returns:
            Compiled StateGraph
        """
        builder = StateGraph(AgentState)
        
        # Add nodes
        builder.add_node("planner", self.nodes.plan_node)
        builder.add_node("research_plan", self.nodes.research_plan_node)
        builder.add_node("generate", self.nodes.generation_node)
        builder.add_node("reflect", self.nodes.reflection_node)
        builder.add_node("research_critique", self.nodes.research_critique_node)
        
        # Set entry point
        builder.set_entry_point("planner")
        
        # Add conditional edges
        builder.add_conditional_edges(
            "generate", 
            self.nodes.should_continue, 
            {END: END, "reflect": "reflect"}
        )
        
        # Add standard edges
        builder.add_edge("planner", "research_plan")
        builder.add_edge("research_plan", "generate")
        builder.add_edge("reflect", "research_critique")
        builder.add_edge("research_critique", "generate")
        
        return builder.compile()
    
    def run(self, stream_options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run the workflow with the given options
        
        Args:
            stream_options: Dictionary containing workflow inputs
            
        Returns:
            Final itinerary as a dictionary
        """
        logger.info(f"Starting itinerary workflow with options: {stream_options}")
        thread = {"configurable": {"thread_id": "4"}}
        output_states = []
        final_draft_dict = None
        
        # Execute the workflow graph
        for state in self.graph.stream(options, thread):
            if state.get('generate') and state.get('generate').get("draft"):
                try:
                    draft_str = state.get('generate').get("draft")
                    draft_dict = extract_json_from_llm_response(draft_str)
                    final_draft_dict = draft_dict
                    logger.info("Successfully parsed draft itinerary")
                except Exception as e:
                    logger.error(f"Error parsing draft: {e}")
            
            output_states.append(state)
        
        if not final_draft_dict:
            error_msg = "Final draft itinerary not found in any state"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        logger.info("Workflow completed successfully")
        return final_draft_dict
    
