import httpx
import logging

logger = logging.getLogger("Meteorologist")

# Simple mapping logic or use the same AIRPORT_COORDS from scout
from tools.query_parser import IATA_NAMES

async def run_meteorologist(state: dict):
    state["current_agent"] = "Meteorologist"

    # Identify destination
    flight = next((i for i in state.get("itinerary_data", []) if i.get("type") == "flight"), None)
    destination = flight.get("destination", "NBO") if flight else "NBO"
    dest_label = IATA_NAMES.get(destination, destination)

    # Use Open-Meteo's geocoding API to find the destination's lat/lng
    state["thought_trace"].append(f"Meteorologist is checking real-time weather conditions for {dest_label}...")
    
    try:
        async with httpx.AsyncClient() as client:
            geo_response = await client.get(
                f"https://geocoding-api.open-meteo.com/v1/search?name={dest_label}&count=1&language=en&format=json"
            )
            geo_data = geo_response.json()
            
            if "results" in geo_data and geo_data["results"]:
                lat = geo_data["results"][0]["latitude"]
                lng = geo_data["results"][0]["longitude"]
                
                # Fetch current weather
                weather_response = await client.get(
                    f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current_weather=true"
                )
                weather_data = weather_response.json()
                
                if "current_weather" in weather_data:
                    current = weather_data["current_weather"]
                    temp = current.get("temperature")
                    state["thought_trace"].append(
                        f"Current temperature in {dest_label} is {temp}°C. Weather data secured."
                    )
                    
                    state["itinerary_data"].append({
                        "type": "weather",
                        "name": f"Live Weather in {dest_label}",
                        "details": f"Temperature is currently {temp}°C.",
                        "lat": lat,
                        "lng": lng
                    })
                else:
                    state["thought_trace"].append("Meteorologist could not fetch live weather. Falling back.")
            else:
                 state["thought_trace"].append(f"Meteorologist could not geo-locate {dest_label}.")
                 
    except Exception as e:
        logger.error(f"Weather API error: {e}")
        state["thought_trace"].append("Meteorologist encountered an API error.")

    return state

async def meteorologist_node_wrapper(state: dict):
    return await run_meteorologist(state)
