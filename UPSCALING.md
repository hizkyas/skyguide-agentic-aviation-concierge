# SkyGuide AI: Core Upscaling & Architecture Roadmap

This document serves as the master blueprint for scaling SkyGuide AI. It is designed to brief future agents/developers on the target architecture, standard practices, and immediate milestones.

## 🧭 Vision
Transform SkyGuide AI from a stateless, localized prototype into a distributed, production-grade Multi-Agent system capable of live-web interaction, persistent state management, and real-time complex routing.

## 🏗️ Architectural Target

### 1. Persistent State (Redis & PostgreSQL)
- **Current Pattern:** LangGraph uses `MemorySaver` (in-memory, lost on restart).
- **Target Pattern:** Use `redis.asyncio` / `langgraph-checkpoint-redis` combined with FastAPI for scalable websocket sessions.
- **Database:** PostgreSQL (via SQLAlchemy or Prisma) to track User Profiles, saved itineraries, and API key management.

### 2. Live Web Interactions (Playwright)
- **Current Pattern:** `Scout` agent reads from a local mock hotel dataset. `browser.py` is a stub.
- **Target Pattern:** Use `Playwright` within `browser.py` explicitly so `Scout` browses booking.com / Expedia to read live pricing from the DOM and extract real-world availability.

### 3. Expanded Agent Capabilities
- **Navigator (Flight Routing):** Integrate Amadeus / Skyscanner instead of just AviationStack for realistic multi-leg routing options.
- **Meteorologist (New Agent):** An agent specifically running OpenWeatherMap lookups for destination weather to provide packing lists and travel advice.
- **Consul (New Agent):** A dedicated node to evaluate passport/visa requirements based on origin and destination.

### 4. Containerization & DevOps
- **Current Pattern:** Manual shell execution (`python server.py`, `npm run dev`).
- **Target Pattern:** `docker-compose.yml` defining `frontend`, `backend`, `redis`, and `postgres` containers. Playwright environments require the `mcr.microsoft.com/playwright` docker image.

## 🚦 Rule of Engagement for Other Agents
1. **Always use asynchronous flow:** Both FastAPI and `AgentState` streaming must remain entirely asynchronous (`async/await`) to maintain WebSocket throughput.
2. **Never block the event loop:** Browser tasks and LLM calls should `await`. 
3. **Graceful Degradation:** If an external tool (AviationStack API, Playwright DOM parse) fails, the agent must instantly switch to a high-fidelity "Smart Mock Mode" rather than faulting.

---
*Created per user request for project scaling alignment.*
