from typing import Dict, Any
from .llm import llm_service
from .tavilySearch import search_service
from ..settings.logging import app_logger as logger
from ..prompts.templates import PlannerPrompts
from langchain_community.adapters.openai import convert_openai_messages

class PlannerService:

    def __init__(self, llm, tavily):
        self.llm = llm
        self.tavily = tavily
    """Service for generating travel itineraries"""
    
    def build_dynamic_itinerary_query(self, itinerary_params: Dict[str, Any]) -> str:
        """
        Build a query string from itinerary parameters
        
        Args:
            itinerary_params: Dictionary of itinerary parameters
            
        Returns:
            Formatted query string
        """
        # Extract parameters with defaults
        userId = itinerary_params.get("userId", "Unknown User")
        tripId = itinerary_params.get("tripId", "Unknown Trip ID")
        destination = itinerary_params.get("destination", "Unknown Destination")
        num_days = itinerary_params.get("num_days", 1)
        # New keys for start and end date
        start_date = itinerary_params.get("start_date", "Not specified")
        end_date = itinerary_params.get("end_date", "Not specified")
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
            f"Start Date: {start_date}",
            f"End Date: {end_date}",
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
    
    def generate_refined_itinerary(self, query_text: str) -> str:
        """
        Generate a detailed itinerary based on the query
        
        Args:
            query_text: Query text describing the itinerary requirements
            
        Returns:
            Generated itinerary in JSON format
        """
        # Build system prompt
        sysmsg = (
            f"{PlannerPrompts.persona}\n"
            f"{PlannerPrompts.task}\n"
            f"{PlannerPrompts.context_prompt}\n"
            f"{PlannerPrompts.condition}\n"
            f"{PlannerPrompts.activity_context}\n"
            f"{PlannerPrompts.format_condition}"
        )

        retrieval_context = ""
        tavily_response = self.tavily.search(query=query_text, max_results=2)
        if tavily_response and "results" in tavily_response:
            retrieval_context = "\n".join([r.get("content", "") for r in tavily_response["results"]])
        
        messages = [
            {"role": "system", "content": sysmsg}
        ]
        if retrieval_context:
            # Append retrieval context to the system message instead of adding a new system message
            messages[0]["content"] += f"\n\nRetrieved Context:\n{retrieval_context}"
            
        # Now add the user message
        messages.append({"role": "user", "content": query_text})
        
        lc_messages = convert_openai_messages(messages)
        response = self.llm.invoke(lc_messages)
        logger.info("Raw LLM response (refined_itinerary): %s", response.content)
        return response.content

# Initialize service
planner_service = PlannerService(llm=llm_service.model, tavily=search_service.client)
