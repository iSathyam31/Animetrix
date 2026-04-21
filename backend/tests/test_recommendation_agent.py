"""
Interactive test script for Module 1 — Anime Recommendation Chatbot (Chibi).

Run from the project root (AniList/ folder):
    cd backend
    python -m tests.test_recommendation_agent

Prerequisites:
    - .env file configured with Azure OpenAI credentials and ANILIST_TOKEN
    - Node.js 18+ installed (for stdio MCP transport: npx anilist-mcp)
    - MongoDB running locally OR set MONGODB_URI in .env (optional — gracefully degraded if unavailable)

Transport modes:
    stdio (default): npx -y anilist-mcp is spawned as a subprocess automatically.
    http:  Set ANILIST_MCP_TRANSPORT=http and start MCP server separately:
               PORT=8081 npx anilist-mcp
           Then re-run this script.
"""

import asyncio
import sys
import uuid
from pathlib import Path

# Allow running as `python -m tests.test_recommendation_agent` from backend/
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent.parent / ".env")

from app.agents.recommendation.runner import chat
from app.core.logging import get_logger, setup_logging

setup_logging()
logger = get_logger(__name__)

BANNER = """
╔══════════════════════════════════════════════════════════════╗
║          Chibi — Anime Recommendation Chatbot               ║
║                      Module 1 · Test                         ║
╚══════════════════════════════════════════════════════════════╝
"""


async def main() -> None:
    session_id = str(uuid.uuid4())
    user_id = "test_user_001"

    print(BANNER)
    print(f"  Session ID : {session_id}")
    print(f"  User ID    : {user_id}")
    print("  Commands   : 'new' = new session | 'quit' = exit\n")
    print("─" * 64)

    nonlocal_session = {"session_id": session_id}

    while True:
        try:
            user_input = input("\nYou: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n\nGoodbye!")
            break

        if not user_input:
            continue

        if user_input.lower() in ("quit", "exit", "q"):
            print("\nGoodbye!")
            break

        if user_input.lower() == "new":
            nonlocal_session["session_id"] = str(uuid.uuid4())
            print(f"\n[New session started: {nonlocal_session['session_id']}]")
            continue

        print("\nChibi: thinking...\n")

        try:
            response = await chat(
                user_message=user_input,
                user_id=user_id,
                session_id=nonlocal_session["session_id"],
            )
            print(f"Chibi:\n{response}")
        except Exception as exc:
            logger.error("Agent error: %s", exc, exc_info=True)
            print(f"\n[Error] {exc}")


if __name__ == "__main__":
    asyncio.run(main())
