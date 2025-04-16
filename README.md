# 🧠 TAHO AI – Technical Evaluation (Option 2)

**Business Scoring API & Dashboard**

---

## 📌 Objective

Build a full-stack application where users can submit a business profile and receive a **Business Maturity Score** (0–100) powered by an AI-based scoring logic.  
Each score is accompanied by a label: `"Early Stage"`, `"Established"`, or `"Mature"`.

---

## 🎥 Video Demo

[![Watch the demo](https://img.youtube.com/vi/your_video_id/0.jpg)](https://github.com/user-attachments/assets/388618e3-4e2d-4f8b-8fea-e17712797d67)  
> *(If the thumbnail doesn't appear, you can simply link to the video here:)*  
➡️ [Watch the demo video](https://github.com/user-attachments/assets/388618e3-4e2d-4f8b-8fea-e17712797d67)

---

## 📦 Project Structure
```bash
TAHOAI_Option2_Azza_Ben_Romdhan/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── api/v1/endpoints/score.py           # POST /score endpoint
│   │   ├── services/score_service.py           # Mock logic + DB logging
│   │   ├── schemas/business.py                 # Pydantic models
│   │   ├── db/models.py                        # SQLAlchemy models
│   │   ├── db/session.py                       # DB session setup (SQLite)
│   │   ├── config.py                           # INDUSTRY_WEIGHTS & settings
│   │   ├── tests/
│   │   │   ├── integration/test_score_api.py
│   │   │   └── unit/test_score_logic.py
│   ├── Dockerfile                              # Backend Dockerfile
│   ├── requirements.txt                        # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                             # Root component
│   │   └── ...                                 # Other components
│   ├── package.json                            # Frontend dependencies
│   ├── Dockerfile                              # Frontend Dockerfile
│
├── docker-compose.yml                          # Multi-container setup
└── README.md
```
---
## 🔢 Score Logic
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


## 🚀 How to Run the Project

### 🧰 Prerequisites
- **Python** (3.12+)
- **Node.js** (v20+)
- (Optionnel) **Docker** & **Docker Compose**

---

### ▶️ Option 1: Run Locally (Without Docker)

#### 🧩 Step 1: Clone the Repository
```bash
git clone https://github.com/AzzaBenRomdhan/TAHOAI_Option2_Azza_Ben_Romdhan.git
cd TAHOAI_Option2_Azza_Ben_Romdhan
```

#### ⚙️ Step 2: Start the Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate        # For Linux/Mac
# .\venv\Scripts\activate       # For Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### 💻 Step 3: Start the Frontend (React + TypeScript)
```bash
cd ../frontend
npm install
npm run dev
```

---

### ▶️ Option 2: Run with Docker

#### 🚢 Run the app using Docker Compose
```bash
git clone https://github.com/AzzaBenRomdhan/TAHOAI_Option2_Azza_Ben_Romdhan.git
cd TAHOAI_Option2_Azza_Ben_Romdhan
docker-compose up --build
```

#### ✅ Access the App
- API: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:5173](http://localhost:5173)

---

### 🛑 Useful Docker Commands

#### Stop all services
```bash
docker-compose down
```

#### Rebuild without cache
```bash
docker-compose build --no-cache
docker-compose up
```

#### Full cleanup (including volumes)
```bash
docker-compose down -v
```

---

## 📘 API Documentation

### 📍 Endpoint
**POST** `/api/v1/score`




