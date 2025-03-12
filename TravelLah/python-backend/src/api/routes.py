from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ..agents.ItineraryGraph import itinerary_workflow
from ..agents.ItineraryUpdateGraph import ItineraryUpdateWorkflow

from .ItinerarySchemas import  StreamOptions as SteamPlanOptions
from .ItinerarySchemas import ItineraryResponse

#from .ItinerarySchemas


from src.settings.logging import app_logger
from ..services.mongoDB import mongoDB

app = FastAPI(
    title="Travel Agent API", description="API for generating travel itineraries"
)
origins = ["http://localhost:3000", "localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/itinerary")
async def create_itinerary(options: SteamPlanOptions):
    """
    Generate a travel itinerary based on the provided options
    
    Args:
        options: StreamOptions object with task and parameters
        
    Returns:
        Generated itinerary
    """
    app_logger.info(f"Received itinerary request: {options.task[:50]}...")
    
    try:
        # Convert Pydantic model to dict
        stream_options = options.model_dump()
        
        # Run the itinerary workflow
        itinerary = itinerary_workflow.run(stream_options)
        
        app_logger.info("Successfully generated itinerary")
        if mongoDB.insert(itinerary):
            app_logger.info("Inserted itinerary into MongoDB")
        else:
            app_logger.error("Failed to insert itinerary into MongoDB")

        app_logger.info("Returning itinerary")
        return itinerary
    except Exception as e:
        error_msg = f"Error generating itinerary: {str(e)}"
        app_logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    

 update(self, trip_id: str, activity_id: int, updated_activity: dict) -> bool:
@app.update("/updateActivity")
async def update_activity(options:StreamOptions):
    try:
        # Convert Pydantic model to dict
        stream_options = options.model_dump()
        
        # Run the itinerary workflow
        itineraryupdate = ItineraryUpdateWorkflow.run(stream_options)
        
        app_logger.info("Successfully updated itinerary")
        if mongoDB.insert(itineraryupdate):
            app_logger.info("Update itinerary into MongoDB")
        else:
            app_logger.error("Failed to update itinerary into MongoDB")

        app_logger.info("Returning activity")
        return itineraryupdate
    except Exception as e:
        error_msg = f"Error updating activity: {str(e)}"
        app_logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)


@app.get("/")
async def read_root():
    return {"message": "Travel Agent API is running"}
