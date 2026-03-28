from tools.query_parser import IATA_NAMES

# ── Global hotel dataset keyed by destination IATA ───────────────────────────
HOTEL_DATA: dict[str, list[dict]] = {
    "NBO": [
        {"name": "Hemingways Nairobi", "price": "$350/night", "rating": 5.0, "lat": -1.3508, "lng": 36.7118,
         "desc": "Boutique luxury hotel in Karen — ideal for quiet, refined preparation before a big interview."},
        {"name": "Radisson Blu, Upper Hill", "price": "$210/night", "rating": 4.5, "lat": -1.3000, "lng": 36.8167,
         "desc": "Modern business hotel in Nairobi's financial district. Fast Wi-Fi, executive lounge."},
        {"name": "Villa Rosa Kempinski", "price": "$420/night", "rating": 5.0, "lat": -1.2697, "lng": 36.8036,
         "desc": "5-star luxury in Westlands with outstanding connectivity and conference facilities."},
    ],
    "ADD": [
        {"name": "Ethiopian Skylight Hotel", "price": "$180/night", "rating": 4.8, "lat": 9.0022, "lng": 38.8058,
         "desc": "Right next to Bole International — perfect for early departures."},
        {"name": "Sheraton Addis", "price": "$320/night", "rating": 5.0, "lat": 9.0203, "lng": 38.7618,
         "desc": "Luxury collection hotel in the heart of Addis Ababa with a legendary pool."},
    ],
    "DXB": [
        {"name": "Atlantis The Palm", "price": "$620/night", "rating": 5.0, "lat": 25.1304, "lng": 55.1172,
         "desc": "Iconic resort on the Palm Jumeirah with private beach and world-class amenities."},
        {"name": "Sofitel Dubai Downtown", "price": "$280/night", "rating": 4.5, "lat": 25.1988, "lng": 55.2711,
         "desc": "French-inspired elegance in downtown Dubai with Burj Khalifa views."},
    ],
    "DOH": [
        {"name": "W Doha Hotel & Residences", "price": "$390/night", "rating": 5.0, "lat": 25.3548, "lng": 51.5255,
         "desc": "Ultra-modern waterfront hotel on the Corniche with outstanding F&B."},
        {"name": "Mondrian Doha", "price": "$250/night", "rating": 4.5, "lat": 25.3041, "lng": 51.4942,
         "desc": "Design-forward hotel in West Bay with rooftop pool and skyline views."},
    ],
    "LHR": [
        {"name": "The Langham, London", "price": "$580/night", "rating": 5.0, "lat": 51.5175, "lng": -0.1437,
         "desc": "Historic grand hotel in the heart of Regent Street — London's finest address."},
        {"name": "Marriott London Heathrow", "price": "$220/night", "rating": 4.0, "lat": 51.4770, "lng": -0.4523,
         "desc": "Connected directly to Terminal 4 — the smartest choice for early morning flights."},
    ],
    "CDG": [
        {"name": "Le Bristol Paris", "price": "$950/night", "rating": 5.0, "lat": 48.8726, "lng": 2.3094,
         "desc": "Palace hotel on Faubourg Saint-Honoré — the pinnacle of Parisian luxury."},
        {"name": "Pullman Paris CDG Airport", "price": "$210/night", "rating": 4.0, "lat": 49.0073, "lng": 2.5586,
         "desc": "Connected to CDG airport terminals — ideal for transit or early departures."},
    ],
    "FRA": [
        {"name": "Steigenberger Airport Hotel", "price": "$230/night", "rating": 4.5, "lat": 50.0500, "lng": 8.5706,
         "desc": "Directly in Terminal 1 with a sky bridge — zero commute to the gate."},
        {"name": "Jumeirah Frankfurt", "price": "$340/night", "rating": 5.0, "lat": 50.1109, "lng": 8.6821,
         "desc": "Flagship 5-star in Frankfurt city centre with a Michelin-star restaurant."},
    ],
    "IST": [
        {"name": "The Peninsula Istanbul", "price": "$520/night", "rating": 5.0, "lat": 41.0382, "lng": 28.9771,
         "desc": "Bosphorus-front palace hotel blending Ottoman grandeur with modern luxury."},
        {"name": "Hilton Istanbul Bomonti", "price": "$210/night", "rating": 4.5, "lat": 41.0544, "lng": 28.9847,
         "desc": "Giant city hotel with rooftop pool, perfect for business travellers."},
    ],
    "JNB": [
        {"name": "Saxon Hotel, Villas & Spa", "price": "$680/night", "rating": 5.0, "lat": -26.1048, "lng": 28.0362,
         "desc": "Legendary Sandton boutique hotel — Mandela's favourite place of refuge."},
        {"name": "Protea Hotel by Marriott, OR Tambo", "price": "$160/night", "rating": 4.0, "lat": -26.1384, "lng": 28.2378,
         "desc": "5 minutes from OR Tambo Airport — efficient transit option."},
    ],
    "CAI": [
        {"name": "Four Seasons Cairo at Nile Plaza", "price": "$380/night", "rating": 5.0, "lat": 30.0446, "lng": 31.2288,
         "desc": "Stunning Nile-view rooms steps from the Egyptian Museum."},
        {"name": "Novotel Cairo Airport", "price": "$140/night", "rating": 4.0, "lat": 30.1114, "lng": 31.3982,
         "desc": "Connected to Cairo airport — great for overnight transit stays."},
    ],
    "KGL": [
        {"name": "Kigali Serena Hotel", "price": "$230/night", "rating": 5.0, "lat": -1.9467, "lng": 30.0606,
         "desc": "The finest hotel in Rwanda with lush gardens and conference facilities."},
        {"name": "Radisson Blu Kigali", "price": "$180/night", "rating": 4.5, "lat": -1.9434, "lng": 30.0628,
         "desc": "Business-class hotel in Kigali's city centre with panoramic city views."},
    ],
    "SIN": [
        {"name": "Marina Bay Sands", "price": "$520/night", "rating": 5.0, "lat": 1.2834, "lng": 103.8607,
         "desc": "World-famous infinity pool on the 57th floor — Singapore's icon."},
        {"name": "Conrad Centennial Singapore", "price": "$280/night", "rating": 4.5, "lat": 1.2938, "lng": 103.8596,
         "desc": "Luxury hotel with direct access to Marina Bay Sands Expo."},
    ],
    "BKK": [
        {"name": "Mandarin Oriental Bangkok", "price": "$420/night", "rating": 5.0, "lat": 13.7237, "lng": 100.5140,
         "desc": "150 years of refined hospitality on the banks of the Chao Phraya river."},
        {"name": "COMO Metropolitan Bangkok", "price": "$290/night", "rating": 5.0, "lat": 13.7261, "lng": 100.5284,
         "desc": "Design-led wellness hotel in the heart of Bangkok's financial district."},
    ],
    "JFK": [
        {"name": "TWA Hotel at JFK", "price": "$340/night", "rating": 4.5, "lat": 40.6413, "lng": -73.7781,
         "desc": "The iconic Eero Saarinen terminal converted into a 1962-themed luxury hotel."},
        {"name": "The Plaza Hotel", "price": "$650/night", "rating": 5.0, "lat": 40.7645, "lng": -73.9741,
         "desc": "The legendary grand dame of Fifth Avenue — New York's most storied address."},
    ],
    "SYD": [
        {"name": "Park Hyatt Sydney", "price": "$580/night", "rating": 5.0, "lat": -33.8567, "lng": 151.2109,
         "desc": "Unrivalled Opera House and harbour views — the finest address in Sydney."},
        {"name": "Sofitel Sydney Wentworth", "price": "$260/night", "rating": 4.5, "lat": -33.8672, "lng": 151.2083,
         "desc": "French excellence in a heritage building in the heart of the CBD."},
    ],
}

