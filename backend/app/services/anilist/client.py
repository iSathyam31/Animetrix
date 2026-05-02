import httpx
from app.core.logging import get_logger

logger = get_logger(__name__)

_URL = "https://graphql.anilist.co"

_ANIME_SEARCH_QUERY = """
query ($search: String) {
  Media (search: $search, type: ANIME, sort: POPULARITY_DESC) {
    id
    title {
      romaji
      english
    }
    format
    episodes
    averageScore
    description
    seasonYear
    genres
    studios(isMain: true) {
      nodes {
        name
      }
    }
    coverImage {
      large
    }
  }
}
"""

async def search_anime(title: str) -> dict | None:
    """
    Search AniList for an anime by title.
    Returns a clean dict with metadata + cover image, or None.
    """
    variables = {"search": title}
    
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.post(_URL, json={"query": _ANIME_SEARCH_QUERY, "variables": variables})
        except httpx.RequestError as e:
            logger.error("AniList request failed: %s", e)
            return None
            
    if resp.status_code != 200:
        logger.warning("AniList search failed for '%s': HTTP %s - %s", title, resp.status_code, resp.text)
        return None
        
    data = resp.json().get("data", {})
    if not data or not data.get("Media"):
        logger.info("AniList: no anime found for '%s'", title)
        return None
        
    media = data["Media"]
    
    # Use English title if available, otherwise Romaji
    eng = media.get("title", {}).get("english")
    rom = media.get("title", {}).get("romaji")
    final_title = eng if eng else rom
    
    studios = [node.get("name") for node in media.get("studios", {}).get("nodes", []) if node.get("name")]
    
    # AniList averageScore is out of 100, normalize to 10.0 scale for LLM consistency
    score = media.get("averageScore")
    normalized_score = (score / 10.0) if score else None
    
    return {
        "title": final_title,
        "episodes": media.get("episodes"),
        "year": media.get("seasonYear"),
        "genres": media.get("genres", []),
        "studios": studios,
        "score": normalized_score,
        "synopsis": media.get("description", ""),
        "image": media.get("coverImage", {}).get("large"),
        "anilist_id": media.get("id")
    }
