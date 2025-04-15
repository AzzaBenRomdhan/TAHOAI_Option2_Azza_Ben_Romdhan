from sqlalchemy import Column, Integer, String, Float
from app.db.session import Base

class ScoreLog(Base):
    __tablename__ = "score_logs"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String)
    industry = Column(String)
    team_size = Column(Integer)
    score = Column(Integer)
    label = Column(String)
    confidence = Column(Float)

