import os
import httpx
import random
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# ── Known airline operations per airport hub ─────────────────────────────────
HUB_AIRLINES: dict[str, list[dict]] = {
    "ADD": [
        {"airline": "Ethiopian Airlines", "prefix": "ET"},
    ],
    # Ethiopian domestic hubs — Ethiopian Airlines operates all domestic routes
    "DIR": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "BJR": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "GDQ": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "LLI": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "AXU": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "JIM": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "MQX": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "AWA": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "AMH": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "GMB": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "JIJ": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "DSE": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "SHC": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    "SZE": [{"airline": "Ethiopian Airlines", "prefix": "ET"}],
    # Kenyan domestic hubs
    "EDL": [{"airline": "Kenya Airways", "prefix": "KQ"}, {"airline": "Jambojet", "prefix": "JM"}],
    "KIS": [{"airline": "Kenya Airways", "prefix": "KQ"}, {"airline": "Jambojet", "prefix": "JM"}],
    "MYD": [{"airline": "Airkenya Express", "prefix": "P2"}],
    "LAU": [{"airline": "Airkenya Express", "prefix": "P2"}],
    "WJR": [{"airline": "Kenya Airways", "prefix": "KQ"}],
    "LOK": [{"airline": "Kenya Airways", "prefix": "KQ"}],
    "NBO": [
        {"airline": "Kenya Airways", "prefix": "KQ"},
        {"airline": "Ethiopian Airlines", "prefix": "ET"},
    ],
    "DXB": [
        {"airline": "Emirates", "prefix": "EK"},
        {"airline": "flydubai", "prefix": "FZ"},
    ],
    "DOH": [
        {"airline": "Qatar Airways", "prefix": "QR"},
    ],
    "LHR": [
        {"airline": "British Airways", "prefix": "BA"},
        {"airline": "Virgin Atlantic", "prefix": "VS"},
    ],
    "CDG": [
        {"airline": "Air France", "prefix": "AF"},
    ],
    "FRA": [
        {"airline": "Lufthansa", "prefix": "LH"},
    ],
    "AMS": [
        {"airline": "KLM", "prefix": "KL"},
    ],
    "IST": [
        {"airline": "Turkish Airlines", "prefix": "TK"},
    ],
    "JNB": [
        {"airline": "South African Airways", "prefix": "SA"},
        {"airline": "Ethiopian Airlines", "prefix": "ET"},
    ],
    "CAI": [
        {"airline": "EgyptAir", "prefix": "MS"},
    ],
    "KGL": [
        {"airline": "RwandAir", "prefix": "WB"},
        {"airline": "Ethiopian Airlines", "prefix": "ET"},
    ],
    "EBB": [
        {"airline": "Ethiopian Airlines", "prefix": "ET"},
        {"airline": "Kenya Airways", "prefix": "KQ"},
    ],
    "SIN": [
        {"airline": "Singapore Airlines", "prefix": "SQ"},
    ],
    "BKK": [
        {"airline": "Thai Airways", "prefix": "TG"},
        {"airline": "Emirates", "prefix": "EK"},
    ],
    "BOM": [
        {"airline": "Air India", "prefix": "AI"},
        {"airline": "Emirates", "prefix": "EK"},
    ],
    "NRT": [
        {"airline": "Japan Airlines", "prefix": "JL"},
        {"airline": "ANA", "prefix": "NH"},
    ],
    "SYD": [
        {"airline": "Qantas", "prefix": "QF"},
    ],
}

# ── Realistic price tiers by route distance ──────────────────────────────────
def _estimate_price(origin: str, destination: str) -> str:
    """Rough price estimate based on route type."""
    # Same airport — guard
    if origin == destination:
        return "N/A"

    # Ethiopian domestic (~$40–$120)
    ethiopian_domestic = {
        "ADD", "DIR", "BJR", "GDQ", "LLI", "AXU",
        "JIM", "MQX", "AWA", "AMH", "GMB", "JIJ", "DSE", "SHC", "SZE",
    }
    if origin in ethiopian_domestic and destination in ethiopian_domestic:
        return f"${random.randint(40, 120)}"

    # Kenyan domestic (~$50–$150)
    kenyan_domestic = {"NBO", "MBA", "EDL", "KIS", "MYD", "LAU", "WJR", "LOK", "WIL"}
    if origin in kenyan_domestic and destination in kenyan_domestic:
        return f"${random.randint(50, 150)}"

    # South African domestic (~$60–$200)
    sa_domestic = {"JNB", "CPT", "DUR", "GRJ", "BFN", "ELS", "PLZ"}
    if origin in sa_domestic and destination in sa_domestic:
        return f"${random.randint(60, 200)}"

    # Regional East Africa
    same_region = {
        ("ADD", "NBO"), ("ADD", "EBB"), ("ADD", "KGL"), ("ADD", "DAR"),
        ("NBO", "EBB"), ("NBO", "KGL"), ("NBO", "DAR"),
        ("JNB", "CPT"), ("JNB", "DUR"),
        ("LHR", "CDG"), ("LHR", "AMS"), ("LHR", "FRA"),
    }
    pair = (origin, destination)
    rev = (destination, origin)
    if pair in same_region or rev in same_region:
        return f"${random.randint(120, 280)}"

    # Long haul
    long_haul = {"JFK", "LAX", "SYD", "NRT", "SIN", "BOM", "PEK"}
    if origin in long_haul or destination in long_haul:
        return f"${random.randint(600, 1400)}"

    return f"${random.randint(280, 700)}"


