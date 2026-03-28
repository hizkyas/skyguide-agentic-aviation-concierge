<div align="center">
  
  # 🛫 SkyGuide AI
  **A Distributed Multi-Agent Travel Concierge Architecture**
  
  <br />
  
  ![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
  ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
  ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
  ![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

</div>

<br />

## 📖 Overview
SkyGuide AI is a **production-grade, scalable multi-agent platform** designed to completely autonomously curate and book highly specific international travel itineraries. Built on a distributed event-driven architecture, the application utilizes LangGraph to orchestrate a 'swarm' of specialized Large Language Models interacting with dynamic web environments and internal routing algorithms.

Designed entirely from the ground up to showcase advanced **System Design, DevOps, and Full-Stack Engineering capabilities**.

---

## 🏗️ Core Architecture & Agent Swarm
Instead of relying on a single slow, hallucination-prone prompt, SkyGuide splits the computational workload across a highly robust **LangGraph State Graph** consisting of 4 distinct LLM profiles:

1. **Navigator (Routing Logic):** Interacts flawlessly with the `AviationStack REST API` to map optimal multi-stop flight combinations, calculate geodesic distances, and enforce strict carrier budgets.
2. **Meteorologist (Real-time Analytics):** Operates standalone API polling against `Open-Meteo` to cross-reference flight timelines with severe storm fronts or optimal local weather patterns.
3. **Scout (Playwright Scraper):** Deploys a headless Chromium browser instance natively over Docker to bypass generic HTTP blocks. It stealth-scrapes dynamic HTML elements mapping to hotel prices and booking links.
4. **Curator (Orchestrator):** The final checkpoint. Validates the JSON array payloads built by prior nodes, resolves data conflicts, and pushes the payload strictly over WebSockets down to the React client.

---

## 💻 Technical Stack

### ⚡ Frontend (Next.js & React)
- **Framework:** Next.js `App Router` architecture using React Server Components.
- **Styling:** Premium, customized TailwindCSS tokens utilizing dark-mode, glass-morphism, and hardware-accelerated micro-animations.
- **State Management:** Real-time bi-directional streaming via `Socket.io-client` syncing with deeply nested React hooks.
- **Layouts:** Unified multi-page ecosystem (`/explore`, `/dashboard`, `/architecture` views) enforcing `re-usable CSS Grid/Flexbox` boundaries.

### ⚙️ Backend (Python Fast API)
- **API Runtime:** Fully async `FastAPI` instance managing both standard REST endpoints and pure WebSocket (`python-socketio`) streaming layers.
- **LLM Engine:** Customized Python `LangGraph` pipeline controlling directed cyclic node triggers.
- **Persistence Layer:** `SQLAlchemy` ORM mapping User and Mission schemas cleanly into an internal Postgres volume. Wait-time checkpointing managed exclusively via `langgraph-checkpoint-redis` pointing to our cloud clusters.
- **Automation:** Native `Playwright-async` library bound directly inside backend agent tools for live Google/DuckDuckGo data mining.

### 🐳 DevOps & Infrastructure
- **Containerization:** Containerized 100% of the monolithic environments into independent Docker images joined by an overarching `docker-compose.yml`.
- **Microservices:** Separated the Frontend Web UI, Python Headless API, PostgreSQL Persistence Engine, and distributed Redis Cache into isolated, scalable internal networks.

---

## 🚀 Key Features Highlights
✓ **Live Agent Terminal:** An interactive, `lucide-react` powered dashboard streaming the explicit cognitive "thought trace" of the backend LLM loop directly to the browser. <br/>
✓ **Follow-Up State Memory:** Because of Redis Checkpointing, users can type direct chat adjustments ("make it cheaper", "extend by 2 days") into the NextJS dashboard and LangGraph will seamlessly reload the specific user's historic multi-turn vector state. <br/>
✓ **Shareable Static Routing:** Every flight plan dynamically generates an ephemeral UUID. Third-parties can visit `/trip/[id]` where Next.js programmatically scrapes the exact read-only state array without booting any LLMs.

---

## 🛠️ Run it Locally
1. Clone the repository: `git clone https://github.com/yourusername/skyguide-ai`
2. Populate necessary tokens in `./backend/.env` (Anthropic API, AviationStack, Database URLs).
3. Either spin up standard processes (`npm run dev` & `python server.py`) or boot the entire cluster via Docker:
```bash
docker-compose up --build -d
```
