# MLStack — Required Code Changes for AWS Deployment

This document lists the **code-level changes** needed to run the current MLStack architecture reliably on AWS with ECS Fargate, S3, RDS, and CloudFront.

## ✅ Summary of Current Architecture Gaps
- Storage is still tied to **MinIO** (local/dev), but production uses **S3**.
- Training runs in a **local background thread**, not in ECS on-demand tasks.
- There is **no ECS task status polling** endpoint for the frontend.
- Health check exists at `/api/health`, but ALB typically expects `/health`.
- Secrets are partly assumed via local `.env` defaults.

---

## 1) Replace MinIO with native S3 (boto3)

**Why:** MinIO is a local/dev storage layer. In AWS, you should use native S3 for reliability, IAM auth, and VPC endpoints.

**Required code changes:**
- **Create a new service** `backend/app/services/s3_service.py` using `boto3` and implement the same interface currently used in `minio_service.py`:
  - `upload_bytes`, `download_bytes`, `upload_file`, `download_file`, `delete_object`, `list_objects`, and optional `presigned_url` helpers.
- **Replace imports and usage** of `get_minio_service()` with a new `get_s3_service()` in:
  - `backend/app/routes/datasets.py`
  - `backend/app/routes/models.py`
  - `backend/app/routes/predictions.py`
  - `backend/app/tasks/training_tasks.py`
  - `backend/standalone_runner.py`
- **Update configuration** in `backend/app/config.py`:
  - Remove MinIO vars: `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_SECURE`.
  - Add S3 vars: `AWS_REGION`, `S3_DATASETS_BUCKET`, `S3_MODELS_BUCKET`, `S3_ARTIFACTS_BUCKET`.
- **Update comments/fields** referencing “MinIO path” in `backend/app/models/experiment.py` and `backend/app/models/experiment.py` (`model_path`, `best_model_id`) to reflect S3 object keys.
- **Update dependencies** in `backend/requirements.txt`: remove `minio`, add `boto3`.

---

## 2) Replace local training threads with ECS Fargate tasks

**Why:** ECS Fargate gives isolated, on-demand training with zero idle cost. The current thread-based execution will not scale or survive ECS task restarts.

**Required code changes:**
- **Create ECS launcher service** `backend/app/services/ecs_service.py` (as described in `deployment-aws.md`).
- **Update training start route** in `backend/app/routes/training.py`:
  - Replace the background thread with an ECS `run_task()` call.
  - Store the returned `taskArn` in the database for status polling.
- **Add a new DB field** on `Experiment` (or `TrainingJob`):
  - `training_task_arn = db.Column(db.String(512))`
  - Create an Alembic migration for this column.

---

## 3) Add training task status polling endpoint

**Why:** The frontend needs real-time task status while the training container runs in ECS.

**Required code changes:**
- **Add a new endpoint** such as:
  - `GET /api/experiments/<id>/status`
  - Calls `ecs:DescribeTasks` using the stored `taskArn`.
  - Returns `lastStatus` and optional `exitCode` if stopped.
- **Update the cancel endpoint** (`/api/training/<job_id>/cancel`) to call `ecs:StopTask` instead of only updating DB status.

---

## 4) Add ALB-friendly health endpoint

**Why:** ALB health checks usually target `/health`. You currently expose `/api/health` only.

**Required code changes:**
- Add a lightweight route in `backend/app/__init__.py`:
  - `GET /health` → `200 OK`
  - Keep `/api/health` for backward compatibility.

---

## 5) Secrets and production config hardening

**Why:** ECS will inject secrets via Secrets Manager; production should not rely on dev defaults.

**Required code changes:**
- Ensure secrets are only read from environment variables:
  - `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, `REDIS_URL`, `GEMINI_API_KEY`, `GROQ_API_KEY`.
- Update any fallback defaults in `backend/app/config.py` to be explicit for production or log a warning when using defaults.

---

## 6) Optional: remove Celery if not used

**Why:** If training is fully ECS-based, Celery worker logic becomes unused and adds infra cost.

**Options:**
- **Option A (Preferred):** Remove Celery usage entirely.
  - Deprecate `backend/app/celery_app.py` and `backend/app/tasks/training_tasks.py`.
- **Option B:** Keep Celery only for non-training tasks and host a separate ECS service + ElastiCache.

---

## 7) Frontend wording and UI references

**Why:** The UI still mentions MinIO in marketing/feature text.

**Required code changes:**
- Update `frontend/src/pages/LandingPage.jsx` to replace “MinIO” with “S3”.

---

## 8) Add/verify build-time environment values

**Why:** AWS deployments must be fully config-driven.

**Required code changes:**
- Ensure ECS task definitions set:
  - `AWS_REGION`, `S3_DATASETS_BUCKET`, `S3_MODELS_BUCKET`, `S3_ARTIFACTS_BUCKET`
  - `ECS_CLUSTER_NAME`, `ECS_TASK_DEFINITION`, `ECS_SUBNET_IDS`, `ECS_SECURITY_GROUPS`
  - `MAILER_URL` (if mailer runs in ECS), `REDIS_URL` (if Redis is still used)

---

## ✅ Outcome
Once these code changes are implemented, MLStack will be:
- **S3-native** (no MinIO)
- **ECS-native** for training workloads
- **ALB and CloudFront friendly**
- **Secrets Manager compatible**
- **Ready for CI/CD** with clean separation of build and runtime config
