from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings, get_settings
from .llm import run_analysis
from .schemas import AnalyzeRequest, AnalyzeResponse


def create_app(settings: Optional[Settings] = None) -> FastAPI:
    settings = settings or get_settings()

    app = FastAPI(title="AI Summary & Sentiment/Emoji API", version="1.0.0")

    origins = [str(origin) for origin in settings.backend_cors_origins] or [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health() -> dict:
        return {"status": "ok"}

    @app.post("/api/analyze", response_model=AnalyzeResponse)
    async def analyze(
        payload: AnalyzeRequest, app_settings: Settings = Depends(get_settings)
    ) -> AnalyzeResponse:
        # Decide which key to use
        api_key: Optional[str] = None
        if payload.use_own_key:
            if not payload.groq_api_key:
                raise HTTPException(status_code=400, detail="groq_api_key is required when use_own_key is true.")
            api_key = payload.groq_api_key
        else:
            if not app_settings.groq_api_key:
                raise HTTPException(
                    status_code=500,
                    detail="Server Groq API key is not configured.",
                )
            api_key = app_settings.groq_api_key

        if not payload.text.strip():
            raise HTTPException(status_code=400, detail="Text input must not be empty.")

        try:
            result = await run_analysis(
                text=payload.text,
                api_key=api_key,
                model_name=app_settings.groq_model,
            )
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc

        return result

    return app


app = create_app()

