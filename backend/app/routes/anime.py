from fastapi import APIRouter, HTTPException, Query
from typing import List

from app.core.logging import get_logger
from app.schemas.anime import AnimeDetailPage, AnimeSearchResult
from app.services.anilist.encyclopedia_client import get_anime_detail_page, search_anime

router = APIRouter()
logger = get_logger(__name__)


@router.get("/anime/search", response_model=List[AnimeSearchResult])
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(8, ge=1, le=25, description="Number of results to return"),
) -> List[AnimeSearchResult]:
    """
    Search for anime by title. Returns a ranked list of matches with cover art and key stats.
    """
    try:
        results = await search_anime(q.strip(), limit=limit)
    except Exception as exc:
        logger.error("Anime search failed for query '%s': %s", q, exc)
        raise HTTPException(status_code=502, detail=f"Search failed: {exc}")

    return results


@router.get("/anime/{mal_id}", response_model=AnimeDetailPage)
async def detail(mal_id: int) -> AnimeDetailPage:
    """
    Retrieve full details for a specific anime by its MyAnimeList ID.
    Includes cast, staff, and recommendations.
    """
    try:
        page = await get_anime_detail_page(mal_id)
    except Exception as exc:
        logger.error("Anime detail fetch failed for mal_id=%s: %s", mal_id, exc)
        raise HTTPException(status_code=502, detail=f"Failed to fetch anime details: {exc}")

    if page is None:
        raise HTTPException(status_code=404, detail=f"Anime with MAL ID {mal_id} not found.")

    return page
