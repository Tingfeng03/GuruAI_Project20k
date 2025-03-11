from typing import List, Dict, Any
from tavily import TavilyClient
from settings.config import settings
from settings.logging import setup_logger

# Set up logger
logger = setup_logger("services.search")

class SearchService:
    """Service for search-related functionality"""
    
    def __init__(self):
        """Initialize the search service with configured settings"""
        self.client = TavilyClient(api_key=settings.TAVILY_API_KEY)
    
    def search(self, query: str) -> List[Dict[str, Any]]:
        """
        Perform a search with the given query
        
        Args:
            query: The search query
            
        Returns:
            List of search results with content and metadata
        """
        logger.info(f"Performing search for query: {query}")
        response = self.client.search(
            query=query, 
            max_results=settings.MAX_SEARCH_RESULTS
        )
        
        results = []
        if response and "results" in response:
            for r in response["results"]:
                lat = r.get("latitude", "")
                lng = r.get("longitude", "")
                addr = r.get("address", "")
                content = r.get("content", "")
                
                results.append({
                    "content": content,
                    "latitude": lat,
                    "longitude": lng,
                    "address": addr,
                    "combined_info": f"{content}\nLat: {lat}, Long: {lng}, Address: {addr}"
                })
                
        logger.debug(f"Search returned {len(results)} results")
        return results