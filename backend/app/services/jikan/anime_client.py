"""
Jikan v4 anime client — search, full detail, characters, recommendations, staff.
No API key required. Docs: https://docs.api.jikan.moe/
"""

import asyncio

import httpx

from app.core.logging import get_logger

logger = get_logger(__name__)

_BASE = "https://api.jikan.moe/v4"
_TIMEOUT = 20


async def _get(url: str, params: dict | None = None, _retries: int = 4) -> dict | None:
    for attempt in range(_retries):
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            resp = await client.get(url, params=params)
        if resp.status_code == 200:
            return resp.json()
        if resp.status_code == 429:
            wait = 2 ** (attempt + 1)  # 2s, 4s, 8s, 16s
            logger.warning("Jikan rate limit (429) for %s — waiting %ds (attempt %d/%d)", url, wait, attempt + 1, _retries)
            await asyncio.sleep(wait)
            continue
        logger.warning("Jikan GET %s failed: HTTP %s — %s", url, resp.status_code, resp.text[:200])
        return None
    logger.error("Jikan GET %s failed after %d retries", url, _retries)
    return None


# ── Search ────────────────────────────────────────────────────────────────────

async def search_anime(query: str, limit: int = 8) -> list[dict]:
    """
    Autocomplete-style search. Returns up to `limit` lightweight results.
    Each result: { mal_id, title, title_english, image, type, episodes, score, year, status }
    """
    data = await _get(f"{_BASE}/anime", {"q": query, "limit": limit, "order_by": "popularity", "sort": "asc"})
    if not data:
        return []

    results = []
    for raw in data.get("data", []):
        results.append({
            "mal_id": raw.get("mal_id"),
            "title": raw.get("title"),
            "title_english": raw.get("title_english"),
            "image": (raw.get("images", {}).get("jpg", {}).get("large_image_url")
                      or raw.get("images", {}).get("jpg", {}).get("image_url")),
            "type": raw.get("type"),
            "episodes": raw.get("episodes"),
            "score": raw.get("score"),
            "year": raw.get("year"),
            "status": raw.get("status"),
        })
    return results


# ── Full detail ───────────────────────────────────────────────────────────────

async def get_anime_full(mal_id: int) -> dict | None:
    """
    Fetch complete anime detail from Jikan /anime/{id}/full.
    Includes episodes, genres, themes, studios, trailer, relations, etc.
    """
    data = await _get(f"{_BASE}/anime/{mal_id}/full")
    if not data:
        return None

    raw = data.get("data", {})
    if not raw:
        return None

    def _names(lst): return [x.get("name") for x in (lst or [])]

    trailer = raw.get("trailer", {})

    return {
        "mal_id": raw.get("mal_id"),
        "title": raw.get("title"),
        "title_english": raw.get("title_english"),
        "title_japanese": raw.get("title_japanese"),
        "image": (raw.get("images", {}).get("jpg", {}).get("large_image_url")
                  or raw.get("images", {}).get("jpg", {}).get("image_url")),
        "trailer_url": trailer.get("url"),
        "trailer_embed": trailer.get("embed_url"),
        "type": raw.get("type"),
        "source": raw.get("source"),
        "episodes": raw.get("episodes"),
        "status": raw.get("status"),
        "airing": raw.get("airing"),
        "duration": raw.get("duration"),
        "rating": raw.get("rating"),
        "score": raw.get("score"),
        "scored_by": raw.get("scored_by"),
        "rank": raw.get("rank"),
        "popularity": raw.get("popularity"),
        "members": raw.get("members"),
        "favorites": raw.get("favorites"),
        "synopsis": raw.get("synopsis", ""),
        "background": raw.get("background", ""),
        "season": raw.get("season"),
        "year": raw.get("year"),
        "genres": _names(raw.get("genres")),
        "themes": _names(raw.get("themes")),
        "demographics": _names(raw.get("demographics")),
        "studios": _names(raw.get("studios")),
        "producers": _names(raw.get("producers")),
    }


# ── Characters ────────────────────────────────────────────────────────────────

async def get_anime_characters(mal_id: int, limit: int = 8) -> list[dict]:
    """
    Fetch top characters for an anime, sorted by favorites descending.
    Each result: { name, role, image, favorites, mal_id }
    """
    data = await _get(f"{_BASE}/anime/{mal_id}/characters")
    if not data:
        return []

    chars = sorted(
        data.get("data", []),
        key=lambda x: x.get("favorites", 0),
        reverse=True,
    )[:limit]

    results = []
    for entry in chars:
        char = entry.get("character", {})
        results.append({
            "mal_id": char.get("mal_id"),
            "name": char.get("name"),
            "role": entry.get("role"),
            "image": char.get("images", {}).get("jpg", {}).get("image_url"),
            "favorites": entry.get("favorites", 0),
        })
    return results


# ── Recommendations ───────────────────────────────────────────────────────────

async def get_anime_recommendations(mal_id: int, limit: int = 6) -> list[dict]:
    """
    Fetch MAL community recommendations for an anime.
    Each result: { mal_id, title, image, votes }
    """
    data = await _get(f"{_BASE}/anime/{mal_id}/recommendations")
    if not data:
        return []

    recs = data.get("data", [])[:limit]
    results = []
    for entry in recs:
        rec = entry.get("entry", {})
        results.append({
            "mal_id": rec.get("mal_id"),
            "title": rec.get("title"),
            "image": rec.get("images", {}).get("jpg", {}).get("image_url"),
            "votes": entry.get("votes", 0),
        })
    return results


# ── Staff ─────────────────────────────────────────────────────────────────────

async def get_anime_staff(mal_id: int) -> list[dict]:
    """
    Fetch key staff (Director, Series Composition, Music, Character Design).
    Each result: { name, image, positions }
    """
    _KEY_ROLES = {"Director", "Series Composition", "Music", "Character Design", "Original Creator"}

    data = await _get(f"{_BASE}/anime/{mal_id}/staff")
    if not data:
        return []

    results = []
    seen = set()
    for entry in data.get("data", []):
        positions = entry.get("positions", [])
        if not any(p in _KEY_ROLES for p in positions):
            continue
        person = entry.get("person", {})
        name = person.get("name")
        if name in seen:
            continue
        seen.add(name)
        results.append({
            "name": name,
            "image": person.get("images", {}).get("jpg", {}).get("image_url"),
            "positions": positions,
        })
    return results


# ── Aggregate fetch ───────────────────────────────────────────────────────────

async def get_anime_detail_page(mal_id: int) -> dict | None:
    """
    Fetch everything needed for the detail page.
    Sequential with small delays to respect Jikan's 3 req/sec rate limit.
    Returns: { anime, characters, recommendations, staff }
    """
    anime = await get_anime_full(mal_id)
    if not anime:
        return None

    await asyncio.sleep(1.0)
    characters = await get_anime_characters(mal_id)

    await asyncio.sleep(1.0)
    recommendations = await get_anime_recommendations(mal_id)

    await asyncio.sleep(1.0)
    staff = await get_anime_staff(mal_id)

    return {
        "anime": anime,
        "characters": characters,
        "recommendations": recommendations,
        "staff": staff,
    }
