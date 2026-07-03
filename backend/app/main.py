from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models.all_models import *

from app.api.auth import router as auth_router
from app.api.transactions import router as transactions_router
from app.api.assessment import router as assessment_router
from app.api.insights import router as insights_router
from app.api.products import router as products_router
from app.api.voice import router as voice_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="VendorScore API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to VendorScore API"}

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(transactions_router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(assessment_router, prefix="/api/assessment", tags=["Assessment"])
app.include_router(insights_router, prefix="/api/insights", tags=["Insights"])
app.include_router(products_router, prefix="/api/products", tags=["Products"])
app.include_router(voice_router, prefix="/api/voice", tags=["Voice"])
