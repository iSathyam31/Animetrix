from langchain_core.messages import SystemMessage
from langgraph.pregel import Pregel as CompiledGraph
from langgraph.prebuilt import create_react_agent

from app.agents.comparison.prompts import COMPARISON_SYSTEM_PROMPT
from app.services.ai.llm import get_llm


def build_comparison_graph(tools: list) -> CompiledGraph:
    """
    Builds a LangGraph ReAct agent for anime / character comparisons.

    Architecture:
        Human message  (e.g. "Compare Attack on Titan vs Demon Slayer")
            │
            ▼
        [ agent node ]  ←──────────────────────┐
            │  LLM fetches AniList data          │
            │  via tools, then produces JSON     │
            ▼                                    │
        has tool calls?                          │
            ├── YES → [ tools node ]  ───────────┘
            └── NO  → END (return JSON string)

    Args:
        tools: AniList MCP tools loaded by the caller (runner.py).

    Returns:
        Compiled LangGraph graph ready for ainvoke.
    """
    llm = get_llm()

    graph = create_react_agent(
        model=llm,
        tools=tools,
        prompt=SystemMessage(content=COMPARISON_SYSTEM_PROMPT),
    )

    return graph
