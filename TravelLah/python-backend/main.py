import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.settings.config import settings
from src.settings.logging import app_logger, setup_logger
from src.api.routes import app

logger = setup_logger("main")

if settings.validate():
    logger.info("Settings validated successfully")

if __name__ == "__main__":
    logger.info(f"Starting server at {settings.API_HOST}:{settings.API_PORT}")
    uvicorn.run(app, host=settings.API_HOST, port=settings.API_PORT)
