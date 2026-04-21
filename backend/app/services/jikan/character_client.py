"""
Jikan v4 client — unofficial MyAnimeList API.
Used for character data (no API key required).
Docs: https://docs.api.jikan.moe/
"""

import httpx

from app.core.logging import get_logger

logger = get_logger(__name__)

_BASE = "https://api.jikan.moe/v4"
_TIMEOUT = 20


async def search_character(name: str) -> dict | None:
    """
    Search Jikan for a character by name.
    Returns the best-match character dict (trimmed) or None.
    """
    url = f"{_BASE}/characters"
    params = {"q": name, "limit": 1, "order_by": "favorites", "sort": "desc"}

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        resp = await client.get(url, params=params)

    if resp.status_code != 200:
        logger.warning("Jikan search failed for '%s': HTTP %s", name, resp.status_code)
        return None

    results = resp.json().get("data", [])
    if not results:
        logger.info("Jikan: no character found for '%s'", name)
        return None

    char = results[0]
    mal_id = char.get("mal_id")
    logger.info("Jikan found '%s' (MAL ID %s) for query '%s'",
                char.get("name"), mal_id, name)
    return await get_character_full(mal_id)


async def get_character_full(mal_id: int) -> dict | None:
    """
    Fetch full character profile from Jikan by MAL ID.
    Returns a clean dict ready for the LLM.
    """
    url = f"{_BASE}/characters/{mal_id}/full"

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        resp = await client.get(url)

    if resp.status_code != 200:
        logger.warning("Jikan full fetch failed for MAL ID %s: HTTP %s", mal_id, resp.status_code)
        return None

    raw = resp.json().get("data", {})
    if not raw:
        return None

    # Extract anime appearances (top 5 by popularity)
    anime_appearances = [
        {
            "title": entry.get("anime", {}).get("title"),
            "role": entry.get("role"),
        }
        for entry in raw.get("anime", [])[:5]
    ]

    # Extract manga appearances (top 3)
    manga_appearances = [
        {
            "title": entry.get("manga", {}).get("title"),
            "role": entry.get("role"),
        }
        for entry in raw.get("manga", [])[:3]
    ]

    # Extract voice actors
    voice_actors = [
        {
            "name": va.get("person", {}).get("name"),
            "language": va.get("language"),
        }
        for va in raw.get("voices", [])[:3]
    ]

    return {
        "mal_id": raw.get("mal_id"),
        "name": raw.get("name"),
        "name_kanji": raw.get("name_kanji"),
        "nicknames": raw.get("nicknames", []),
        "about": raw.get("about", ""),         # full description / biography
        "favorites": raw.get("favorites", 0),  # MAL favorites count
        "anime_appearances": anime_appearances,
        "manga_appearances": manga_appearances,
        "voice_actors": voice_actors,
        "image": raw.get("images", {}).get("jpg", {}).get("image_url"),
    }


async def search_anime(title: str) -> dict | None:
    """
    Search Jikan for an anime by title.
    Returns a clean dict with metadata + cover image, or None.
    """
    url = f"{_BASE}/anime"
    params = {"q": title, "limit": 1, "order_by": "popularity", "sort": "asc"}

    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        resp = await client.get(url, params=params)

    if resp.status_code != 200:
        logger.warning("Jikan anime search failed for '%s': HTTP %s", title, resp.status_code)
        return None

    results = resp.json().get("data", [])
    if not results:
        logger.info("Jikan: no anime found for '%s'", title)
        return None

    raw = results[0]
    logger.info("Jikan found anime '%s' (MAL ID %s) for query '%s'",
                raw.get("title"), raw.get("mal_id"), title)

    genres = [g.get("name") for g in raw.get("genres", [])]
    studios = [s.get("name") for s in raw.get("studios", [])]
    themes = [t.get("name") for t in raw.get("themes", [])]

    return {
        "mal_id": raw.get("mal_id"),
        "title": raw.get("title"),
        "title_english": raw.get("title_english"),
        "title_japanese": raw.get("title_japanese"),
        "type": raw.get("type"),
        "episodes": raw.get("episodes"),
        "status": raw.get("status"),
        "score": raw.get("score"),
        "scored_by": raw.get("scored_by"),
        "rank": raw.get("rank"),
        "popularity": raw.get("popularity"),
        "members": raw.get("members"),
        "favorites": raw.get("favorites"),
        "synopsis": raw.get("synopsis", ""),
        "year": raw.get("year"),
        "season": raw.get("season"),
        "genres": genres,
        "themes": themes,
        "studios": studios,
        "rating": raw.get("rating"),
        "duration": raw.get("duration"),
        "image": raw.get("images", {}).get("jpg", {}).get("large_image_url")
                 or raw.get("images", {}).get("jpg", {}).get("image_url"),
    }
