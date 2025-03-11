from typing import TypedDict, List, Dict, Any
from pydantic import BaseModel

class AgentState(TypedDict):
    """TypedDict defining the state for the travel planning agent workflow"""
    task: str
    plan: str
    draft: str
    critique: str
    queries: List[str]
    answers: List[str]
    revision_number: int
    max_revisions: int
    itinerary_params: Dict[str, Any]

class Queries(BaseModel):
    """Pydantic model for structured output of search queries"""
    queries: List[str]