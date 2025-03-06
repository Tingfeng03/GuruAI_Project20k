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


from tavily import TavilyClient
from langchain_community.utilities.tavily_search import TavilySearchAPIWrapper
from langchain_community.tools.tavily_search import TavilySearchResults

load_dotenv(dotenv_path='.env')
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
class TavilyService:
    def __init__(self):
        self.search_api = TavilySearchAPIWrapper(tavily_api_key=TAVILY_API_KEY)
        self.description = (
            "A search engine optimized for comprehensive, accurate, "
            "and trusted results. Useful for answering questions "
            "about current events or recent information."
        )
        self.tavily_tool = TavilySearchResults(
            api_wrapper=self.search_api,
            description=self.description,
            search_depth="advanced"
        )

    def search_tavily(self, query: str) -> str:
        try:
            result = self.tavily_tool.invoke({"query": query})
            if not result:
                return "No results returned from Tavily Search."
            return result
        except Exception as e:
            logging.error(f"Error searching Tavily: {e}")
            if "unavailable" in str(e).lower() or "failed to connect" in str(e).lower():
                return "I'm sorry, but the Tavily service is currently unavailable. Please try again later."
            return "Error occurred. Please try again later."
        



class GeminiService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            temperature=0,
            model="gemini-1.5-pro",
            convert_system_message_to_human=True,
            google_api_key=GOOGLE_API_KEY
        )


    def build_dynamic_itinerary_query(self,itinerary_params: dict) -> str:
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
    


    

    def generate_refined_itinerary(self,query_text) -> str:
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
        sysmsg = f"{persona}\n{task}\n{context_prompt}\n{condition}"
        query_text = query_text



        prompt = [
                {
                    "role": "system",
                    "content": (
                        sysmsg
                    )
                },
                {
                    "role": "user",
                    "content": (
                        query_text
                    )
                }
            ]
        lc_messages = convert_openai_messages(prompt)
        response = self.llm.invoke(lc_messages)
        logging.info("Raw LLM response (refined_itinerary): %s", response.content)
        return response.content

if __name__ == "__main__":
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
    GeminiService =  GeminiService()
    query_text = GeminiService.build_dynamic_itinerary_query(itinerary_params)
    raw_output = GeminiService.generate_refined_itinerary(query_text)
    print("Raw Itinerary Output:\n", raw_output)