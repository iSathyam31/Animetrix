from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.agents.comparison.runner import compare
from app.core.logging import get_logger
from app.schemas.comparison import AnimeComparisonResult

router = APIRouter()
logger = get_logger(__name__)


class ComparisonRequest(BaseModel):
    subject_a: str
    subject_b: str


@router.post("/comparison", response_model=AnimeComparisonResult)
async def run_comparison(request: ComparisonRequest) -> AnimeComparisonResult:
    """
    Compare two anime head-to-head across multiple dimensions.
    Pass the title (or close approximation) for each anime.
    Returns scores, winner, verdict, and metadata sourced from Jikan/MAL.
    """
    a = request.subject_a.strip()
    b = request.subject_b.strip()

    if not a or not b:
        raise HTTPException(status_code=422, detail="Both subject_a and subject_b are required.")

    if a.lower() == b.lower():
        raise HTTPException(status_code=422, detail="subject_a and subject_b must be different.")

    try:
        result = await compare(a, b)
    except Exception as exc:
        logger.error("Comparison failed for '%s' vs '%s': %s", a, b, exc)
        raise HTTPException(status_code=502, detail=f"Comparison failed: {exc}")

    return result
