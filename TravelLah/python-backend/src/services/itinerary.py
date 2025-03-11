from typing import Dict, Any
from services.llm import LLMService
from services.tavilySearch import SearchService
from prompts.templates import PlannerPrompts
from settings.logging import setup_logger

# Set up logger
logger = setup_logger("services.itinerary")

class ItineraryService:
    """Service for generating travel itineraries"""
    
    def __init__(self, llm_service: LLMService, search_service: SearchService):
        """
        Initialize the itinerary service
        
        Args:
            llm_service: The LLM service instance
            search_service: The search service instance
        """
        self.llm = llm_service
        self.search = search_service
    
    def build_dynamic_itinerary_query(self, itinerary_params: Dict[str, Any]) -> str:
        """
        Build a query string for the itinerary from parameters
        
        Args:
            itinerary_params: Dictionary of itinerary parameters
            
        Returns:
            A formatted query string
        """
        params_with_defaults = {
            "userId": itinerary_params.get("userId", "Unknown User"),
            "tripId": itinerary_params.get("tripId", "Unknown Trip ID"),
            "destination": itinerary_params.get("destination", "Unknown Destination"),
            "num_days": itinerary_params.get("num_days", 1),
            "start_date": itinerary_params.get("start_date", "Not specified"),
            "end_date": itinerary_params.get("end_date", "Not specified"),
            "party_size": itinerary_params.get("party_size", 2),
            "num_rooms": itinerary_params.get("num_rooms", 2),
            "budget": itinerary_params.get("budget", "moderate"),
            "activities": itinerary_params.get("activities", "varied activities"),
            "food": itinerary_params.get("food", "local cuisine"),
            "pace": itinerary_params.get("pace", "relaxed"),
            "notes": itinerary_params.get("notes", "")
        }
        
        query_parts = [f"{key}: {value}" for key, value in params_with_defaults.items()]
        query = " | ".join(query_parts)
        
        logger.debug(f"Built itinerary query: {query}")
        return query
    
    def generate_refined_itinerary(self, query_text: str) -> str:
        """
        Generate a refined itinerary based on the query
        
        Args:
            query_text: The query text describing the itinerary requirements
            
        Returns:
            A JSON string containing the itinerary
        """
        logger.info(f"Generating refined itinerary for query: {query_text}")
        
        # Get search results for context
        search_results = self.search.search(query_text)
        retrieval_context = "\n".join([r.get("combined_info", "") for r in search_results])
        
        # Generate itinerary using LLM
        itinerary = self.llm.invoke(
            system_prompt=PlannerPrompts.ITINERARY_GENERATOR,
            user_prompt=query_text,
            retrieval_context=retrieval_context if retrieval_context else None
        )
        
        return itinerary