from typing import TypedDict, List, Optional, Annotated
import operator
import os
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from agents.navigator import navigator_node_wrapper
from agents.scout import scout_node_wrapper
from agents.curator import curator_node_wrapper
from agents.meteorologist import meteorologist_node_wrapper


# State Definition
class AgentState(TypedDict):
    query: str
    itinerary_data: Annotated[List[dict], operator.add]
    thought_trace: Annotated[List[str], operator.add]
    current_agent: str
    requires_hitl: bool
    hitl_question: Optional[str]
    hitl_response: Optional[str]
    hitl_approved: bool
    status: str


# Distributed Checkpointer for HITL State
memory = MemorySaver()

# Attempt to load Redis checkpointer if running via Docker/Production
redis_url = os.getenv("REDIS_URL")
if redis_url:
    try:
        from redis import Redis
        from langgraph.checkpoint.redis import RedisSaver
        redis_client = Redis.from_url(redis_url)
        memory = RedisSaver(redis_client)
    except ImportError:
        pass

# Graph Construction
workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("navigator", navigator_node_wrapper)
workflow.add_node("meteorologist", meteorologist_node_wrapper)
workflow.add_node("scout", scout_node_wrapper)
workflow.add_node("curator", curator_node_wrapper)

# Add Edges
workflow.set_entry_point("navigator")
workflow.add_edge("navigator", "meteorologist")
workflow.add_edge("meteorologist", "scout")
workflow.add_edge("scout", "curator")
workflow.add_edge("curator", END)

# Compile with checkpointer
app = workflow.compile(checkpointer=memory)
