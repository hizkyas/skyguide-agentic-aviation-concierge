async def run_curator(state: dict):
    """
    Curator Agent: UI/UX Orchestrator. Formats the raw data into JSON structures
    that the Frontend Map and Timeline can render.
    """
    state["current_agent"] = "Curator"
    state["thought_trace"].append("Curator is formatting the final itinerary for the UI...")

    itinerary = state.get("itinerary_data", [])
    num_flights = sum(1 for i in itinerary if i.get("type") == "flight")
    num_hotels = sum(1 for i in itinerary if i.get("type") == "hotel")

    summary = f"Curated itinerary complete: {num_flights} flight(s), {num_hotels} hotel(s). Your SkyGuide mission is ready."
    state["thought_trace"].append(summary)
    state["status"] = "Completed"

    return state


async def curator_node_wrapper(state: dict):
    return await run_curator(state)
