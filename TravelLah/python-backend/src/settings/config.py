import os
import pathlib
from typing import List

from dotenv import load_dotenv

ROOT_DIR = pathlib.Path(__file__).parent.parent.parent.resolve()

load_dotenv(dotenv_path=ROOT_DIR / ".env")

class Settings:
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY")

    LLM_MODEL: str = "gemini-1.5-flash"
    LLM_TEMPERATURE: int = 0

    MAX_SEARCH_RESULTS: int = 2

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    def validate(self):
        missing_keys: List[str] = []
        if not self.GOOGLE_API_KEY:
            missing_keys.append("GOOGLE_API_KEY")
        if not self.TAVILY_API_KEY:
            missing_keys.append("TAVILY_API_KEY")
        
        if missing_keys:
            raise ValueError(f"Missing environment variables: {', '.join(missing_keys)}")
        return True

# gbloabl setting variable
# just import this is enough
settings = Settings()