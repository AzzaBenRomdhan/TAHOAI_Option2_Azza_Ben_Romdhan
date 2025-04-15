# 🧠 TAHO AI – Technical Evaluation (Option 2)  
**Business Scoring API & Dashboard**  
_Author: Azza Ben Romdhan – April 2025_

---

## 📌 Objective

Build a full-stack application where users can submit a business profile and receive a **Business Maturity Score** (0–100) powered by an AI-based scoring logic.  
Each score is accompanied by a label: `"Early Stage"`, `"Established"`, or `"Mature"`.

---

## 📌 Video demo
![Project Directory Structure](screenshots/demo.mp4)

---

## 📦 Folder Structure (Backend)
![Project Directory Structure](screenshots/structureBack.png)
```` ```
backend/
│
├── app/
│   ├── __init__.py
│   ├── main.py                       
│   ├── api/
│   │   └── v1/
│   │       └── endpoints/
│   │           └── score.py          # Endpoint POST /score
│   │
│   ├── services/
│   │   └── score_service.py          # Logique mockée + log en base
│   │
│   ├── schemas/
│   │   └── business.py               # Pydantic models (CompanyData, ScoreResponse)
│   │
│   ├── db/
│   │   └── models.py                 # SQLAlchemy models (log table)
│   │   └── session.py                # Création de la session DB (SQLite)
│   │
│   ├── config.py                     # Paramètres comme INDUSTRY_WEIGHTS
│   │
│   ├── tests/
│   │   └── integration/
│   │       └── test_score_api.py  
│   │   └── unit/
│   │      └── test_score_logic.py  
│
├── Dockerfile                        # Image Docker de l’app
├── requirements.txt                  # Dépendances Python
│
├── frontend/                         # Frontend (React) code
│   ├── src/                      
│   │   ├── App.tsx                   # Root React component
│   │   └── ...                       # Other components/assets
│   ├── package.json                  # Frontend dependencies
│   └── Dockerfile                    # Frontend Docker configuration
│
├── docker-compose.yml                # Multi-container setup
└── README.md                         # Project docs
```` ```
---
## 🚀 How to Run the Project

### Prerequisites
- Python
- node

## 📘 Api documentation

### Endpoint
**POST** `/api/v1/score`

### 🔢 Score Logic
- **Score Calculation**:
score = min(100, team_size × industry_weight)
- **Labeling**: 
- 0–39 → Early Stage
- 40–79 → Established
- 80–100 → Mature
- **Confidence Calculation**:
confidence = 0.7 + (0.3 × |score - 50| / 50)
- Minimum confidence: 0.7 (when score = 50)
- Maximum confidence: 1.0 (when score = 0 or 100)

### 🏭 Industry Weights
| Industry      | Weight |
|---------------|--------|
| technology    | 1.8    |
| finance       | 1.3    |
| healthcare    | 1.2    |
| manufacturing | 1.1    |
| retail        | 1.05   |
| education     | 1.05   |
| other         | 1.0    |

---
## 🛠 Local Setup Instructions
1. Clone the repository:
 ```bash
 git clone https://github.com/AzzaBenRomdhan/TAHOAI_Option2_Azza_Ben_Romdhan.git

### Backend (Python)
- Open backend folder:
 ```bash
  cd TAHOAI_Option2_Azza_Ben_Romdhan/backend
- Install dependencies:
 ```bash
  pip install -r requirements.txt
- Activate the virtual environment:
 ```bash
  .\venv\Scripts\activate
- Run the FastAPI app:
 ```bash
  uvicorn main:app --reload
---

### Frontend (React + TypeScript)
- Open backend folder:
 ```bash
 cd TAHOAI_Option2_Azza_Ben_Romdhan/backend
- Install dependencies:
 ```bash
  npm install
 ```bash
- Run the frontend:
 ```bash
  npm run dev


