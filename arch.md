# MLStack System Architecture

This document provides a highly detailed, comprehensive overview of the **MLStack** technical architecture, directory structure, data models, and core execution flows.

---

## 🗺️ High-Level System Architecture

MLStack is composed of five principal systems working together to deliver a seamless no-code AutoML experience:

```
                  ┌───────────────────────────────────────────────┐
                  │                 User Browser                  │
                  │   ┌───────────────────────┐  ┌────────────┐   │
                  │   │ React Dashboard (Vite)│  │ Streamlit  │   │
                  │   │       (Port 3000)     │  │   Iframe   │   │
                  │   └───────────┬───────────┘  └──────▲─────┘   │
                  └───────────────┼─────────────────────┼─────────┘
                                  │ REST API            │ Load Model Artifacts
                                  ▼                     │ (Port 8501)
┌───────────────────────────────────────────────────────┼────────────────┐
│                   Flask Backend (Port 5000)           │                │
│                                                       │                │
│   ┌───────────────┐  ┌───────────────┐  ┌─────────────┴─┐              │
│   │  Auth & Users │  │ Dataset APIs  │  │ Predictions   │              │
│   └───────────────┘  └───────┬───────┘  └───────────────┘              │
│                              │                                         │
│                              ▼                                         │
│   ┌──────────────────────────────────────────┐                         │
│   │             Celery Task Runner           │                         │
│   │      ┌────────────────────────────┐      │                         │
│   │      │    profile_dataset_task    │      │                         │
│   │      ├────────────────────────────┤      │                         │
│   │      │     train_model_task       │      │                         │
│   │      └────────────────────────────┘      │                         │
└────────────────────────┬───────┬───────┬───────────────────────────────┘
                         │       │       │
                         ▼       ▼       ▼
                  ┌──────────┐ ┌───┐ ┌───────┐      ┌────────────────────┐
                  │PostgreSQL│ │Min│ │ Redis │      │Node Mailer Service │
                  │ Metadata │ │IO │ │Broker │◄────►│     (Port 4000)    │
                  └──────────┘ └───┘ └───────┘      └────────────────────┘
```

---

## 🛠️ Technology Stack & Communication Protocols

### 1. Frontend Client (`frontend/`)
* **Framework**: React 18 powered by **Vite** for optimized development compilation and production bundling.
* **State Management**: **Zustand** stores handle global client state including persistent authentication state (`mlstack-auth` inside `localStorage`), token persistence, and user configuration.
* **Server State**: **React Query** (`@tanstack/react-query`) handles cached server side queries, cache-invalidation on dataset mutations, and polling mutations for async background tasks.
* **Styling**: Pure **Vanilla CSS** following an **Emerald Accent Design System** for fluid layouts, dark-mode styling, and transitions.

### 2. Main API Server (`backend/`)
* **Framework**: **Flask** REST API with **Flask-CORS** enabling cross-origin browser queries and **Flask-JWT-Extended** providing secure stateless authentication.
* **Database Access**: **Flask-SQLAlchemy** (Object-Relational Mapping for PostgreSQL database management) and **Flask-Migrate** (Alembic-based database schema migration manager).
* **Task Scheduling**: **Celery** orchestrates compute-intensive background workloads, using **Redis** as a transient broker and result backend.
* **Automated Data Processing**: **pandas**, **numpy**, **scikit-learn**, **prophet**, **statsmodels**, and **imbalanced-learn** (SMOTE class auto-balancing).

### 3. Prediction Service (`streamlit_app/`)
* **Environment**: A standalone **Streamlit** dashboard embedded directly into the React UI via responsive `iframe` windows.
* **Cache Management**: Unique iframe keys (`key={streamlit-${selectedModel}}`) are generated on model selection to force fresh container reloads, preventing stale model execution.
* **Execution Engine**: Reads standardized, serialized model package ZIP archives directly from MinIO and reconstructs predictions and explanations dynamically using **SHAP**.

