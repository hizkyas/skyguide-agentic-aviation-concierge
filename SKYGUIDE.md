PROJECT SPEC: SkyGuide AI
Role: Autonomous Visual Travel & Aviation Logistics Concierge

Status: Spec-Driven Development (SDD) Phase

Target Audience: General Users (Consumer-Facing) + Technical Recruiters (Google/L3-L4)

1. Vision & Human-Centric Goal
SkyGuide is not a chatbot; it is an Agentic Operator. It solves the "Travel Planning Fatigue" by taking a high-level natural language request (e.g., "Find me a flight from ADD to NBO for a pilot interview") and executing a multi-step search, ranking, and visualization process that anyone can understand.

2. Technical Stack
Orchestration: Python + LangGraph (Stateful, cyclic multi-agent workflows).

Frontend: Next.js 15 (App Router) + Tailwind CSS v4 + Shadcn UI.

Mapping: Mapbox GL JS or Leaflet (For visual flight paths and hotel plotting).

Agentic Tools: * Browser-Use / Playwright: To "see" and scrape live travel data.

Aviation APIs: (Mocked or Real) for flight schedules and airport METAR/TAF data.

Communication: WebSockets (Socket.io) for streaming the agent's "thought process" to the UI.

3. The Multi-Agent Architecture
The system consists of three specialized agents collaborating in a graph:

The Navigator (Aviation Expert): * Focuses on flight paths, airline reliability, and airport logistics.

Constraint: Must prioritize direct flights from Bole International (ADD) when possible.

The Scout (Hospitality & Search): * Uses browser tools to find accommodations based on specific needs (e.g., "Good Wi-Fi for interviews").

The Curator (UI/UX Orchestrator): * Formats the raw data into JSON structures that the Frontend Map and Timeline can render.

4. Key "Wow" Features (Visual)
Live Thought Trace: A side-panel showing: "Agent Navigator is checking Ethiopian Airlines availability..."

Interactive Flight Path: A 2D/3D map showing the arc from Origin to Destination.

Human-in-the-Loop (HITL) Gate: If a flight is cheap but has a 12-hour layover, the agent pauses and asks the user for permission to proceed via a UI Modal.

5. Development Rules for Claude
Instruction to AI: Please follow these rules strictly.

Separation of Concerns: Keep Agent logic in /backend/agents/ and UI components in /frontend/components/.

Streaming State: Every agent node in LangGraph must emit a "state update" via WebSocket so the UI stays reactive.

Aviation Precision: Use correct IATA codes (ADD, NBO, DXB) and respect aviation terminology (e.g., "Layover" vs. "Stopover").

PowerShell Compatibility: Provide backend setup scripts as .ps1 files or PowerShell-compatible commands.

Graceful Degradation: If a live scraping tool fails, the agent must "hallucination-check" and offer to retry or use cached/mock data.

6. Project Directory Structure
Plaintext
skyguide-ai/
├── backend/
│   ├── agents/            # Navigator, Scout, Curator logic
│   ├── tools/             # Playwright/Scraping & Aviation Toolsets
│   └── server.py          # FastAPI + WebSocket entry point
├── frontend/
│   ├── app/               # Next.js App Router
│   ├── components/        # MapView, AgentTerminal, ResultCard
│   └── lib/               # WebSocket & Mapbox hooks
├── CHRONOS_SPEC.md        # Reference to core data pipeline
└── SKYGUIDE_SPEC.md       # THIS DOCUMENT