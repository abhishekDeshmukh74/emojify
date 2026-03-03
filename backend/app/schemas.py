from typing import List, Literal, Optional

from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    text: str
    use_own_key: bool = False
    groq_api_key: Optional[str] = None


class Highlight(BaseModel):
    sentence: str
    emoji: str


class AnalyzeResponse(BaseModel):
    summary_lines: List[str]
    sentiment: Literal["positive", "neutral", "negative"]
    highlights: List[Highlight]

