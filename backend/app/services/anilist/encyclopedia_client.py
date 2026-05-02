import httpx
from app.core.logging import get_logger

logger = get_logger(__name__)

_URL = "https://graphql.anilist.co"

_SEARCH_QUERY = """
query ($search: String, $limit: Int) {
  Page(page: 1, perPage: $limit) {
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      title { romaji english }
      coverImage { large }
      format
      episodes
      averageScore
      seasonYear
      status
    }
  }
}
"""

_DETAIL_QUERY = """
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title { romaji english native }
    coverImage { extraLarge }
    trailer { id site }
    format
    source
    episodes
    status
    duration
    averageScore
    popularity
    favourites
    description(asHtml: false)
    seasonYear
    season
    genres
    studios(isMain: true) { nodes { name } }
    characters(sort: FAVOURITES_DESC, perPage: 8) {
      edges {
        role
        node { id name { full } image { large } favourites }
      }
    }
    recommendations(sort: RATING_DESC, perPage: 6) {
      nodes {
        mediaRecommendation { id title { romaji english } coverImage { large } }
      }
    }
    staff(sort: RELEVANCE, perPage: 8) {
      edges {
        role
        node { id name { full } image { large } }
      }
    }
  }
}
"""

async def search_anime(query: str, limit: int = 8) -> list[dict]:
    """
    Search AniList for anime matching the query.
    Maps fields to simulate Jikan's response schema (uses anilist_id as mal_id).
    """
    variables = {"search": query, "limit": limit}
    
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.post(_URL, json={"query": _SEARCH_QUERY, "variables": variables})
        except httpx.RequestError as e:
            logger.error("AniList search request failed: %s", e)
            return []
            
    if resp.status_code != 200:
        logger.warning("AniList search failed: HTTP %s", resp.status_code)
        return []
        
    data = resp.json().get("data", {})
    if not data or not data.get("Page") or not data["Page"].get("media"):
        return []
        
    results = []
    for raw in data["Page"]["media"]:
        eng_title = raw.get("title", {}).get("english")
        rom_title = raw.get("title", {}).get("romaji")
        
        results.append({
            "mal_id": raw.get("id"), # Passed as mal_id for frontend compatibility
            "title": eng_title if eng_title else rom_title,
            "title_english": eng_title,
            "image": raw.get("coverImage", {}).get("large"),
            "type": raw.get("format"),
            "episodes": raw.get("episodes"),
            "score": (raw.get("averageScore") / 10.0) if raw.get("averageScore") else None,
            "year": raw.get("seasonYear"),
            "status": raw.get("status"),
        })
    return results


async def get_anime_detail_page(anilist_id: int) -> dict | None:
    """
    Fetch comprehensive anime details using a single AniList GraphQL query.
    Maps results to match the AnimeDetailPage schema structure.
    """
    variables = {"id": anilist_id}
    
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.post(_URL, json={"query": _DETAIL_QUERY, "variables": variables})
        except httpx.RequestError as e:
            logger.error("AniList detail request failed: %s", e)
            return None
            
    if resp.status_code != 200:
        logger.warning("AniList detail failed: HTTP %s", resp.status_code)
        return None
        
    data = resp.json().get("data", {})
    if not data or not data.get("Media"):
        return None
        
    raw = data["Media"]
    
    # ── Map Anime Details ──
    eng_title = raw.get("title", {}).get("english")
    rom_title = raw.get("title", {}).get("romaji")
    
    trailer_url = None
    trailer_embed = None
    if raw.get("trailer") and raw["trailer"].get("site") == "youtube":
        trailer_url = f"https://www.youtube.com/watch?v={raw['trailer']['id']}"
        trailer_embed = f"https://www.youtube.com/embed/{raw['trailer']['id']}"

    anime_detail = {
        "mal_id": raw.get("id"),
        "title": eng_title if eng_title else rom_title,
        "title_english": eng_title,
        "title_japanese": raw.get("title", {}).get("native"),
        "image": raw.get("coverImage", {}).get("extraLarge"),
        "trailer_url": trailer_url,
        "trailer_embed": trailer_embed,
        "type": raw.get("format"),
        "source": raw.get("source"),
        "episodes": raw.get("episodes"),
        "status": raw.get("status"),
        "airing": raw.get("status") == "RELEASING",
        "duration": f"{raw.get('duration')} min per ep" if raw.get("duration") else None,
        "score": (raw.get("averageScore") / 10.0) if raw.get("averageScore") else None,
        "popularity": raw.get("popularity"),
        "favorites": raw.get("favourites"),
        "synopsis": raw.get("description", ""),
        "season": raw.get("season"),
        "year": raw.get("seasonYear"),
        "genres": raw.get("genres", []),
        "studios": [s.get("name") for s in raw.get("studios", {}).get("nodes", [])]
    }
    
    # ── Map Characters ──
    characters = []
    for edge in raw.get("characters", {}).get("edges", []):
        node = edge.get("node", {})
        characters.append({
            "mal_id": node.get("id"),
            "name": node.get("name", {}).get("full"),
            "role": edge.get("role"),
            "image": node.get("image", {}).get("large"),
            "favorites": node.get("favourites", 0)
        })
        
    # ── Map Recommendations ──
    recommendations = []
    for node in raw.get("recommendations", {}).get("nodes", []):
        rec_media = node.get("mediaRecommendation", {})
        if not rec_media:
            continue
        rec_eng = rec_media.get("title", {}).get("english")
        rec_rom = rec_media.get("title", {}).get("romaji")
        recommendations.append({
            "mal_id": rec_media.get("id"),
            "title": rec_eng if rec_eng else rec_rom,
            "image": rec_media.get("coverImage", {}).get("large"),
            "votes": 0 # AniList recommendations sort by rating instead of raw vote count
        })
        
    # ── Map Staff ──
    staff = []
    seen_staff = set()
    for edge in raw.get("staff", {}).get("edges", []):
        node = edge.get("node", {})
        name = node.get("name", {}).get("full")
        if not name or name in seen_staff:
            continue
        seen_staff.add(name)
        staff.append({
            "name": name,
            "image": node.get("image", {}).get("large"),
            "positions": [edge.get("role")] if edge.get("role") else []
        })

    return {
        "anime": anime_detail,
        "characters": characters,
        "recommendations": recommendations,
        "staff": staff,
    }
