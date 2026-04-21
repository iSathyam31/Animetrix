import asyncio
import json
import re

from langchain_core.messages import HumanMessage

from app.core.logging import get_logger
from app.services.ai.llm import get_llm
from app.services.jikan.character_client import search_anime

logger = get_logger(__name__)

_JSON_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)

# ── Shared helper ─────────────────────────────────────────────────────────────

def _parse_json(raw_text: str) -> dict:
    clean = _JSON_FENCE_RE.sub("", raw_text).strip()
    return json.loads(clean)


# ── Prompts ───────────────────────────────────────────────────────────────────

_ANIME_ANALYSIS_PROMPT = """You are Verdict — an elite anime analyst AI.

You have been given MAL/Jikan data for two anime. Analyse them and return ONLY a valid JSON object.

Anime A data:
{anime_a_json}

Anime B data:
{anime_b_json}

Return EXACTLY this JSON (no prose, no markdown fences):

{{
  "mode": "anime",
  "subject_a": "<Anime A title>",
  "subject_b": "<Anime B title>",
  "dimensions": {{
    "story":            {{ "score_a": 0.0, "score_b": 0.0, "winner": "<Title or Tie>", "reason": "<1-2 sentences>" }},
    "animation":        {{ "score_a": 0.0, "score_b": 0.0, "winner": "<Title or Tie>", "reason": "<1-2 sentences>" }},
    "characters":       {{ "score_a": 0.0, "score_b": 0.0, "winner": "<Title or Tie>", "reason": "<1-2 sentences>" }},
    "emotional_impact": {{ "score_a": 0.0, "score_b": 0.0, "winner": "<Title or Tie>", "reason": "<1-2 sentences>" }},
    "rewatchability":   {{ "score_a": 0.0, "score_b": 0.0, "winner": "<Title or Tie>", "reason": "<1-2 sentences>" }}
  }},
  "overall_winner": "<Title or Tie>",
  "verdict": "<3-4 sentence overall verdict>",
  "best_for": {{
    "subject_a": "<One-line: who should watch this>",
    "subject_b": "<One-line: who should watch this>"
  }},
  "mal_scores": {{
    "subject_a": 0.0,
    "subject_b": 0.0
  }}
}}

Rules:
- Use MAL score as an anchor but apply your own analysis per dimension.
- Scores must be floats 0.0-10.0. Avoid identical scores across all dimensions.
- "winner" must be the exact anime title or "Tie".
- Output ONLY the JSON.
"""

# ── Anime comparison (Jikan) ──────────────────────────────────────────────────

async def _compare_anime(subject_a: str, subject_b: str) -> dict:
    logger.info("Jikan: fetching anime '%s' and '%s'", subject_a, subject_b)

    anime_a, anime_b = await asyncio.gather(
        search_anime(subject_a),
        search_anime(subject_b),
    )

    if not anime_a:
        return {"error": f"Could not find anime '{subject_a}' on MyAnimeList. Please check the title."}
    if not anime_b:
        return {"error": f"Could not find anime '{subject_b}' on MyAnimeList. Please check the title."}

    logger.info("Found: '%s' (MAL id=%s) and '%s' (MAL id=%s)",
                anime_a.get("title"), anime_a.get("mal_id"),
                anime_b.get("title"), anime_b.get("mal_id"))

    prompt = _ANIME_ANALYSIS_PROMPT.format(
        anime_a_json=json.dumps(anime_a, indent=2),
        anime_b_json=json.dumps(anime_b, indent=2),
    )

    llm = get_llm()
    response = await llm.ainvoke([HumanMessage(content=prompt)])

    try:
        parsed = _parse_json(response.content)
    except json.JSONDecodeError as exc:
        logger.error("Anime comparison LLM returned non-JSON:\n%s", response.content)
        raise ValueError(f"LLM did not return valid JSON: {exc}") from exc

    parsed["image_a"] = anime_a.get("image")
    parsed["image_b"] = anime_b.get("image")
    parsed["meta_a"] = {
        "episodes": anime_a.get("episodes"),
        "year": anime_a.get("year"),
        "genres": anime_a.get("genres", []),
        "studios": anime_a.get("studios", []),
    }
    parsed["meta_b"] = {
        "episodes": anime_b.get("episodes"),
        "year": anime_b.get("year"),
        "genres": anime_b.get("genres", []),
        "studios": anime_b.get("studios", []),
    }
    return parsed


# ── Public entry point ────────────────────────────────────────────────────────

async def compare(subject_a: str, subject_b: str) -> dict:
    """
    Run a head-to-head anime comparison using Jikan (MAL) data.

    Args:
        subject_a: Name of the first anime.
        subject_b: Name of the second anime.

    Returns:
        Parsed comparison dict with images attached as image_a / image_b.
    """
    logger.info("Comparison request — '%s' vs '%s'", subject_a, subject_b)
    parsed = await _compare_anime(subject_a, subject_b)
    logger.info("Comparison complete — overall winner: %s", parsed.get("overall_winner", "unknown"))
    return parsed
