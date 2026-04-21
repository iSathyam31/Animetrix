from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def get_mcp_server_config() -> dict:
    """
    Builds the MultiServerMCPClient config dict for the AniList MCP server.

    Two transport modes:
      stdio  — spawns `npx -y anilist-mcp` as a local subprocess (default for local dev).
      http   — connects to an already-running MCP HTTP server (use in Codespaces / CI).
               Start the server with: PORT=8081 npx anilist-mcp (HTTP mode).
               Then set ANILIST_MCP_TRANSPORT=http and ANILIST_MCP_HTTP_URL in .env.
    """
    if settings.ANILIST_MCP_TRANSPORT == "http":
        config: dict = {
            "transport": "streamable_http",
            "url": settings.ANILIST_MCP_HTTP_URL,
        }
        if settings.ANILIST_TOKEN:
            # AniList-Token header — per yuna0x0/anilist-mcp HTTP transport spec
            config["headers"] = {"Anilist-Token": settings.ANILIST_TOKEN}
        logger.info("AniList MCP transport: http → %s", settings.ANILIST_MCP_HTTP_URL)
        return {"anilist": config}

    # ── STDIO (default) ───────────────────────────────────────────────────────
    config = {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "anilist-mcp"],
    }
    if settings.ANILIST_TOKEN:
        config["env"] = {"ANILIST_TOKEN": settings.ANILIST_TOKEN}

    logger.info("AniList MCP transport: stdio (npx -y anilist-mcp)")
    return {"anilist": config}
