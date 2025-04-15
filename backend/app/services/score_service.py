from app.schemas.business import CompanyData
from app.config import INDUSTRY_WEIGHTS
from app.db.models import ScoreLog
from app.db.session import SessionLocal
from app.logging_config import logger

def calculate_confidence(score: int) -> float:
    """
    Calcule une confiance réaliste entre 70% et 100% :
    - 70%  quand le score est à 50 (zone d'incertitude maximale)
    - 100% quand le score est à 0 ou 100 (certitude absolue)
    - Variation progressive entre ces valeurs
    """
    distance_from_midpoint = abs(score - 50) / 50  # Normalise entre 0 et 1
    return round(0.7 + (0.3 * distance_from_midpoint), 2)  # Garanti entre 0.7 et 1.0

def calculate_maturity_score(data: CompanyData) -> dict:
    db = None
    try:
        # Validation
        if data.team_size < 0:
            logger.warning(f"Invalid team size: {data.team_size} for company: {data.name}")
            raise ValueError("Team size must be a positive integer")

        # Calcul du score
        industry_weight = INDUSTRY_WEIGHTS.get(data.industry.lower(), 1.0)
        score = min(100, int(data.team_size * industry_weight))

        # Détermination du label
        if score < 40:
            label = "Early Stage"
        elif score < 80:
            label = "Established"
        else:
            label = "Mature"

        # Calcul de confiance
        confidence = calculate_confidence(score)

        logger.info(
            f"Calculated score for {data.name} - "
            f"Score: {score}, Label: {label}, Confidence: {confidence}"
        )

        # Sauvegarde en base
        db = SessionLocal()
        db_log = ScoreLog(
            company_name=data.name,
            industry=data.industry,
            team_size=data.team_size,
            score=score,
            label=label,
            confidence=confidence
        )
        db.add(db_log)
        db.commit()
        logger.info(f"Score saved in DB for {data.name}")

        return {
            "score": score,
            "label": label,
            "confidence": confidence
        }

    except Exception as e:
        logger.error(f"Error during score calculation for {data.name}: {e}")
        if db:
            db.rollback()
        raise

    finally:
        if db:
            db.close()