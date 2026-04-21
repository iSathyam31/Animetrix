from fastapi import APIRouter, HTTPException, UploadFile, File

from app.core.logging import get_logger
from app.schemas.character import CharacterDetectionResult
from app.services.character_detection.pipeline import detect_character

router = APIRouter()
logger = get_logger(__name__)

_ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
_MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/character/detect", response_model=CharacterDetectionResult)
async def detect(file: UploadFile = File(...)) -> CharacterDetectionResult:
    """
    Upload an anime character image and get their identity.
    Accepts JPEG, PNG, WebP, or GIF. Max 10 MB.
    Returns character name, anime title, confidence, visual traits, and description.
    """
    if file.content_type not in _ALLOWED_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{file.content_type}'. Use JPEG, PNG, WebP, or GIF.",
        )

    image_bytes = await file.read()

    if len(image_bytes) > _MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="File too large. Maximum size is 10 MB.",
        )

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    try:
        result = await detect_character(image_bytes)
    except Exception as exc:
        logger.error("Character detection failed: %s", exc)
        raise HTTPException(status_code=502, detail=f"Detection failed: {exc}")

    return result
