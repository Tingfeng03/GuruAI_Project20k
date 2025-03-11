from tavily import TavilyClient
from typing import List, Dict, Any
from src.settings.config import Settings
from src.settings.logging import app_logger as logger

class SearchService:
    """Service for performing search operations"""
    
    def __init__(self):
        self.client = TavilyClient(api_key=Settings.TAVILY_API_KEY)
    
    def format_result(self, result: Dict[str, Any]) -> str:
        """
        Format a search result into a usable string
        
        Args:
            result: Search result dictionary
            
        Returns:
            Formatted string with content and metadata
        """
        lat = result.get("latitude", "")
        lng = result.get("longitude", "")
        addr = result.get("address", "")
        content = result.get("content", "")
        
        return f"{content}\nLat: {lat}, Long: {lng}, Address: {addr}"

# Initialize service
search_service = SearchService()