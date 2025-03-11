from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from src.settings.config import settings

class MongoDB:
    def __init__(self, password: str):
        self.client = MongoClient(f"mongodb+srv://GuruAI_Admin:{password}@guruaiproject20k.the6c.mongodb.net/?retryWrites=true&w=majority&appName=GuruAIProject20k", server_api=ServerApi("1"))

    def checkConnection(self) -> bool:
        try:
            self.client.admin.command("ping")
            return True
        except Exception as e:
            return False
