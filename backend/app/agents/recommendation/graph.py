from langchain_core.messages import SystemMessage
from langgraph.pregel import Pregel as CompiledGraph
from langgraph.prebuilt import create_react_agent

from app.agents.recommendation.prompts import RECOMMENDATION_SYSTEM_PROMPT
from app.services.ai.llm import get_llm


def build_recommendation_graph(tools: list) -> CompiledGraph:
    """
    Builds a LangGraph ReAct agent for anime/manga recommendations.

    Architecture:
        Human message
            │
            ▼
        [ agent node ]  ←──────────────────────┐
            │  calls LLM with system prompt      │
            │  + full message history            │
            ▼                                    │
        has tool calls?                          │
            ├── YES → [ tools node ]  ───────────┘
            └── NO  → END (return final AI message)

    Args:
        tools: List of LangChain BaseTool objects loaded from the AniList MCP server
               via langchain-mcp-adapters. The graph does NOT own the MCP connection —
               the caller (runner.py) manages the MCP lifecycle.

    Returns:
        A compiled LangGraph graph ready for ainvoke / astream.
        No checkpointer attached — conversation history is managed externally via MongoDB.
    """
    llm = get_llm()

    graph = create_react_agent(
        model=llm,
        tools=tools,
        prompt=SystemMessage(content=RECOMMENDATION_SYSTEM_PROMPT),
    )

    return graph
