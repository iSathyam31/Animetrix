import httpx

from app.core.config import settings
from app.core.exceptions import AniListAPIError
from app.core.logging import get_logger

logger = get_logger(__name__)

_SEARCH_CHARACTER_QUERY = """
query SearchCharacter($search: String) {
  Character(search: $search) {
    id
    name {
      full
      native
      alternative
    }
    description(asHtml: false)
    gender
    age
    image {
      large
    }
    media(perPage: 5, sort: POPULARITY_DESC) {
      nodes {
        id
        title {
          romaji
          english
        }
        type
        format
        episodes
        chapters
        averageScore
        popularity
        genres
        coverImage {
          large
        }
        studios(isMain: true) {
          nodes {
            name
          }
        }
        startDate {
          year
        }
        status
      }
    }
    favourites
  }
}
"""

_GET_CHARACTER_QUERY = """
query GetCharacter($id: Int) {
  Character(id: $id) {
    id
    name {
      full
      native
      alternative
    }
    description(asHtml: false)
    gender
    age
    image {
      large
    }
    media(perPage: 5, sort: POPULARITY_DESC) {
      nodes {
        id
        title {
          romaji
          english
        }
        type
        format
        episodes
        chapters
        averageScore
        popularity
        genres
        coverImage {
          large
        }
        studios(isMain: true) {
          nodes {
            name
          }
        }
        startDate {
          year
        }
        status
      }
    }
    favourites
  }
}
"""


async def _graphql(query: str, variables: dict) -> dict:
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if settings.ANILIST_TOKEN:
        headers["Authorization"] = f"Bearer {settings.ANILIST_TOKEN}"

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            settings.ANILIST_API_URL,
            json={"query": query, "variables": variables},
            headers=headers,
        )

    if response.status_code != 200:
        raise AniListAPIError(
            f"AniList API returned {response.status_code}: {response.text}",
            status_code=response.status_code,
        )

    data = response.json()
    if "errors" in data:
        raise AniListAPIError(data["errors"][0]["message"])

    return data["data"]


async def search_character_by_name(name: str) -> dict | None:
    """
    Search AniList for a character by name.
    Returns the character dict or None if not found.
    """
    logger.info("Searching AniList for character: %s", name)
    try:
        data = await _graphql(_SEARCH_CHARACTER_QUERY, {"search": name})
        return data.get("Character")
    except AniListAPIError as exc:
        # 404-style "not found" errors from AniList come as GraphQL errors
        if "not found" in exc.message.lower():
            return None
        raise


async def get_character_by_id(character_id: int) -> dict | None:
    """
    Fetch a character by their AniList ID.
    Returns the character dict or None if not found.
    """
    logger.info("Fetching AniList character ID: %d", character_id)
    try:
        data = await _graphql(_GET_CHARACTER_QUERY, {"id": character_id})
        return data.get("Character")
    except AniListAPIError as exc:
        if "not found" in exc.message.lower():
            return None
        raise
