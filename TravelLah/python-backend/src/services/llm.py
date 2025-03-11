from langchain_community.adapters.openai import convert_openai_messages
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from pydantic import BaseModel
from typing import List, Dict, Any

from src.settings.config import settings
from src.settings.logging import app_logger as logger

class Queries(BaseModel):
    """Model for structured query output from LLM"""
    queries: List[str]

class LLMService:
    """Service for interacting with language models"""
    
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(
            temperature=settings.LLM_TEMPERATURE,
            model=settings.LLM_MODEL,
            convert_system_message_to_human=True,
            google_api_key=settings.GOOGLE_API_KEY
        )

# Initialize service
llm_service = LLMService()