### 4. Object Storage & Services
* **Object Store**: **MinIO** (S3-compatible) stores raw source datasets, uploaded CSV/Excel files, trained model assets, and complete zip packages.
* **Email Bridge**: A dedicated microservice written in **Node.js** (`mailer/`) exposes an HTTP endpoint (`POST /send`). The Flask backend uses a REST wrapper to delegate OTP delivery, password resets, and job status notifications.

---

## 💾 Core Metadata Schema (PostgreSQL Models)

The backend uses a relational database schema structured around five primary models inside `backend/app/models/`:

### 1. User Model (`User`)
* **Description**: Holds credentials, registration flags, and quota counters.
* **Key Columns**:
  * `id` (Integer, Primary Key)
  * `email` (String, Unique)
  * `username` (String, Unique)
  * `password_hash` (String)
  * `email_verified` (Boolean)
  * `oauth_provider` / `oauth_provider_id` (Stateless SSO tracking)
  * `training_count` (Integer) — Tracks total successfully trained AutoML models.
  * `synthetic_count` (Integer) — Tracks total AI-generated synthetic datasets saved.
* **Quota Properties**:
  * `is_whitelisted` / `is_synthetic_whitelisted` — Flags emails bypass quotas (read fresh from `whitelist.json` / `synthetic_whitelist.json`).
  * `has_training_quota` — Allows training if `training_count < 5` or whitelisted.
  * `has_synthetic_quota` — Allows schema/data generation if `synthetic_count < 2` or whitelisted.

### 2. Dataset Model (`Dataset`)
* **Description**: Keeps metadata records of user files located in MinIO.
* **Key Columns**:
  * `id` (Integer, Primary Key)
  * `name` / `description` (String/Text)
  * `file_path` (String) — Reference path inside MinIO.
  * `file_type` (String) — `csv`, `xlsx`, or `image_zip`.
  * `data_type` (String) — `tabular`, `timeseries`, or `image`.
  * `num_rows` / `num_columns` (Integer)
  * `column_info` (JSON) — Parsed profiles including data types and statistics.
  * `profile_status` (String) — `pending`, `processing`, `completed`, or `failed`.
  * `profile_data` (JSON) — Rich profile data processed by the `DataProfiler`.

### 3. Experiment Model (`Experiment`)
* **Description**: Tracks the definition and training job history of a specific AutoML project.
* **Key Columns**:
  * `id` (Integer, Primary Key)
  * `name` / `description` (String/Text)
  * `problem_type` (String) — e.g. `classification`, `regression`, `clustering`, `timeseries`.
  * `target_column` (String) — Target variable column name.
  * `goal_description` (Text) — Natural language training directive.
  * `config` (JSON) — Algorithmic hyperparameters, feature tuning options, and balance options.
  * `status` (String) — `created`, `training`, `completed`, or `failed`.
  * `best_model_name` (String) — Trained algorithm that yielded the highest validation score.
  * `best_score` (Float) — Validation score metric value.
  * `best_model_id` (String) — MinIO path mapping to the standard packaged ZIP.

### 4. Training Job Model (`TrainingJob`)
* **Description**: Granular logging of individual algorithms evaluated during an AutoML run.
* **Key Columns**:
  * `id` (Integer, Primary Key)
  * `model_name` (String) — e.g. `RandomForest`, `XGBoost`, `LightGBM`.
  * `model_params` (JSON) — Evaluated hyperparameters.
  * `status` (String) — `pending`, `running`, `completed`, or `failed`.
  * `progress` (Float) — Current execution state percentage (0-100%).
  * `metrics` (JSON) — Calculated evaluation scores (Accuracy, F1, Precision, Recall, MSE, R²).

### 5. Notification Preferences Model (`NotificationPreference`)
* **Description**: Stores user configurations for automated email dispatch settings.
* **Key Columns**:
  * `user_id` (Integer, ForeignKey)
  * `training_completed` / `training_failed` / `dataset_uploaded` (Boolean toggles)

