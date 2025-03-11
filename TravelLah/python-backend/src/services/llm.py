from typing import Any, List, Dict, TypeVar, Generic
from langchain_community.adapters.openai import convert_openai_messages
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from settings.config import settings
from settings.logging import setup_logger

# Set up logger
logger = setup_logger("services.llm")

T = TypeVar('T')

class LLMService:
    """Service for interacting with LLM models"""
    
    def __init__(self):
        """Initialize the LLM client with configured settings"""
        self.model = ChatGoogleGenerativeAI(
            temperature=settings.LLM_TEMPERATURE,
            model=settings.LLM_MODEL,
            convert_system_message_to_human=True,
            google_api_key=settings.GOOGLE_API_KEY
        )
    
    def invoke(self, system_prompt: str, user_prompt: str, retrieval_context: str = None) -> str:
        """
        Send a prompt to the LLM and return the response
        
        Args:
            system_prompt: The system prompt/instructions
            user_prompt: The user query/input
            retrieval_context: Optional retrieval context to provide additional information
            
        Returns:
            The LLM's response as a string
        """
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        if retrieval_context:
            messages.append({"role": "system", "content": f"Retrieved Context:\n{retrieval_context}"})
        
        lc_messages = convert_openai_messages(messages)
        response = self.model.invoke(lc_messages)
        logger.debug(f"LLM response: {response.content}")
        
        return response.content
    
    def with_structured_output(self, output_class: Generic[T], system_prompt: str, user_prompt: str) -> T:
        """
        Send a prompt to the LLM and parse the response as a structured output
        
        Args:
            output_class: The Pydantic model class to parse the response into
            system_prompt: The system prompt/instructions
            user_prompt: The user query/input
            
        Returns:
            An instance of the output_class
        """
        llm_with_output = self.model.with_structured_output(output_class)
        return llm_with_output.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt)
        ])