"""
Query Parser — resolves natural language city/country/airline names to IATA codes.
Understands inputs like "Addis", "London", "Ethiopian Airlines", "South Africa", etc.
"""

# ── City / Country / Airport name → IATA ────────────────────────────────────
CITY_TO_IATA: dict[str, str] = {
    # ── East Africa ──────────────────────────────────────────────────────────
    "addis ababa": "ADD", "addis": "ADD", "bole": "ADD", "bole airport": "ADD",
    "nairobi": "NBO", "jkia": "NBO",
    "mombasa": "MBA", "kilimanjaro": "JRO",
    "dar es salaam": "DAR", "dar": "DAR", "tanzania": "DAR",
    "kampala": "EBB", "uganda": "EBB", "entebbe": "EBB",
    "kigali": "KGL", "rwanda": "KGL",
    "zanzibar": "ZNZ", "bujumbura": "BJM", "burundi": "BJM",
    "djibouti": "JIB", "asmara": "ASM", "eritrea": "ASM",
    "mogadishu": "MGQ", "somalia": "MGQ",
    "hargeisa": "HGA", "juba": "JUB", "south sudan": "JUB",
    "khartoum": "KRT", "sudan": "KRT",
    "lusaka": "LUN", "zambia": "LUN",
    "harare": "HRE", "zimbabwe": "HRE",
    "lilongwe": "LLW", "malawi": "LLW",
    "maputo": "MPM", "mozambique": "MPM",

    # ── Ethiopian domestic airports ───────────────────────────────────────────
    "ethiopia": "ADD",  # country → capital by default
    "dire dawa": "DIR", "dire": "DIR",
    "bahir dar": "BJR", "bahirdar": "BJR", "bahir": "BJR",
    "gondar": "GDQ", "gonder": "GDQ",
    "lalibela": "LLI",
    "axum": "AXU", "aksum": "AXU",
    "jimma": "JIM",
    "mekelle": "MQX", "mekele": "MQX", "tigray": "MQX",
    "hawassa": "AWA", "awassa": "AWA",
    "arba minch": "AMH", "arba": "AMH",
    "gambella": "GMB",
    "jijiga": "JIJ",
    "dessie": "DSE",
    "shire": "SHC",
    "semera": "SZE",

    # ── Kenyan domestic airports ───────────────────────────────────────────────
    "kenya": "NBO",
    "eldoret": "EDL",
    "kisumu": "KIS",
    "malindi": "MYD",
    "lamu": "LAU",
    "wajir": "WJR",
    "lodwar": "LOK",
    "wilson": "WIL",  # Wilson Airport Nairobi domestic

    # ── South African domestic ────────────────────────────────────────────────
    "south africa": "JNB",
    "george": "GRJ",
    "bloemfontein": "BFN",
    "east london": "ELS",
    "port elizabeth": "PLZ", "gqeberha": "PLZ",

    # ── Rest of Africa ───────────────────────────────────────────────────────
    "johannesburg": "JNB", "joburg": "JNB", "south africa": "JNB",
    "cape town": "CPT",
    "durban": "DUR",
    "lagos": "LOS", "nigeria": "LOS",
    "abuja": "ABV",
    "accra": "ACC", "ghana": "ACC",
    "cairo": "CAI", "egypt": "CAI",
    "casablanca": "CMN", "morocco": "CMN",
    "tunis": "TUN", "tunisia": "TUN",
    "algiers": "ALG", "algeria": "ALG",
    "tripoli": "TIP", "libya": "TIP",
    "dakar": "DSS", "senegal": "DSS",
    "abidjan": "ABJ", "ivory coast": "ABJ",
    "douala": "DLA", "cameroon": "DLA",
    "kinshasa": "FIH", "drc": "FIH", "congo": "FIH",
    "luanda": "LAD", "angola": "LAD",
    "libreville": "LBV", "gabon": "LBV",
    "antananarivo": "TNR", "madagascar": "TNR",

    # ── Middle East ──────────────────────────────────────────────────────────
    "dubai": "DXB", "uae": "DXB", "united arab emirates": "DXB",
    "abu dhabi": "AUH",
    "sharjah": "SHJ",
    "doha": "DOH", "qatar": "DOH",
    "riyadh": "RUH", "saudi arabia": "RUH",
    "jeddah": "JED",
    "amman": "AMM", "jordan": "AMM",
    "beirut": "BEY", "lebanon": "BEY",
    "muscat": "MCT", "oman": "MCT",
    "kuwait": "KWI", "kuwait city": "KWI",
    "bahrain": "BAH",
    "tel aviv": "TLV", "israel": "TLV",
    "tehran": "IKA", "iran": "IKA",
    "baghdad": "BGW", "iraq": "BGW",

    # ── Turkey ───────────────────────────────────────────────────────────────
    "istanbul": "IST", "turkey": "IST",
    "ankara": "ESB",

    # ── Europe ───────────────────────────────────────────────────────────────
    "london": "LHR", "heathrow": "LHR", "uk": "LHR",
    "england": "LHR", "britain": "LHR",
    "paris": "CDG", "france": "CDG",
    "frankfurt": "FRA", "germany": "FRA",
    "amsterdam": "AMS", "netherlands": "AMS", "holland": "AMS",
    "rome": "FCO", "italy": "FCO",
    "milan": "MXP",
    "madrid": "MAD", "spain": "MAD",
    "barcelona": "BCN",
    "brussels": "BRU", "belgium": "BRU",
    "zurich": "ZRH", "switzerland": "ZRH",
    "stockholm": "ARN", "sweden": "ARN",
    "oslo": "OSL", "norway": "OSL",
    "copenhagen": "CPH", "denmark": "CPH",
    "helsinki": "HEL", "finland": "HEL",
    "vienna": "VIE", "austria": "VIE",
    "prague": "PRG", "czech": "PRG",
    "warsaw": "WAW", "poland": "WAW",
    "athens": "ATH", "greece": "ATH",
    "lisbon": "LIS", "portugal": "LIS",
    "moscow": "SVO", "russia": "SVO",
    "dubai": "DXB",
    "dublin": "DUB", "ireland": "DUB",
    "edinburgh": "EDI", "scotland": "EDI",
    "geneva": "GVA",

    # ── Asia ─────────────────────────────────────────────────────────────────
    "beijing": "PEK", "china": "PEK",
    "shanghai": "PVG",
    "guangzhou": "CAN",
    "tokyo": "NRT", "japan": "NRT",
    "osaka": "KIX",
    "hong kong": "HKG",
    "singapore": "SIN",
    "bangkok": "BKK", "thailand": "BKK",
    "mumbai": "BOM", "bombay": "BOM", "india": "BOM",
    "delhi": "DEL", "new delhi": "DEL",
    "kolkata": "CCU",
    "chennai": "MAA",
    "kuala lumpur": "KUL", "malaysia": "KUL",
    "jakarta": "CGK", "indonesia": "CGK",
    "manila": "MNL", "philippines": "MNL",
    "seoul": "ICN", "korea": "ICN", "south korea": "ICN",
    "taipei": "TPE", "taiwan": "TPE",
    "karachi": "KHI", "pakistan": "KHI",
    "colombo": "CMB", "sri lanka": "CMB",
    "dhaka": "DAC", "bangladesh": "DAC",
    "kathmandu": "KTM", "nepal": "KTM",
    "yangon": "RGN", "myanmar": "RGN",
    "hanoi": "HAN", "vietnam": "HAN",
    "ho chi minh": "SGN",
    "phnom penh": "PNH", "cambodia": "PNH",
    "vientiane": "VTE", "laos": "VTE",

    # ── North America ────────────────────────────────────────────────────────
    "new york": "JFK", "nyc": "JFK",
    "los angeles": "LAX", "la": "LAX",
    "chicago": "ORD",
    "miami": "MIA",
    "toronto": "YYZ", "canada": "YYZ",
    "montreal": "YUL",
    "vancouver": "YVR",
    "washington": "IAD", "washington dc": "IAD",
    "boston": "BOS",
    "houston": "IAH",
    "dallas": "DFW",
    "atlanta": "ATL",
    "san francisco": "SFO",
    "seattle": "SEA",
    "denver": "DEN",
    "phoenix": "PHX",
    "mexico city": "MEX", "mexico": "MEX",
    "cancun": "CUN",

    # ── Central & South America ───────────────────────────────────────────────
    "sao paulo": "GRU", "brazil": "GRU",
    "rio de janeiro": "GIG",
    "buenos aires": "EZE", "argentina": "EZE",
    "bogota": "BOG", "colombia": "BOG",
    "lima": "LIM", "peru": "LIM",
    "santiago": "SCL", "chile": "SCL",
    "caracas": "CCS", "venezuela": "CCS",
    "panama city": "PTY", "panama": "PTY",

    # ── Oceania ──────────────────────────────────────────────────────────────
    "sydney": "SYD", "australia": "SYD",
    "melbourne": "MEL",
    "brisbane": "BNE",
    "perth": "PER",
    "auckland": "AKL", "new zealand": "AKL",
}