def _random_departure() -> tuple[str, str]:
    """Generate a random realistic departure / arrival time pair."""
    base_hour = random.randint(5, 20)
    duration_hours = random.randint(1, 13)
    dep = datetime(2025, 1, 1, base_hour, random.choice([0, 15, 30, 45]))
    arr = dep + timedelta(hours=duration_hours, minutes=random.choice([0, 20, 40]))
    return dep.strftime("%I:%M %p"), arr.strftime("%I:%M %p")


class AviationTool:
    def __init__(self):
        self.api_key = os.getenv("AVIATIONSTACK_API_KEY")
        self.base_url = "https://api.aviationstack.com/v1"
        self.logger = logging.getLogger("AviationTool")

    async def search_flights(self, origin: str, destination: str):
        """
        Search for flights. Tries live AviationStack API if key is set,
        otherwise generates smart mock data for any global route.
        """
        if not self.api_key:
            self.logger.warning("No AviationStack API key — using Smart Mock Mode.")
            return self._get_mock_flights(origin, destination)

        try:
            async with httpx.AsyncClient() as client:
                params = {
                    "access_key": self.api_key,
                    "dep_iata": origin,
                    "arr_iata": destination,
                    "limit": 5,
                }
                response = await client.get(
                    f"{self.base_url}/flights", params=params, timeout=10.0
                )
                response.raise_for_status()
                data = response.json()

                flights = data.get("data", [])
                if not flights:
                    self.logger.info(f"No live data for {origin}→{destination}. Using mocks.")
                    return self._get_mock_flights(origin, destination)

                # Normalise real data
                normalized = []
                for f in flights:
                    normalized.append({
                        "flight_no": f.get("flight", {}).get("iata", "N/A"),
                        "airline": f.get("airline", {}).get("name", "Unknown Airline"),
                        "dep_time": f.get("departure", {}).get("scheduled", "N/A"),
                        "arr_time": f.get("arrival", {}).get("scheduled", "N/A"),
                        "status": f.get("flight_status", "scheduled"),
                        "price": _estimate_price(origin, destination),
                    })
                return normalized

        except Exception as e:
            self.logger.error(f"Aviation API error: {e}. Falling back to Smart Mock Mode.")
            return self._get_mock_flights(origin, destination)

    def _get_mock_flights(self, origin: str, destination: str) -> list[dict]:
        """
        Generates plausible mock flights for any origin→destination pair.
        Uses real airline prefixes where known, falls back to Ethiopian Airlines.
        """
        # Pick airline from origin hub, fallback to destination hub, else Ethiopian
        carriers = (
            HUB_AIRLINES.get(origin)
            or HUB_AIRLINES.get(destination)
            or [{"airline": "Ethiopian Airlines", "prefix": "ET"}]
        )

        flights = []
        for carrier in carriers[:2]:  # max 2 options
            flight_number = f"{carrier['prefix']}{random.randint(100, 999)}"
            dep_time, arr_time = _random_departure()
            flights.append({
                "flight_no": flight_number,
                "airline": carrier["airline"],
                "dep_time": dep_time,
                "arr_time": arr_time,
                "status": "scheduled",
                "price": _estimate_price(origin, destination),
            })

        return flights


def get_airport_info(iata_code: str):
    """Mocked airport METAR and logistics for major airports."""
    airports = {
        "ADD": {
            "name": "Bole International Airport",
            "location": "Addis Ababa, Ethiopia",
            "metar": "HAAB 281000Z 18005KT 9999 FEW025 24/12 Q1024",
        },
        "NBO": {
            "name": "Jomo Kenyatta International Airport",
            "location": "Nairobi, Kenya",
            "metar": "HKJK 281000Z 12008KT 9999 BKN030 26/15 Q1019",
        },
        "DXB": {
            "name": "Dubai International Airport",
            "location": "Dubai, UAE",
            "metar": "OMDB 281000Z 15010KT CAVOK 32/18 Q1012",
        },
        "LHR": {
            "name": "London Heathrow Airport",
            "location": "London, United Kingdom",
            "metar": "EGLL 281000Z 25012KT 9999 FEW020 14/08 Q1005",
        },
    }
    return airports.get(iata_code.upper())
