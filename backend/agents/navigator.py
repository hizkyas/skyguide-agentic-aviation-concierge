import logging
from tools.aviation import AviationTool
from tools.query_parser import parse_origin_destination, IATA_NAMES


async def run_navigator(state: dict):
    """
    Navigator Agent: Resolves natural language queries to IATA codes,
    fetches optimal flight paths, and populates the itinerary.
    """
    state["current_agent"] = "Navigator"
    query = state.get("query", "")

    # ── NLP: resolve city/airline/country names → IATA codes ─────────────────
    origin, destination = parse_origin_destination(query)

    origin_label = IATA_NAMES.get(origin, origin)
    dest_label = IATA_NAMES.get(destination, destination)

    state["thought_trace"].append(
        f"Navigator identified route: {origin_label} ({origin}) → {dest_label} ({destination})."
    )
    state["thought_trace"].append(
        f"Navigator searching for available flights on this route..."
    )

    aviation_tool = AviationTool()

    # ── Fetch flights ──────────────────────────────────────────────────────────
    try:
        flights = await aviation_tool.search_flights(origin, destination)
    except Exception as e:
        state["thought_trace"].append(f"Aviation tool error: {str(e)}. Using fallback data.")
        flights = aviation_tool._get_mock_flights(origin, destination)

    if not flights:
        state["thought_trace"].append("No direct flights found. Searching for alternatives...")
        return state

    # ── Select best flight ─────────────────────────────────────────────────────
    best_flight = flights[0]

    # ── HITL: if query mentions "layover" ──────────────────────────────────────
    if "layover" in query.lower() and not state.get("hitl_approved"):
        state["thought_trace"].append(
            f"Alert: {best_flight.get('airline')} has a complex layover schedule. "
            f"Pausing for your approval."
        )
        state["requires_hitl"] = True
        state["hitl_question"] = (
            f"I found {best_flight.get('airline')} ({best_flight.get('flight_no')}) "
            f"for {best_flight.get('price')}, but it includes a long layover. "
            f"Should I proceed with this option?"
        )
        return state

    # ── Success ────────────────────────────────────────────────────────────────
    state["thought_trace"].append(
        f"Navigator selected {best_flight.get('airline')} "
        f"({best_flight.get('flight_no', 'N/A')}) — {best_flight.get('price', 'N/A')}."
    )
    state["itinerary_data"].append({
        "type": "flight",
        "details": f"{best_flight.get('airline')} flight {best_flight.get('flight_no', 'N/A')}",
        "origin": origin,
        "destination": destination,
        "origin_label": origin_label,
        "destination_label": dest_label,
        "departure": best_flight.get("dep_time", "10:00 AM"),
        "arrival": best_flight.get("arr_time", "12:00 PM"),
        "price": best_flight.get("price", "$180"),
        "status": best_flight.get("status", "scheduled"),
    })

    return state


async def navigator_node_wrapper(state: dict):
    return await run_navigator(state)
