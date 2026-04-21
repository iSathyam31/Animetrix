from typing import List, Optional

from pydantic import BaseModel, Field


class DimensionScore(BaseModel):
    score_a: float = Field(ge=0.0, le=10.0)
    score_b: float = Field(ge=0.0, le=10.0)
    winner: str  # exact anime title or "Tie"
    reason: str


class AnimeDimensions(BaseModel):
    story: DimensionScore
    animation: DimensionScore
    characters: DimensionScore
    emotional_impact: DimensionScore
    rewatchability: DimensionScore


class BestFor(BaseModel):
    subject_a: str
    subject_b: str


class MalScores(BaseModel):
    subject_a: float
    subject_b: float


class AnimeMeta(BaseModel):
    episodes: Optional[int] = None
    year: Optional[int] = None
    genres: List[str] = []
    studios: List[str] = []


class AnimeComparisonResult(BaseModel):
    mode: str = "anime"
    subject_a: str
    subject_b: str
    dimensions: AnimeDimensions
    overall_winner: str
    verdict: str
    best_for: BestFor
    mal_scores: Optional[MalScores] = None
    # Attached by runner (not from LLM)
    image_a: Optional[str] = None
    image_b: Optional[str] = None
    meta_a: Optional[AnimeMeta] = None
    meta_b: Optional[AnimeMeta] = None