---

## 🔄 Core Execution Flows

### 1. Automated Data Profiling Flow
When a user uploads a new dataset, it is registered, uploaded, and analyzed asynchronously:

```
┌───────────┐         ┌──────────────┐         ┌───────────┐         ┌──────────────┐
│ React UI  │         │ Flask Server │         │   MinIO   │         │ Celery Task  │
└─────┬─────┘         └──────┬───────┘         └─────┬─────┘         └──────┬───────┘
      │                      │                       │                      │
      │ POST /datasets/upload│                       │                      │
      ├─────────────────────►│                       │                      │
      │                      │ Upload file bytes     │                      │
      │                      ├──────────────────────►│                      │
      │                      │                       │                      │
      │                      │ Register pending DB   │                      │
      │                      ├──────────────┐        │                      │
      │                      │              │        │                      │
      │                      │◄─────────────┘        │                      │
      │                      │                       │                      │
      │                      │ Dispatch celery task  │                      │
      │                      ├───────────────────────┼─────────────────────►│
      │                      │                       │                      │
      │ Upload Success Response                      │                      │
      │◄─────────────────────┤                       │                      │
      │                      │                       │ Download dataset file│
      │                      │                       │◄─────────────────────┤
      │                      │                       │                      │
      │                      │                       │                      │ Run DataProfiler
      │                      │                       │                      ├────────┐
      │                      │                       │                      │        │
      │                      │                       │                      │◄───────┘
      │                      │                       │                      │
      │                      │                       │                      │ Save profile_data
      │                      │                       │                      │ and complete status
      │                      │◄──────────────────────┼──────────────────────┤
```

### 2. AutoML Training Pipeline
When an AutoML run is initiated, the system executes an automated workflow inside `train_model_task`:

```
1. Setup & Context Retrieval
   - Instantiate Flask app context inside Celery.
   - Fetch Experiment, Dataset, and User data.
   
2. Data Fetching
   - Download the raw dataset CSV from MinIO to a secure temporary local folder.
   - Load file into memory as a Pandas DataFrame.

3. Preprocessing & Feature Engineering
   - Apply `TabularPreprocessor`.
   - Drop rows with missing values in the target column.
   - Extract feature types (numerical, categorical).
   - Impute missing numerical fields (median) and missing categorical fields (mode).
   - One-hot encode categorical features and scale numerical fields.

4. Imbalance Correction (SMOTE)
   - If class auto-balancing is enabled and the target is classification, apply SMOTE to balanced classes.

5. AutoML Model Exploration & Selection
   - Instantiate classifiers, regressors, or clusterers.
   - Run hyperparameter searches across multiple algorithms:
     * Classification: Logistic Regression, Random Forest, Extra Trees, Gradient Boosting, XGBoost, LightGBM.
     * Regression: Linear Regression, Ridge, Random Forest, XGBoost, LightGBM, SVM.
   - Evaluate against a holdout test set (20%) and calculate performance metrics.
   - Identify the best performing model.

6. Evaluation Plot Generation
   - Generate diagnostic visual plots (`ModelVisualizer`):
     * Classification: Confusion Matrix, ROC Curve, Precision-Recall Curve.
     * Regression: Predicted vs Actual residuals plot.

7. Standardization & Model Packaging (`ModelPackager`)
   - Create a standardized package folder structure:
     ├── model.joblib             (Trained model binary)
     ├── preprocessor.joblib      (Preprocessor pipeline)
     ├── schema.json              (Inferred data schema & validation metadata)
     ├── metadata.json            (Metrics, params, environment stats)
     └── graphs/                  (Generated performance images)
   - Compress folder into a unified model package ZIP archive.
   - Upload package ZIP directly to MinIO.

8. Complete State Management
   - Update Experiment database status to 'completed', and save the best model ID and score.
   - If enabled, query user notification preferences and send completed/failed template emails.
```

### 3. Natural Language AI Schema & Data Generation
Enables users to design schema structures and generate mock dataset rows via simple text prompts:

