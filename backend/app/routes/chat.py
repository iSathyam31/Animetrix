from fastapi import APIRouter, HTTPException

from app.agents.recommendation.runner import chat as agent_chat
from app.core.exceptions import AgentExecutionError
from app.core.logging import get_logger
from app.schemas.chat import ChatRequest, ChatResponse, ClearHistoryRequest
from app.services.memory.chat_memory import get_chat_history

router = APIRouter()
logger = get_logger(__name__)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Send a message to Chibi — the anime recommendation chatbot.
    Conversation history is stored in MongoDB per session_id.
    """
    try:
        response = await agent_chat(
            user_message=request.message,
            user_id=request.user_id,
            session_id=request.session_id,
        )
    except AgentExecutionError as exc:
        logger.error("Chat agent error: %s", exc)
        raise HTTPException(status_code=502, detail=str(exc))

    return ChatResponse(
        response=response,
        session_id=request.session_id,
        user_id=request.user_id,
    )


@router.post("/chat/clear")
async def clear_chat_history(request: ClearHistoryRequest):
    """
    Clear the conversation history for a given session.
    """
    try:
        history = get_chat_history(request.session_id)
        history.clear()
        logger.info("[session=%s] Chat history cleared", request.session_id)
    except Exception as exc:
        logger.warning("Could not clear history for session %s: %s", request.session_id, exc)
        raise HTTPException(status_code=500, detail="Failed to clear chat history")

    return {"status": "cleared", "session_id": request.session_id}
