from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ───────────────────────────────────────────────────────────────────
    APP_NAME: str = "Anime AI Platform"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    # Allow all origins — required for GitHub Codespaces (dynamic forwarded URLs)
    ALLOWED_ORIGINS: List[str] = ["*"]

    # ── Azure OpenAI (Chat) ───────────────────────────────────────────────────
    AZURE_OPENAI_API_KEY: str
    AZURE_OPENAI_ENDPOINT: str
    AZURE_DEPLOYMENT: str = "gpt-4.1"
    AZURE_OPENAI_API_VERSION: str = "2024-12-01-preview"

    # ── Azure OpenAI (Embeddings) ─────────────────────────────────────────────
    EMBEDDING_API_VERSION: str = "2024-02-01"
    EMBEDDING_DEPLOYMENT: str = "text-embedding-3-small"
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    # ── AniList MCP Server (yuna0x0/anilist-mcp) ─────────────────────────────
    # Token optional — only needed for authenticated ops (favourites, list edits)
    ANILIST_TOKEN: str = ""
    # "stdio"  → spawns `npx -y anilist-mcp` as subprocess (local dev)
    # "http"   → connects to a running MCP HTTP server (Codespaces / remote)
    ANILIST_MCP_TRANSPORT: str = "stdio"
    ANILIST_MCP_HTTP_URL: str = "http://localhost:8081/mcp"

    # ── MongoDB (chat memory) ─────────────────────────────────────────────────
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "anime_ai_platform"
    MONGODB_COLLECTION_CHAT_HISTORY: str = "chat_histories"

    # ── FAISS (vector store — Phase 3+) ───────────────────────────────────────
    FAISS_INDEX_PATH: str = "data/faiss_index"

    # ── Google Vertex AI (Module 2 — Image Character Detection) ────────────────
    GOOGLE_CLOUD_PROJECT: str = ""   # GCP project ID (e.g. my-project-123)
    GOOGLE_CLOUD_LOCATION: str = "us-central1"  # Vertex AI region


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
