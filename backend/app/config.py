from functools import lru_cache
from typing import List, Optional

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration settings."""

    groq_api_key: Optional[str] = None
    groq_model: str = "llama-3.3-70b-versatile"
    backend_cors_origins: List[AnyHttpUrl] = []

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
