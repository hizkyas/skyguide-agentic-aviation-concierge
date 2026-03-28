from typing import TypedDict, List, Optional, Annotated
import operator
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from agents.navigator import navigator_node_wrapper
from agents.scout import scout_node_wrapper
from agents.curator import curator_node_wrapper


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


# Memory Checkpointer for HITL
memory = MemorySaver()

# Graph Construction
workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("navigator", navigator_node_wrapper)
workflow.add_node("scout", scout_node_wrapper)
workflow.add_node("curator", curator_node_wrapper)

# Add Edges
workflow.set_entry_point("navigator")
workflow.add_edge("navigator", "scout")
workflow.add_edge("scout", "curator")
workflow.add_edge("curator", END)

# Compile with checkpointer
app = workflow.compile(checkpointer=memory)
