from typing import Annotated, Sequence

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict


class RecommendationState(TypedDict):
    """
    LangGraph state for the Anime Recommendation agent.

    messages: Full conversation turn list (human, ai, tool, tool_result).
              The `add_messages` reducer appends new messages without overwriting.
    user_id:  Stable identifier for the user (used for MongoDB look-ups).
    session_id: Identifies the current conversation session.
    """

    messages: Annotated[Sequence[BaseMessage], add_messages]
    user_id: str
    session_id: str
