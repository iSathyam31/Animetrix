from app.core.logging import get_logger
from app.services.vision.vision_client import identify_character

logger = get_logger(__name__)


async def detect_character(image_source: str | bytes) -> dict:
    """
    Module 2 pipeline: Gemini Vision identifies the anime character from an image.

    Args:
        image_source: Raw bytes, file path, or base64-encoded image string.

    Returns:
        {
          "character_name": str,
          "anime_title": str,
          "confidence": "high" | "medium" | "low",
          "visual_traits": list[str],
          "notes": str
        }
    """
    logger.info("Gemini Vision - identifying character from image")
    result = await identify_character(image_source)
    logger.info(
        "Identified: '%s' (confidence: %s)",
        result.get("character_name"),
        result.get("confidence"),
    )
    return result