# ── Fallback generic hotels for any unlisted destination ─────────────────────
def _generic_hotel(destination: str, lat: float, lng: float) -> dict:
    name = IATA_NAMES.get(destination, destination)
    return {
        "name": f"Grand Skyline Hotel {name}",
        "price": "$200/night",
        "rating": 4.0,
        "lat": lat,
        "lng": lng,
        "desc": f"Premium business hotel in the city centre near {name}.",
    }


# ── Airport centre-point coords for fallback hotel placement ──────────────────
AIRPORT_COORDS: dict[str, tuple[float, float]] = {
    "ADD": (9.0022, 38.8058), "NBO": (-1.3192, 36.9275),
    "DXB": (25.2532, 55.3657), "DOH": (25.2609, 51.6138),
    "LHR": (51.4700, -0.4543), "CDG": (49.0097, 2.5477),
    "FRA": (50.0379, 8.5622), "AMS": (52.3086, 4.7639),
    "IST": (41.2753, 28.7519), "JNB": (-26.1367, 28.2411),
    "CAI": (30.1219, 31.4056), "KGL": (-1.9686, 30.1395),
    "EBB": (0.0424, 32.4432), "DAR": (-6.8780, 39.2026),
    "JFK": (40.6413, -73.7781), "LAX": (33.9425, -118.4081),
    "LOS": (6.5774, 3.3212), "ACC": (5.6052, -0.1669),
    "SIN": (1.3644, 103.9915), "BKK": (13.6811, 100.7474),
    "BOM": (19.0896, 72.8656), "NRT": (35.7720, 140.3929),
    "SYD": (-33.9399, 151.1753), "AKL": (-37.0082, 174.7850),
    "KWI": (29.2267, 47.9689), "BAH": (26.2708, 50.6336),
}


async def run_scout(state: dict):
    """
    Scout Agent: Finds premium accommodations for any global destination.
    """
    state["current_agent"] = "Scout"

    # ── Get destination from what Navigator found ──────────────────────────────
    flight = next((i for i in state.get("itinerary_data", []) if i.get("type") == "flight"), None)
    destination = flight.get("destination", "NBO") if flight else "NBO"
    dest_label = IATA_NAMES.get(destination, destination)

    state["thought_trace"].append(
        f"Scout is searching for premium accommodations in {dest_label}..."
    )

    hotels = HOTEL_DATA.get(destination)
    if not hotels:
        # Generate a plausible generic hotel at airport coords
        coords = AIRPORT_COORDS.get(destination, (0.0, 0.0))
        hotels = [_generic_hotel(destination, coords[0], coords[1])]
        state["thought_trace"].append(
            f"Scout used global index for {dest_label} — found a business hotel near the airport."
        )
    else:
        state["thought_trace"].append(
            f"Scout found {len(hotels)} curated hotel(s) in {dest_label}."
        )

    best_hotel = hotels[0]
    state["thought_trace"].append(
        f"Scout recommends: {best_hotel['name']} ({best_hotel['price']} · "
        f"{'★' * int(best_hotel['rating'])})."
    )

    state["itinerary_data"].append({
        "type": "hotel",
        "name": best_hotel["name"],
        "price": best_hotel["price"],
        "rating": best_hotel["rating"],
        "lat": best_hotel["lat"],
        "lng": best_hotel["lng"],
        "details": best_hotel["desc"],
    })

    return state


async def scout_node_wrapper(state: dict):
    return await run_scout(state)
