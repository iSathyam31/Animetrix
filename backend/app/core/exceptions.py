class AniListAPIError(Exception):
    """Raised when AniList GraphQL API returns an error."""

    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class MCPConnectionError(Exception):
    """Raised when the AniList MCP server fails to start or connect."""

    def __init__(self, transport: str, reason: str):
        self.transport = transport
        self.reason = reason
        super().__init__(f"MCP connection failed [{transport}]: {reason}")


class AgentExecutionError(Exception):
    """Raised when a LangGraph agent fails during execution."""

    def __init__(self, agent_name: str, reason: str):
        self.agent_name = agent_name
        self.reason = reason
        super().__init__(f"Agent '{agent_name}' failed: {reason}")


class ChatMemoryError(Exception):
    """Raised when MongoDB chat memory read/write fails. Non-fatal in most cases."""


class VectorStoreError(Exception):
    """Raised when FAISS operations fail."""