# ── Airline name → their main hub IATA ──────────────────────────────────────
AIRLINE_TO_HUB: dict[str, str] = {
    "ethiopian airlines": "ADD",
    "ethiopian": "ADD",
    "kenya airways": "NBO",
    "emirates": "DXB",
    "emirate": "DXB",
    "qatar airways": "DOH",
    "qatar": "DOH",
    "turkish airlines": "IST",
    "turkish": "IST",
    "british airways": "LHR",
    "ba": "LHR",
    "lufthansa": "FRA",
    "air france": "CDG",
    "klm": "AMS",
    "rwandair": "KGL",
    "egypt air": "CAI",
    "egyptair": "CAI",
    "south african airways": "JNB",
    "south african": "JNB",
    "flydubai": "DXB",
    "air arabia": "SHJ",
    "etihad": "AUH",
    "swiss": "ZRH",
    "lufthansa": "FRA",
    "singapore airlines": "SIN",
    "cathay pacific": "HKG",
    "thai airways": "BKK",
    "japan airlines": "NRT",
    "jal": "NRT",
    "ana": "NRT",
    "air india": "DEL",
    "virgin atlantic": "LHR",
}

# ── IATA code → display name ──────────────────────────────────────────────────
IATA_NAMES: dict[str, str] = {
    # International hubs
    "ADD": "Addis Ababa",
    "NBO": "Nairobi",
    "DXB": "Dubai",
    "DOH": "Doha",
    "LHR": "London",
    "CDG": "Paris",
    "FRA": "Frankfurt",
    "AMS": "Amsterdam",
    "IST": "Istanbul",
    "JNB": "Johannesburg",
    "CPT": "Cape Town",
    "CAI": "Cairo",
    "LOS": "Lagos",
    "ACC": "Accra",
    "KGL": "Kigali",
    "EBB": "Entebbe",
    "DAR": "Dar es Salaam",
    "JFK": "New York",
    "LAX": "Los Angeles",
    "SIN": "Singapore",
    "BKK": "Bangkok",
    "BOM": "Mumbai",
    "NRT": "Tokyo",
    "SYD": "Sydney",
    "DUR": "Durban",
    "MBA": "Mombasa",
    "LIS": "Lisbon",
    "MAD": "Madrid",
    "FCO": "Rome",
    "ZRH": "Zurich",
    "VIE": "Vienna",
    "MXP": "Milan",
    "BCN": "Barcelona",
    "DEL": "Delhi",
    "KUL": "Kuala Lumpur",
    "ICN": "Seoul",
    "HKG": "Hong Kong",
    # Ethiopian domestic
    "DIR": "Dire Dawa",
    "BJR": "Bahir Dar",
    "GDQ": "Gondar",
    "LLI": "Lalibela",
    "AXU": "Axum",
    "JIM": "Jimma",
    "MQX": "Mekelle",
    "AWA": "Hawassa",
    "AMH": "Arba Minch",
    "GMB": "Gambella",
    "JIJ": "Jijiga",
    "DSE": "Dessie",
    "SHC": "Shire",
    "SZE": "Semera",
    # Kenyan domestic
    "EDL": "Eldoret",
    "KIS": "Kisumu",
    "MYD": "Malindi",
    "LAU": "Lamu",
    "WJR": "Wajir",
    "LOK": "Lodwar",
    "WIL": "Wilson (Nairobi domestic)",
    # South African domestic
    "GRJ": "George",
    "BFN": "Bloemfontein",
    "ELS": "East London",
    "PLZ": "Port Elizabeth",
}


