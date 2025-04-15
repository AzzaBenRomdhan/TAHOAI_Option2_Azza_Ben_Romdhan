import pytest
from app.services.score_service import calculate_maturity_score
from app.schemas.business import CompanyData

# Test paramétrisé pour couvrir toutes les règles métier
@pytest.mark.parametrize("input_data, expected", [
    (
        {"name": "Startup", "industry": "other", "team_size": 5},
        {"label": "Early Stage", "score": 5, "confidence_min": 0.7}
    ),
    (
        {"name": "Tech Unicorn", "industry": "tech", "team_size": 100},
        {"label": "Mature", "score": 100, "confidence_min": 0.9}
    ),
    (
        {"name": "Finance Corp", "industry": "finance", "team_size": 45},
        {"label": "Established", "score": 58.5, "confidence_min": 0.8}  # Ex: 45 * 1.3
    ),
])
def test_score_calculation(input_data, expected):
    """Teste la logique de scoring avec des attentes précises."""
    data = CompanyData(**input_data)
    result = calculate_maturity_score(data)
    
    assert result["label"] == expected["label"]
    assert result["score"] == expected["score"]  # Suppose une formule exacte
    assert result["confidence"] >= expected["confidence_min"]

# Test des limites
def test_zero_team_size():
    """Vérifie le comportement avec team_size=0."""
    data = CompanyData(name="Zero", industry="tech", team_size=0)
    result = calculate_maturity_score(data)
    assert result["score"] == 0
    assert result["label"] == "Early Stage"

# Mocking de la base de données (si utilisé)
def test_db_logging(monkeypatch):
    """Simule l'appel à la base de données."""
    calls = []
    monkeypatch.setattr(
        "app.services.score_service.log_score_to_db",
        lambda *args: calls.append(args)
    )
    data = CompanyData(name="Test", industry="tech", team_size=50)
    calculate_maturity_score(data)
    assert len(calls) == 1  # Vérifie que la DB est appelée