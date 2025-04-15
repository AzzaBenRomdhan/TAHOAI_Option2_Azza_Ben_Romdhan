from fastapi.testclient import TestClient
import pytest
from app.main import app

client = TestClient(app)

# Cas nominaux avec paramétrisation
@pytest.mark.parametrize("payload, expected_label", [
    ({"name": "Tech Giant", "industry": "tech", "team_size": 150}, "Mature"),
    ({"name": "Small Biz", "industry": "retail", "team_size": 15}, "Early Stage"),
    ({"name": "Mid Company", "industry": "finance", "team_size": 60}, "Established"),
])
def test_score_endpoint_success(payload, expected_label):
    """Teste les cas nominaux avec vérification du label attendu."""
    response = client.post("/api/v1/score", json=payload)
    assert response.status_code == 200
    assert response.json()["label"] == expected_label
    assert 0 <= response.json()["confidence"] <= 1  # Validation de la confiance

# Cas d'erreur
@pytest.mark.parametrize("payload, expected_status", [
    ({"name": "Missing Field", "industry": "tech"}, 422),  # team_size manquant
    ({"name": "Invalid", "industry": "tech", "team_size": -10}, 422),  # team_size invalide
])
def test_score_endpoint_errors(payload, expected_status):
    """Teste la validation des erreurs."""
    response = client.post("/api/v1/score", json=payload)
    assert response.status_code == expected_status
    assert "detail" in response.json()

# Test de performance (optionnel)
@pytest.mark.timeout(1)  # Échoue si >1s
def test_score_endpoint_performance():
    """Vérifie que l'endpoint répond rapidement."""
    response = client.post("/api/v1/score", json={
        "name": "Perf Test", "industry": "tech", "team_size": 100
    })
    assert response.status_code == 200