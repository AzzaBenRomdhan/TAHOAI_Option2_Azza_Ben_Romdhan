from fastapi import APIRouter
from app.schemas.business import CompanyData, ScoreResponse
from app.services.score_service import calculate_maturity_score

router = APIRouter()

@router.post("/score", response_model=ScoreResponse)
def score_startup(data: CompanyData):
    return calculate_maturity_score(data)
