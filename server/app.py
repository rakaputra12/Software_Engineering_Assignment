from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime
import os
import requests

# Load environment variables
load_dotenv()
TICKETMASTER_API_KEY = os.getenv("TICKETMASTER_API_KEY")

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (replace "*" with your frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/api/events")
async def get_events(
    city: str = Query("New York", description="City to search for events"),
    category: str = Query("", description="Event category (e.g., 'Music')"),
    radius: int = Query(10, description="Radius in kilometers to search within"),
    max_results: int = Query(100, description="Maximum number of events to return")  
):
    
    url = "https://app.ticketmaster.com/discovery/v2/events.json"
    size_per_request = 200  # Maximum allowed by the API
    total_events = []  # Store all events

    try:
        for page in range((max_results // size_per_request) + 1):
            if len(total_events) >= max_results:
                break  # Stop if we've reached the max_results limit
            
            params = {
                "apikey": TICKETMASTER_API_KEY,
                "city": city,
                "classificationName": category,
                "radius": radius,
                "unit": "km",
                "size": size_per_request,
                "page": page
            }

            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            # Check if `_embedded` and `events` exist
            if "_embedded" in data and "events" in data["_embedded"]:
                for event in data["_embedded"]["events"]:
                    start_info = event["dates"]["start"]
                    start_time = start_info.get("dateTime") or start_info.get("localDate")
                    venue_data = event["_embedded"]["venues"][0] if "_embedded" in event and "venues" in event["_embedded"] else {}
                    venue_name = venue_data.get("name") or venue_data.get("address", {}).get("line1") or "Unknown Venue"
                    latitude = venue_data.get("location", {}).get("latitude")
                    longitude = venue_data.get("location", {}).get("longitude")
                    image_url = event.get("images", [{}])[0].get("url", None)

                    total_events.append({
                        "id": event["id"],
                        "name": event["name"],
                        "url": event["url"],
                        "start_time": start_time,
                        "venue": venue_name,
                        "image": image_url,
                        "location": {
                            "lat": float(latitude) if latitude else None,
                            "lng": float(longitude) if longitude else None
                        }
                    })

                # Stop if fewer events are returned than the requested size
                if len(data["_embedded"]["events"]) < size_per_request:
                    break
            else:
                # No events found, break out of loop
                break

        # Sort events by start time
        total_events.sort(key=lambda e: datetime.strptime(e["start_time"], "%Y-%m-%dT%H:%M:%SZ") if "T" in e["start_time"] else datetime.strptime(e["start_time"], "%Y-%m-%d"))

        return {"events": total_events[:max_results]}

    except requests.exceptions.RequestException as e:
        return {"error": str(e)}, 500
