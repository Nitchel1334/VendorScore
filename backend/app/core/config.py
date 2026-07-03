from pydantic_settings import BaseSettings
import os
from pathlib import Path

LOCAL_DATABASE_PATH = Path(__file__).resolve().parents[2] / "vendorscore.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "VendorScore API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{LOCAL_DATABASE_PATH}")
    SECRET_KEY: str = "super-secret-jwt-key-replace-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    class Config:
        env_file = ".env"

settings = Settings()