def resolve_iata(text: str) -> str | None:
    """
    Given a free-text fragment (e.g. 'Nairobi', 'london', 'ethiopian airlines'),
    return the best matching IATA code, or None if not found.
    """
    t = text.lower().strip()

    # 1. Already a valid 3-letter IATA code (known or unknown — pass through)
    if len(t) == 3 and t.isalpha():
        return t.upper()

    # 2. Exact city match
    if t in CITY_TO_IATA:
        return CITY_TO_IATA[t]

    # 3. Airline match
    if t in AIRLINE_TO_HUB:
        return AIRLINE_TO_HUB[t]

    # 4. Partial / substring match (longer keys first to prefer specific matches)
    for key in sorted(CITY_TO_IATA.keys(), key=len, reverse=True):
        if key in t or t in key:
            return CITY_TO_IATA[key]
    for key, code in AIRLINE_TO_HUB.items():
        if key in t or t in key:
            return code

    return None


def parse_origin_destination(query: str) -> tuple[str, str]:
    """
    Extract origin and destination IATA codes from a free-text query.
    Handles patterns like:
      - "flight from Addis to London"
      - "Nairobi to Dubai"
      - "ADD to NBO"
      - "Ethiopian Airlines to Paris"
      - "I want to fly from Addis Ababa to New York"

    Returns (origin_iata, destination_iata). Defaults to ("ADD", "NBO") if not found.
    """
    import re

    q = query.lower()

    # ── Pattern 1: "from X to Y" or "X to Y" ────────────────────────────────
    # Match: "from <origin> to <destination>"
    m = re.search(
        r"(?:from\s+)(.+?)\s+(?:to|→|->\s*)(.+?)(?:\s+with|\s+and|\s+for|\s+hotel|\s+flight|\s+layover|$)",
        q
    )
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        origin = resolve_iata(left)
        destination = resolve_iata(right)
        if origin and destination:
            return origin, destination

    # ── Pattern 2: "X to Y" without "from" ──────────────────────────────────
    m = re.search(r"^(.+?)\s+(?:to|→|->\s*)(.+?)(?:\s+|$)", q)
    if m:
        left = m.group(1).strip()
        right = m.group(2).strip()
        origin = resolve_iata(left)
        destination = resolve_iata(right)
        if origin and destination:
            return origin, destination

    # ── Pattern 3: scan all words / phrases for airport matches ──────────────
    found = []
    tokens = re.findall(r"[a-z ]+", q)
    for tok in tokens:
        code = resolve_iata(tok.strip())
        if code and code not in found:
            found.append(code)
    if len(found) >= 2:
        return found[0], found[1]
    if len(found) == 1:
        # We found one airport — use as destination, default origin ADD
        return "ADD", found[0]

    return "ADD", "NBO"  # absolute fallback
