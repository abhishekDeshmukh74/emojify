# Emojify ✨🙂
A small full-stack app that analyzes any text and returns:
- a 4-line summary
- sentiment (positive, neutral, negative)
- highlight sentences paired with emojis

Frontend: Vite + React + TypeScript
Backend: FastAPI + LangChain + Groq

## Repo structure
.
├── backend/   FastAPI API (Groq via LangChain)
└── frontend/  Vite + React + TS UI

## What the API returns
POST /api/analyze returns:
- summary_lines: string[]  (exactly 4 lines)
- sentiment: "positive" | "neutral" | "negative"
- highlights: { sentence, emoji }[]

## Local setup

### 1) Backend (FastAPI)
cd backend

# create venv
python -m venv .venv

# activate
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt

# create backend/.env
# IMPORTANT: keys are lowercase because Settings has case_sensitive=True
# (see backend/app/config.py)
groq_api_key=YOUR_GROQ_API_KEY
groq_model=llama-3.3-70b-versatile

# run
uvicorn app.main:app --reload --port 8000

Health check:
GET http://localhost:8000/health

Analyze:
POST http://localhost:8000/api/analyze


### 2) Frontend (Vite)
cd frontend
npm install
npm run dev

Optional: set backend URL for local dev (frontend/.env)
VITE_API_BASE_URL=http://localhost:8000


## Deployment
You will deploy as TWO Vercel projects from the SAME repo:
1) backend project (Root Directory = backend)
2) frontend project (Root Directory = frontend)

After deploy, set frontend env var VITE_API_BASE_URL to your backend URL.
