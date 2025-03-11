import json
import re
from src.settings.logging import logger

def extract_json_from_llm_response(text: str) -> dict:
    """
    Extract JSON from LLM response which might include markdown code blocks
    
    Args:
        text: Raw text from LLM that potentially contains JSON
        
    Returns:
        Parsed JSON as a dictionary
    """
    if not text:
        raise ValueError("Empty text provided")
    
    # Clean up the text to extract JSON
    text = text.strip()
    
    # Remove markdown code block syntax if present
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'```$', '', text)
    text = text.strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON: {e}")
        logger.error(f"Problematic text: {text}")
        raise ValueError(f"Failed to parse JSON: {e}")