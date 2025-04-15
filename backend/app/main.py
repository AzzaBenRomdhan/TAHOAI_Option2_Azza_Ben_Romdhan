from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import score
from app.db.models import Base
from app.db.session import engine

app = FastAPI(title="Business Scoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(score.router, prefix="/api/v1")

Base.metadata.create_all(bind=engine)
