import base64
import json
import re
from pathlib import Path

from google import genai
from google.genai import types

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_MODEL = "gemini-2.5-flash-lite"

_IDENTIFICATION_PROMPT = """You are an expert anime and manga character recognition system.

Analyze the provided image carefully and identify the anime/manga character shown.

Respond in this exact JSON format (no markdown, no code blocks, raw JSON only):
{
  "character_name": "<full character name or 'Unknown' if unidentifiable>",
  "anime_title": "<anime or manga title or 'Unknown'>",
  "confidence": "<high | medium | low>",
  "visual_traits": ["<trait 1>", "<trait 2>", "<trait 3>", "..."],
  "notes": "<In-depth description of the character: their personality, role in the story, famous quotes or titles they hold, hobbies or interests known from the anime, and any iconic facts about them. Write 2-4 sentences.>"
}

Rules:
- Use the most well-known English/Romaji name for the character and series.
- If multiple characters are visible, identify the most prominent one.
- If you cannot identify the character, set confidence to "low" and describe visual traits.
- Never make up character names you are not confident about — use "Unknown" instead.
- For notes: always include at least one hobby/interest and one iconic fact if known."""


def _get_client() -> genai.Client:
    """
    Initialises the Gemini Vision client.
    Prioritises API key if GEMINI_VERTEX_KEY is set.
    Otherwise, falls back to Vertex AI (Project ID + ADC).
    """
    if settings.GEMINI_VERTEX_KEY:
        logger.info("Initialising Gemini Client using Vertex AI API Key")
        return genai.Client(
            api_key=settings.GEMINI_VERTEX_KEY,
            vertexai=True
        )

    if not settings.GOOGLE_CLOUD_PROJECT:
        raise ValueError(
            "Neither GEMINI_VERTEX_KEY nor GOOGLE_CLOUD_PROJECT is set. "
            "Please check your .env file."
        )

    logger.info("Initialising Gemini Client using Vertex AI (Project: %s)", settings.GOOGLE_CLOUD_PROJECT)
    return genai.Client(
        vertexai=True,
        project=settings.GOOGLE_CLOUD_PROJECT,
        location=settings.GOOGLE_CLOUD_LOCATION,
    )


def _to_bytes(image_source: str | bytes) -> bytes:
    """Normalise image_source to raw bytes."""
    if isinstance(image_source, bytes):
        return image_source
    if isinstance(image_source, str) and Path(image_source).exists():
        return Path(image_source).read_bytes()
    b64 = re.sub(r"^data:image/[^;]+;base64,", "", image_source)
    return base64.b64decode(b64)


async def identify_character(image_source: str | bytes) -> dict:
    """
    Sends an anime image to Gemini Vision and returns structured character identification.

    Args:
        image_source: Raw bytes, file path string, or base64-encoded image string.

    Returns:
        dict with keys: character_name, anime_title, confidence, visual_traits, notes
    """
    client = _get_client()
    image_bytes = _to_bytes(image_source)

    logger.info("Sending image to Gemini Vision for character identification")

    response = await client.aio.models.generate_content(
        model=_MODEL,
        contents=[
            _IDENTIFICATION_PROMPT,
            types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
        ],
    )

    raw_text = response.text.strip()
    logger.info("Gemini raw response: %s", raw_text[:200])

    clean = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_text, flags=re.MULTILINE).strip()
    return json.loads(clean)
