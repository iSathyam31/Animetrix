from typing import List, Optional

from pydantic import BaseModel


class AnimeSearchResult(BaseModel):
    mal_id: int
    title: str
    title_english: Optional[str] = None
    image: Optional[str] = None
    type: Optional[str] = None
    episodes: Optional[int] = None
    score: Optional[float] = None
    year: Optional[int] = None
    status: Optional[str] = None


class AnimeDetail(BaseModel):
    mal_id: int
    title: str
    title_english: Optional[str] = None
    title_japanese: Optional[str] = None
    image: Optional[str] = None
    trailer_url: Optional[str] = None
    trailer_embed: Optional[str] = None
    type: Optional[str] = None
    source: Optional[str] = None
    episodes: Optional[int] = None
    status: Optional[str] = None
    airing: Optional[bool] = None
    duration: Optional[str] = None
    rating: Optional[str] = None
    score: Optional[float] = None
    scored_by: Optional[int] = None
    rank: Optional[int] = None
    popularity: Optional[int] = None
    members: Optional[int] = None
    favorites: Optional[int] = None
    synopsis: Optional[str] = None
    background: Optional[str] = None
    season: Optional[str] = None
    year: Optional[int] = None
    genres: List[str] = []
    themes: List[str] = []
    demographics: List[str] = []
    studios: List[str] = []
    producers: List[str] = []


class AnimeCharacter(BaseModel):
    mal_id: Optional[int] = None
    name: str
    role: Optional[str] = None
    image: Optional[str] = None
    favorites: int = 0


class AnimeRecommendation(BaseModel):
    mal_id: Optional[int] = None
    title: str
    image: Optional[str] = None
    votes: int = 0


class AnimeStaff(BaseModel):
    name: str
    image: Optional[str] = None
    positions: List[str] = []


class AnimeDetailPage(BaseModel):
    anime: AnimeDetail
    characters: List[AnimeCharacter] = []
    recommendations: List[AnimeRecommendation] = []
    staff: List[AnimeStaff] = []
