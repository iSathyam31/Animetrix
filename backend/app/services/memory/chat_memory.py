from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def get_chat_history(session_id: str) -> MongoDBChatMessageHistory:
    """
    Returns a MongoDB-backed LangChain chat message history for a given session.

    Each session_id maps to one document in the chat_histories collection.
    The history stores only the human/AI message pairs (tool calls are ephemeral).

    Usage:
        history = get_chat_history("session-abc123")
        past = history.messages          # load
        history.add_messages([...])      # save
        history.clear()                  # wipe session
    """
    return MongoDBChatMessageHistory(
        connection_string=settings.MONGODB_URI,
        database_name=settings.MONGODB_DB_NAME,
        collection_name=settings.MONGODB_COLLECTION_CHAT_HISTORY,
        session_id=session_id,
    )
