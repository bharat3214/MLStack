# MLStack

## Overview

**MLStack** is an open-source, no-code machine learning platform designed to simplify the end-to-end ML workflow for **structured, time-series, and image data**. Upload your datasets, let the system auto-train models using 10+ algorithms, and make predictions — all **without writing any code**.

The platform follows a **rule-based AutoML approach** with intelligent fallbacks: automatic data profiling, preprocessing, model selection, training, evaluation, and explainability. Predictions are served through an interactive **Streamlit** interface embedded directly in the dashboard.

MLStack is built entirely on **open-source technologies** — React, Flask, Streamlit, scikit-learn, XGBoost, LightGBM, PostgreSQL, MinIO, Redis, and Docker. It is designed as a **portfolio-grade, production-ready project** that demonstrates full-stack engineering, ML engineering, and cloud deployment skills.

---

## Key Highlights

* 🚀 **No-code ML workflow** — upload a CSV, describe your goal, train models, predict
* 📊 **Supports tabular (CSV/Excel), time-series, and image datasets**
* 🤖 **AI-powered goal analysis** — Groq → Gemini → Ollama fallback chain
* 🧬 **AI Synthetic Data Generation** — describe a dataset in natural language, AI generates realistic data
* ⚖️ **Automated Data Auto-Balancing** — detects skewed classes and applies SMOTE
* 🔍 **Kaggle Integration** — search and import datasets directly from Kaggle
* 📈 **10+ ML algorithms** — Logistic Regression, Random Forest, XGBoost, LightGBM, SVM, etc.
* 🧩 **Model Explainability** — built-in SHAP explanations
* 🔐 **OAuth login** — Google & GitHub SSO + email/password auth
* 📧 **Email notifications** — training completed/failed alerts via SMTP
* 🐳 **Fully Dockerized** — single `docker compose up` to run everything
* 🎯 **Free tier with quotas** — 5 training runs & 2 AI generations per user (configurable via whitelists)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────┐
│               User Browser                  │
│    React Dashboard  ←→  Streamlit Iframe    │
│         :3000                :8501           │
└──────────────┬───────────────┬──────────────┘
               │ REST API      │ Internal API
               ▼               ▼
┌─────────────────────────────────────────────┐
│             Flask Backend (:5000)            │
│         (Core Orchestrator API)              │
│  • Auth & user management                   │
│  • Dataset registration & profiling         │
│  • AutoML workflow control                  │
│  • AI synthetic data generation             │
│  • Prediction orchestration                 │
│  • Usage quota enforcement                  │
└──────────┬──────────┬──────────┬────────────┘
           │          │          │
           ▼          ▼          ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│  PostgreSQL  │ │  MinIO   │ │    Redis     │
│  (Metadata)  │ │ (Storage)│ │  (Celery)    │
│              │ │          │ │              │
│ • Users      │ │ • Datasets│ │ • Task queue│
│ • Experiments│ │ • Models  │ │ • Sessions  │
│ • Jobs       │ │ • Artifacts│ │             │
└──────────────┘ └──────────┘ └──────────────┘
```

### Flow Summary

```
User → React UI → Flask API → AutoML Pipeline → Model + Artifacts → MinIO
                                                        ↓
                              Streamlit UI ← Model Package (ZIP)
                                                        ↓
                                            Predictions in Browser
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **Python 3.10+** (for local development)
- **Node.js 18+** (for local development)

---

## 🐳 Running with Docker (Recommended)

### 1. Clone & Configure

```bash
git clone https://github.com/bharat3214/MLStack.git
cd MLStack
cp .env.example .env
# Edit .env with your API keys (GROQ_API_KEY, KAGGLE credentials, etc.)
```

### 2. Start All Services

```bash
docker compose up --build -d
```

### 3. Access Points

| Service | URL |
|---------|-----|
| **React Dashboard** | http://localhost:3000 |
| **Flask API** | http://localhost:5000/api |
| **Streamlit Predictions** | http://localhost:8501 |
| **MinIO Console** | http://localhost:9001 |

### Stop Services

```bash
docker compose down
```

---

## 🖥️ Local Development (Without Docker)

### Step 1: Start Infrastructure

```bash
docker compose up -d postgres redis minio
```

### Step 2: Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Backend runs at: http://localhost:5000

### Step 3: Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:3000

### Step 4: Streamlit App

```bash
cd streamlit_app
pip install -r requirements.txt
streamlit run app.py
```

Streamlit runs at: http://localhost:8501

### Step 5: Celery Worker (Background Training)

```bash
cd backend
celery -A app.celery_app worker --loglevel=info
```

---

## 📁 Project Structure

