from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from src.settings.config import settings
from src.settings.logging import app_logger as logger
import copy

class MongoDB:
    def __init__(self, password: str):
        self.client = MongoClient(f"mongodb+srv://GuruAI_Admin:{password}@guruaiproject20k.the6c.mongodb.net/?retryWrites=true&w=majority&appName=GuruAIProject20k", server_api=ServerApi("1"))
        self.database = self.client["TravelLah"]
        self.collection = self.database["UserItinerary"]

    def checkConnection(self) -> bool:
        try:
            self.client.admin.command("ping")
            return True
        except Exception as e:
            return False

    def insert(self, data: dict) -> bool:
        data_copy = copy.deepcopy(data)
        try:
            self.collection.insert_one(data_copy)
            return True
        except Exception as e:
            return False

    def close(self):
        self.client.close()
        logger.info("Closed connection to MongoDB")

mongoDB = MongoDB(settings.MONGODB_PASS)