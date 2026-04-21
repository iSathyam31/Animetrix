from typing import List, Optional

from pydantic import BaseModel


class CharacterDetectionResult(BaseModel):
    character_name: str
    anime_title: str
    confidence: str  # "high" | "medium" | "low"
    visual_traits: List[str] = []
    notes: Optional[str] = None