```
1. Schema Generation (`/ai/schema`)
   - User inputs a prompt (e.g. "Simulate heart disease dataset for patients").
   - System checks if the user provided a personal Groq API key or has remaining free synthetic quota.
   - Prompt sent to Groq AI service.
   - LLM designs features, descriptions, types, and constraints, returning a structured JSON schema.

2. Row Generation (`/ai/generate`)
   - User validates features, configures row counts, and clicks generate.
   - If the user uses a free quota, the backend checks and decrements the remaining count.
   - AI service requests 30 highly descriptive, realistic seed rows representing the target schema.
   - Pandas processes seed rows and applies programmatic interpolation to extend the seed dataset to the requested rows.
   - The resulting DataFrame is converted to CSV, uploaded to MinIO, and registered as a ready-to-train dataset.
```

### 4. Embedded Streamlit Prediction Flow
Allows instant model interaction directly inside the browser using standard model ZIP archives:

```
1. Active Model Selection
   - The user opens the Predictions Page in the React UI and selects an experiment.
   - React UI mounts a Streamlit iframe pointing to the Streamlit app URL with model ID parameters.

2. Loading Model Archive
   - Streamlit backend downloads the packaged model ZIP from MinIO to an internal cache directory.
   - Unzips model, loading the preprocessor, model pipeline, and the inferred feature schema.

3. Dynamic UI Generation
   - Streamlit reads `schema.json` and renders suitable form inputs dynamically:
     * Numeric features -> Sliders or number inputs with min/max values.
     * Categorical features -> Selection boxes populated with unique values.

4. Real-time Inference & Explanations
   - User edits form values and submits.
   - Values pass through the preprocessor pipeline and are evaluated by the loaded model.
   - The Streamlit engine calculates SHAP values and displays visual graphs explaining each feature's contribution.
```

---

## 📂 Source Code Layout & Subsystems

The repository is modularly segmented, cleanly isolating infrastructure, API orchestration, frontend layouts, and machine learning components:

```
MLStack/
├── backend/                       # Flask API & Task Orchestration
│   ├── app/
│   │   ├── models/               # SQLAlchemy Models
│   │   ├── routes/               # REST API Routes
│   │   ├── services/             # MinIO, Email, AI Services
│   │   ├── tasks/                # Celery Background Tasks
│   │   └── whitelist.json        # Unlimited training access emails
│   │   └── synthetic_whitelist.json # Unlimited AI generation emails
│   ├── migrations/               # Alembic database migrations
│   └── run.py                    # Application Entrypoint
│
├── frontend/                      # React UI & Client State
│   ├── src/
│   │   ├── components/           # Reusable UI Elements (Modals, Buttons)
│   │   ├── pages/                # Core Page Views (Datasets, Predictions)
│   │   ├── services/             # Axios API client functions
│   │   └── store/                # Zustand State Management (authStore)
│   └── package.json              # Client configurations
│
├── ml_engine/                     # Core Machine Learning & AutoML Engine
│   ├── automl/                   # Model Training Orchestration
│   │   ├── tabular/              # Tabular (Classification, Regression, Clustering)
│   │   ├── timeseries/           # Prophet & Time Series Algorithms
│   │   └── vision/               # PyTorch-based image processing pipelines
│   ├── preprocessing/            # Tabular & Vision Data Preprocessors
│   ├── explainability/           # SHAP & Feature Importance utilities
│   ├── packaging/                # Model Packaging & schema tools
│   └── utils/                    # System GPU & Plot visualization tools
│
├── streamlit_app/                 # Streamlit No-Code Predictions
│   ├── app.py                    # Model loader, form renderer & Predictor
│   └── requirements.txt          # Streamlit dependencies
│
├── mailer/                        # HTTP Mailer microservice (Node.js)
├── docker/                        # Component Dockerfiles
└── docker-compose.yml             # Full Stack Docker Orchestrator
```