```
MLStack/
├── backend/                    # Flask API Server
│   ├── app/
│   │   ├── models/            # SQLAlchemy models (User, Experiment, Dataset, etc.)
│   │   ├── routes/            # API endpoints (auth, datasets, training, models)
│   │   ├── services/          # Business logic (AI, MinIO, mailer, notifications)
│   │   ├── whitelist.json     # Training quota whitelist (unlimited access emails)
│   │   ├── synthetic_whitelist.json  # AI generation whitelist
│   │   └── commands.py        # CLI commands (reset-training-counts)
│   ├── requirements.txt
│   └── run.py                 # Entry point
│
├── frontend/                   # React Dashboard (Vite)
│   ├── src/
│   │   ├── pages/             # Page components (Dashboard, Datasets, Training, etc.)
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # Axios API client
│   │   └── store/             # Zustand state management
│   └── package.json
│
├── ml_engine/                  # AutoML Core
│   ├── automl/
│   │   ├── tabular/           # Classification, Regression, Clustering
│   │   ├── timeseries/        # ARIMA, Prophet, LSTM
│   │   └── vision/            # Image Classification
│   ├── preprocessing/         # Data preprocessors
│   ├── explainability/        # SHAP explanations
│   └── packaging/             # Model packaging (ZIP with schema)
│
├── streamlit_app/              # Prediction UI (embedded in React via iframe)
├── mailer/                     # Node.js email service
├── docker/                     # Dockerfiles
├── tests/                      # Unit & Integration tests
└── docker-compose.yml          # Full stack orchestration
```

---

## 🎯 Usage Quota System

MLStack uses a **free-tier quota model** designed for portfolio demos deployed on free-tier cloud:

| Resource | Limit | Notes |
|----------|-------|-------|
| **Model Training** | 5 successful runs per user | Counted at completion only |
| **AI Data Generation** | 2 saves per user | Users can bring their own Groq API key for unlimited |
| **Datasets** | Unlimited uploads | No restrictions |
| **Predictions** | Unlimited | No restrictions |
| **Algorithms** | All 10+ unlocked | XGBoost, LightGBM, SVM, etc. |

### Whitelists

Admin users can bypass quotas via JSON config files:

- **`backend/app/whitelist.json`** — unlimited training runs
- **`backend/app/synthetic_whitelist.json`** — unlimited AI data generation

```json
{
    "unlimited_access": [
        "your-email@example.com"
    ]
}
```

### Bring Your Own API Key

Users can paste their own **Groq API key** in the AI data generation tab to bypass the 2-generation limit. A link to [console.groq.com/keys](https://console.groq.com/keys) is provided in the UI.

### Admin CLI

```bash
# Reset all training counts (useful for demo resets)
flask reset-training-counts
```

---

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://postgres:postgres@localhost:5432/mlstack_db` |
| `REDIS_URL` | Redis connection | `redis://localhost:6379/0` |
| `MINIO_ENDPOINT` | MinIO server | `localhost:9000` |
| `MINIO_ACCESS_KEY` | MinIO access key | `minioadmin` |
| `MINIO_SECRET_KEY` | MinIO secret key | `minioadmin` |
| `JWT_SECRET_KEY` | JWT signing key | *(change in production)* |
| `GROQ_API_KEY` | Groq API key (AI features) | *(required for AI)* |
| `GEMINI_API_KEY` | Google Gemini key (fallback) | *(optional)* |
| `KAGGLE_USERNAME` | Kaggle API username | *(optional)* |
| `KAGGLE_API_TOKEN` | Kaggle API token | *(optional)* |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | *(optional)* |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | *(optional)* |

---

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` — Create new account
- `POST /api/auth/login` — Login & get JWT token
- `GET /api/auth/me` — Get current user profile
- `POST /api/auth/google` — Google OAuth login
- `POST /api/auth/github` — GitHub OAuth login

### Datasets
- `GET /api/datasets` — List all datasets
- `POST /api/datasets/upload` — Upload dataset (CSV/Excel/images)
- `GET /api/datasets/:id` — Get dataset details
- `GET /api/datasets/:id/profile` — Get data profiling results
- `GET /api/datasets/kaggle/search` — Search Kaggle datasets
- `POST /api/datasets/kaggle/download` — Import from Kaggle
- `POST /api/datasets/ai/schema` — AI-generate dataset schema
- `POST /api/datasets/ai/generate` — AI-generate dataset rows
- `POST /api/datasets/generate-synthetic` — Rule-based synthetic data

### Training
- `POST /api/training/start` — Start training job
- `GET /api/training/:id/status` — Get job status & progress
- `GET /api/training/:id/logs` — Get training logs
- `POST /api/training/:id/cancel` — Cancel a running job
- `POST /api/training/analyze-prompt` — AI-powered goal analysis

### Models
- `GET /api/models` — List trained models
- `GET /api/models/:id` — Get model details
- `GET /api/models/:id/download` — Download model package (ZIP)
- `GET /api/models/:id/schema` — Get prediction form schema
- `GET /api/models/:id/graphs` — Get evaluation graphs
- `DELETE /api/models/:id` — Delete a model

### Notifications
- `GET /api/notifications/preferences` — Get notification preferences
- `PUT /api/notifications/preferences` — Update notification preferences

---

## 🧪 Running Tests

```bash
pip install pytest
pytest
pytest --cov=.
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙋 Support

For issues or questions, please open an issue on [GitHub](https://github.com/bharat3214/MLStack/issues).
