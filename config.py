import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-change-in-production"
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///addiction_support.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # AI Configuration (Free Tiers: Google Gemini or Groq Cloud)
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
    AI_MODEL = os.environ.get("AI_MODEL", "gemini-1.5-flash")
