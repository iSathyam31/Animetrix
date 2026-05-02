from contextlib import asynccontextmanager

from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = ROOT_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import get_logger
from app.routes import anime, character, chat, comparison

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Animetrix API starting up — version %s", settings.APP_VERSION)
    yield
    logger.info("Animetrix API shutting down")


app = FastAPI(
    title="Animetrix API",
    version=settings.APP_VERSION,
    description="AI-powered Anime & Manga Intelligence Platform",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global error handler ──────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception on %s %s: %s", request.method, request.url, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(chat.router,       prefix="/api/v1", tags=["Chat"])
app.include_router(character.router,  prefix="/api/v1", tags=["Character Detection"])
app.include_router(comparison.router, prefix="/api/v1", tags=["Anime Comparison"])
app.include_router(anime.router,      prefix="/api/v1", tags=["Anime Search"])


# ── Home ─────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def home():
    return {
        "name": "Animetrix API",
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "chat":       "POST /api/v1/chat",
            "clear_chat": "POST /api/v1/chat/clear",
            "detect":     "POST /api/v1/character/detect",
            "compare":    "POST /api/v1/comparison",
            "search":     "GET  /api/v1/anime/search?q=",
            "detail":     "GET  /api/v1/anime/{mal_id}",
        },
    }


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "version": settings.APP_VERSION}
