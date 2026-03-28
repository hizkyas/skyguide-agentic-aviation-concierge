import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import asyncio
import socketio
from dotenv import load_dotenv
from fastapi import FastAPI

from agents.graph import app as agent_app

load_dotenv()

# ── Socket.IO (owns CORS, wraps FastAPI) ──────────────────────────────────────
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    logger=False,
    engineio_logger=False,
)

# ── FastAPI (REST only) ────────────────────────────────────────────────────────
http_app = FastAPI(title="SkyGuide AI API")

@http_app.get("/")
async def root():
    return {"status": "SkyGuide AI Backend Running"}


# Per-socket search counter so every new query gets a fresh LangGraph thread
_search_counter: dict[str, int] = {}

# ── Socket.IO events ──────────────────────────────────────────────────────────
@sio.event
async def connect(sid, environ):
    print(f"[SkyGuide] Client connected: {sid}")
    _search_counter[sid] = 0

@sio.event
async def disconnect(sid):
    print(f"[SkyGuide] Client disconnected: {sid}")
    _search_counter.pop(sid, None)

@sio.event
async def start_task(sid, data):
    query = data.get("query")
    if not query:
        await sio.emit("error", {"message": "Query is required"}, to=sid)
        return

    # Increment counter → unique thread_id per search, so MemorySaver never
    # accumulates state from a previous run on the same socket connection.
    _search_counter[sid] = _search_counter.get(sid, 0) + 1
    thread_id = f"{sid}_{_search_counter[sid]}"

    config = {"configurable": {"thread_id": thread_id}}
    initial_state = {
        "query": query,
        "itinerary_data": [],
        "thought_trace": [],
        "current_agent": "System",
        "requires_hitl": False,
        "hitl_question": None,
        "hitl_response": None,
        "hitl_approved": False,
        "status": "Starting",
    }
    print(f"[SkyGuide] Starting task for {sid} [thread={thread_id}]: {query}")
    await run_agent_workflow(sid, initial_state, config)

@sio.event
async def user_response(sid, data):
    response = data.get("response")
    print(f"[SkyGuide] HITL response: {response} from {sid}")
    # Use the same thread_id that the current search is running on
    thread_id = f"{sid}_{_search_counter.get(sid, 1)}"
    config = {"configurable": {"thread_id": thread_id}}
    await agent_app.aupdate_state(
        config,
        {"hitl_response": response, "requires_hitl": False, "hitl_approved": response == "approved"},
    )
    await run_agent_workflow(sid, None, config)


async def run_agent_workflow(sid, input_data, config):
    """
    Streams the LangGraph agent pipeline over WebSocket.
    Tracks cumulative thought/itinerary state across all node outputs.
    """
    try:
        all_thoughts = []
        all_itinerary = []

        async for output in agent_app.astream(input_data, config=config):
            for node_name, state in output.items():
                print(f"[SkyGuide] Node output: {node_name} | keys: {list(state.keys())}")

                thoughts = state.get("thought_trace", [])
                itinerary = state.get("itinerary_data", [])

                # Stream any new thoughts
                new_thoughts = thoughts[len(all_thoughts):]
                for thought in new_thoughts:
                    await sio.emit("thought", {
                        "message": thought,
                        "agent": state.get("current_agent", node_name)
                    }, to=sid)
                    await asyncio.sleep(0.3)
                all_thoughts = thoughts

                # Update itinerary if it grew
                if itinerary:
                    all_itinerary = itinerary
                    await sio.emit("itinerary_update", all_itinerary, to=sid)

                # HITL gate
                if state.get("requires_hitl"):
                    print(f"[SkyGuide] HITL requested for {sid}")
                    await sio.emit("hitl_request", {
                        "question": state.get("hitl_question"),
                        "agent": state.get("current_agent"),
                    }, to=sid)
                    return

        # All nodes complete — emit finish
        print(f"[SkyGuide] Workflow complete for {sid}. Itinerary items: {len(all_itinerary)}")
        await sio.emit("finish", {
            "itinerary": all_itinerary,
            "message": "Itinerary complete. SkyGuide AI has curated your travel plan.",
        }, to=sid)

    except Exception as e:
        import traceback
        print(f"[SkyGuide] ERROR for {sid}: {e}")
        traceback.print_exc()
        await sio.emit("error", {"message": str(e)}, to=sid)


@sio.on("submit_chat")
async def handle_submit_chat(sid, data):
    """Fallback simplistic LLM chat capability for adjusting trips on the UI."""
    msg = data.get("message", "")
    print(f"[{sid}] Chat received: {msg}")
    
    # Simulate an AI thought process
    await asyncio.sleep(1)
    
    # If a generic 'expensive' or 'cheaper' is asked, return a helpful response.
    # In a fully fleshed out v2, we push this back through LangGraph as a new message.
    if "cheap" in msg.lower() or "budget" in msg.lower():
        reply = "I understand you'd prefer budget options. I'll recalibrate the Navigator to scan low-cost carriers and budget hotels (under $100/night) for your upcoming destination."
    elif "extend" in msg.lower() or "longer" in msg.lower():
        reply = "Extending your stay by 2 days. The web scraper will look for updated multi-day packages."
    else:
         reply = "I've noted that adjustment. Will you be wanting me to formally re-run the mission with those changes?"
         
    await sio.emit("chat_response", {"message": reply}, to=sid)


# ── Mount: Socket.IO wraps FastAPI ────────────────────────────────────────────
@http_app.get("/api/itinerary/{thread_id}")
async def get_itinerary(thread_id: str):
    """Fetches a specific generated itinerary from the Checkpointer database."""
    config = {"configurable": {"thread_id": thread_id}}
    try:
        # Pull the state directly from LangGraph distributed state
        state_snapshot = agent_app.get_state(config)
        if state_snapshot and state_snapshot.values:
            return {"status": "success", "itinerary": state_snapshot.values.get("itinerary_data", [])}
        else:
             # Return empty standard payload if unrecognized (so UI doesn't crash)
            return {"status": "not_found", "itinerary": []}
    except Exception as e:
         return {"status": "error", "message": str(e)}

app = socketio.ASGIApp(sio, other_asgi_app=http_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
