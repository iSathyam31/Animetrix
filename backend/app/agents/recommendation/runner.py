from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_mcp_adapters.client import MultiServerMCPClient

from app.agents.recommendation.graph import build_recommendation_graph
from app.core.exceptions import AgentExecutionError
from app.core.logging import get_logger
from app.services.memory.chat_memory import get_chat_history
from app.services.mcp.anilist_client import get_mcp_server_config

logger = get_logger(__name__)


async def chat(
    user_message: str,
    user_id: str,
    session_id: str,
) -> str:
    """
    Single chat turn for the Recommendation agent.

    Flow:
      1. Load full conversation history from MongoDB (human/AI pairs only).
      2. Create MCP client and load AniList tools via await client.get_tools().
         In langchain-mcp-adapters 0.2.x each tool call opens its own session.
      3. Build LangGraph ReAct graph and run it with history + new human message.
      4. Extract the final AI message from the result state.
      5. Persist the new human + AI message pair back to MongoDB.
      6. Return the AI response string.
    """
    # 1. Load history
    past_messages: list[BaseMessage] = []
    try:
        history = get_chat_history(session_id)
        past_messages = history.messages
        logger.info(
            "[session=%s] Loaded %d past messages from MongoDB",
            session_id,
            len(past_messages),
        )
    except Exception as exc:
        logger.warning("[session=%s] Could not load chat history: %s", session_id, exc)

    # 2. Load MCP tools
    try:
        mcp_config = get_mcp_server_config()
        client = MultiServerMCPClient(mcp_config)
        tools = await client.get_tools()
        logger.info("Loaded %d AniList MCP tools", len(tools))
    except Exception as exc:
        raise AgentExecutionError("recommendation", f"Failed to load MCP tools: {exc}") from exc

    # 3. Build graph and run
    try:
        graph = build_recommendation_graph(tools)
        initial_state = {
            "messages": past_messages + [HumanMessage(content=user_message)],
            "user_id": user_id,
            "session_id": session_id,
        }
        result = await graph.ainvoke(initial_state)
    except Exception as exc:
        raise AgentExecutionError("recommendation", str(exc)) from exc

    # 4. Extract final AI message
    ai_message: AIMessage = result["messages"][-1]
    ai_response: str = ai_message.content

    # 5. Persist human + AI pair to MongoDB
    try:
        history = get_chat_history(session_id)
        history.add_messages(
            [
                HumanMessage(content=user_message),
                AIMessage(content=ai_response),
            ]
        )
        logger.info("[session=%s] Saved message pair to MongoDB", session_id)
    except Exception as exc:
        # Non-fatal — log and continue. Response is still returned to the user.
        logger.warning("[session=%s] Could not save chat history: %s", session_id, exc)

    return ai_response
