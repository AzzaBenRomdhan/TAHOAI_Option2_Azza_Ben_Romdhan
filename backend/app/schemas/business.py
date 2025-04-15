from pydantic import BaseModel

class CompanyData(BaseModel):
    name: str
    industry: str
    team_size: int

class ScoreResponse(BaseModel):
    score: int
    label: str
    confidence: float
