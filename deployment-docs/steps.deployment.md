# MLStack — Absolute Beginner's AWS Deployment Guide

This guide provides a **step-by-step, click-by-click walkthrough** to deploy **MLStack** on AWS using our high-performance **Serverless Ephemeral Task Architecture**. 

Even if you have **never opened the AWS Console before**, you can successfully deploy this entire stack by following these instructions.

---

## 📋 Table of Contents
1. [Prerequisites & AWS Setup](#step-1-prerequisites--aws-setup)
2. [VPC Network Creation (The Secure Vault)](#step-2-vpc-network-creation-the-secure-vault)
3. [Provision S3 (File Storage)](#step-3-provision-s3-file-storage)
4. [Provision RDS PostgreSQL (The Database)](#step-4-provision-rds-postgresql-the-database)
5. [Provision ElastiCache Redis (The Transient Broker)](#step-5-provision-elasticache-redis-the-transient-broker)
6. [AWS Secrets Manager (Safe Env Storage)](#step-6-aws-secrets-manager-safe-env-storage)
7. [ECR (Uploading Docker Containers)](#step-7-ecr-uploading-docker-containers)
8. [ECS Fargate Setup (Compute Services & Ephemeral Tasks)](#step-8-ecs-fargate-setup-compute-services--ephemeral-tasks)
9. [Application Load Balancer (Routing Traffic)](#step-9-application-load-balancer-routing-traffic)
10. [Hosting Frontend (S3 + CloudFront CDN)](#step-10-hosting-frontend-s3--cloudfront-cdn)

---

## 🛠️ Step 1: Prerequisites & AWS Setup

Before launching resources on AWS, we need to install the control tools on your local computer and set up your credentials.

### 1. Create an AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com/) and click **Create an AWS Account**.
2. Complete the billing and verification steps. You will start on the **Free Tier**.

### 2. Install tools on your Local Machine
Open your local terminal and install the **AWS CLI** and **Docker**:
```bash
# Install AWS CLI (Linux/Ubuntu)
sudo apt-get update
sudo apt-get install awscli -y

# Verify installation
aws --version
docker --version
```

### 3. Generate AWS Access Keys
1. In the AWS Console search bar at the top, type **IAM** and click on the **IAM** service.
2. In the left sidebar, click **Users**, then click **Create user**.
3. Name the user `mlstack-admin`, check **Provide user access to the AWS Management Console**, and click **Next**.
4. Select **Attach policies directly**, search for **AdministratorAccess**, check the box next to it, and click **Next** $\rightarrow$ **Create user**.
5. Click on your newly created `mlstack-admin` user, go to the **Security credentials** tab, scroll down to **Access keys**, and click **Create access key**.
6. Select **Command Line Interface (CLI)**, check the box confirming you understand, click **Next** $\rightarrow$ **Create access key**.
7. **Copy your Access Key ID and Secret Access Key** (save them in a secure place, as they will never be shown again!).

### 4. Configure your Local CLI
In your local terminal, run:
```bash
aws configure
```
Enter your copied keys and default region settings:
*   **AWS Access Key ID**: `YOUR_ACCESS_KEY_ID`
*   **AWS Secret Access Key**: `YOUR_SECRET_ACCESS_KEY`
*   **Default region name**: `ap-south-1` (Mumbai, recommended for low latency)
*   **Default output format**: `json`

---

## 🌐 Step 2: VPC Network Creation (The Secure Vault)

We will create a virtual network isolated from the public internet to host your databases and background workers securely.

1. Search for **VPC** in the top search bar and click on the **VPC** service.
2. Click the orange **Create VPC** button.
3. Under **VPC settings**, select **VPC and more** (this launches a visual automated wizard).
4. Configure the wizard:
    *   **Name tag auto-generation**: `mlstack-network`
    *   **IPv4 CIDR block**: `10.0.0.0/16`
    *   **Number of Availability Zones (AZs)**: `2` (Provides high availability)
    *   **Number of Public Subnets**: `2`
    *   **Number of Private Subnets**: `2`
  *   **NAT Gateways ($)**: Select **1 per AZ** (Allows your private Fargate containers to talk to ECR, Secrets Manager, CloudWatch, and external APIs).
  *   **VPC Endpoints**: Select **S3 Gateway** (Free optimization to speed up S3 downloads). Optionally add **Interface Endpoints** for **ECR**, **Secrets Manager**, and **CloudWatch Logs** to reduce NAT traffic.
5. Click **Create VPC** at the bottom. Wait 2 minutes for the progress bar to finish.

---

## 🪣 Step 3: Provision S3 (File Storage)

S3 will replace local MinIO to store raw datasets and trained models.

1. Search for **S3** and click the service.
2. Click **Create bucket**.
3. Configure the bucket:
    *   **Bucket name**: `mlstack-storage-prod-<your-unique-suffix>` (Must be globally unique, lowercase, no spaces).
    *   **AWS Region**: `ap-south-1`
    *   **Object Ownership**: `Bucket owner preferred`
    *   **Block Public Access settings**: Keep **Block all public access** checked (Extremely important for security).
4. Click **Create bucket**.

---

## 🐘 Step 4: Provision RDS PostgreSQL (The Database)

This will host your transactional metadata (users, experiments, training jobs).

1. Search for **RDS** and click the service.
2. Click **Databases** in the sidebar, then click **Create database**.
3. Configure the database wizard:
    *   **Choose a database creation method**: **Standard create**
    *   **Engine options**: **PostgreSQL**
    *   **Templates**: Select **Free Tier** (or **Dev/Test** for production workloads).
    *   **DB instance identifier**: `mlstack-database`
    *   **Master username**: `mlstack_admin`
    *   **Master password**: Choose a strong password (write this down!).
    *   **DB instance class**: `db.t3.micro` (Free tier eligible).
    *   **Storage type**: `gp3` with `20 GB` allocated.
    *   **Connectivity**:
        *   **Virtual private cloud (VPC)**: Select `mlstack-network-vpc`.
        *   **Public access**: Select **No** (Blocks hackers from accessing your database port directly).
        *   **Existing VPC security groups**: Click **Create new**, name it `sg-rds`, and click **Create database**.

---

## ⚡ Step 5: Provision ElastiCache Redis (The Transient Broker)

Redis manages Celery routing and short-term tracking.

1. Search for **ElastiCache** and click the service.
2. In the left sidebar under **Redis clusters**, click **Create Redis cluster**.
3. Configure Redis:
    *   **Cluster engine**: **Redis**
    *   **Location**: **Amazon Cloud**
    *   **Deployment option**: **Serverless** (Recommeded, auto-scales down to zero when idle).
    *   **Name**: `mlstack-redis`
    *   **Subnet Group**: Select private subnets within the `mlstack-network-vpc`.
    *   **Security Groups**: Create a new security group named `sg-redis` that allows incoming traffic on port `6379` only from the VPC.
4. Click **Create**.

---

## 🔐 Step 6: AWS Secrets Manager (Safe Env Storage)

We will secure your API credentials and environment secrets.

1. Search for **Secrets Manager** and click the service.
2. Click **Store a new secret**.
3. Select **Other type of secret**.
4. Under **Key/value pairs**, add the following keys with your values:
    *   `DATABASE_URL` $\rightarrow$ `postgresql://mlstack_admin:<YOUR_PASSWORD>@<RDS_ENDPOINT>:5432/mlstack_db`
    *   `REDIS_URL` $\rightarrow$ `redis://<REDIS_ENDPOINT>:6379/0`
    *   `SECRET_KEY` $\rightarrow$ Create a random string.
    *   `GEMINI_API_KEY` $\rightarrow$ Your Google Gemini API Key.
    *   `GROQ_API_KEY` $\rightarrow$ Your Groq API Key.
5. Click **Next**, name the secret `mlstack/prod/env`, and click **Store**.
6. Note: ECS task definitions should reference these values via the `secrets` block (`valueFrom`). Grant the task role `secretsmanager:GetSecretValue`.

---

## 📦 Step 7: ECR (Uploading Docker Containers)

We will upload your localized code into secure online container registries.

### 1. Create ECR repositories
Run these in your local terminal:
```bash
aws ecr create-repository --repository-name mlstack/backend --region ap-south-1
aws ecr create-repository --repository-name mlstack/frontend --region ap-south-1
aws ecr create-repository --repository-name mlstack/mailer --region ap-south-1
```

### 2. Log in, Build, and Push Images
Run this script to compile and upload the images:
```bash
# Log docker into your AWS account ECR registry
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# 1. Build and Push Backend
docker build -f docker/Dockerfile.backend -t mlstack/backend .
docker tag mlstack/backend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/mlstack/backend:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/mlstack/backend:latest

# 2. Build and Push Frontend (optional if you use S3 + CloudFront only)
docker build -f docker/Dockerfile.frontend -t mlstack/frontend .
docker tag mlstack/frontend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/mlstack/frontend:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/mlstack/frontend:latest

# 3. Build and Push Mailer
docker build -f docker/Dockerfile.mailer -t mlstack/mailer .
docker tag mlstack/mailer:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/mlstack/mailer:latest
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/mlstack/mailer:latest
```

---

## 🚀 Step 8: ECS Fargate Setup (Compute Services & Ephemeral Tasks)

This is where the magic happens. We will set up the runtime configurations.

### 1. Create a Cluster
1. Search for **Elastic Container Service (ECS)**.
2. Click **Clusters** in the sidebar, and click **Create cluster**.
3. Name it `mlstack-prod`, leave the infrastructure as **AWS Fargate (serverless)**, and click **Create**.

### 2. Define the Ephemeral Task Definition
1. Click **Task definitions** in the left sidebar, and click **Create new task definition** $\rightarrow$ **Create new task definition with JSON**.
2. Paste the JSON below, replacing `<ACCOUNT_ID>` with your AWS Account ID:

```json
{
  "family": "mlstack-training-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "4096",
  "executionRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/mlstackTaskRole",
  "containerDefinitions": [
    {
      "name": "mlstack-training-runner",
      "image": "<ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/mlstack/backend:latest",
      "essential": true,
      "secrets": [
        { "name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:ap-south-1:<ACCOUNT_ID>:secret:mlstack/prod/env:DATABASE_URL::" },
        { "name": "REDIS_URL", "valueFrom": "arn:aws:secretsmanager:ap-south-1:<ACCOUNT_ID>:secret:mlstack/prod/env:REDIS_URL::" },
        { "name": "SECRET_KEY", "valueFrom": "arn:aws:secretsmanager:ap-south-1:<ACCOUNT_ID>:secret:mlstack/prod/env:SECRET_KEY::" },
        { "name": "GEMINI_API_KEY", "valueFrom": "arn:aws:secretsmanager:ap-south-1:<ACCOUNT_ID>:secret:mlstack/prod/env:GEMINI_API_KEY::" }
      ],
      "environment": [
        { "name": "FLASK_ENV", "value": "production" },
        { "name": "S3_DATASETS_BUCKET", "value": "mlstack-storage-prod-<your-unique-suffix>" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/mlstack-training",
          "awslogs-region": "ap-south-1",
          "awslogs-stream-prefix": "training",
          "awslogs-create-group": "true"
        }
      }
    }
  ]
}
```
3. Click **Create**.

---

## 🚦 Step 9: Application Load Balancer (Routing Traffic)

The Load Balancer acts as the traffic controller, sending web dashboard requests to the frontend and API queries to the correct ECS Fargate tasks.

1. Search for **EC2** and click the service.
2. In the left sidebar, scroll down to **Load Balancing** and click **Load Balancers**.
3. Click **Create Load Balancer** and select **Application Load Balancer**.
4. Configure:
    *   **Load balancer name**: `mlstack-alb`
    *   **Scheme**: **Internet-facing**
    *   **VPC**: Select `mlstack-network-vpc`.
    *   **Mappings**: Select all 2 Availability Zones and choose the **Public subnets**.
    *   **Security Groups**: Choose the `sg-alb` group (allows port 80 and 443 incoming).
5. Under **Listeners and routing**:
    *   Create a Target Group named `tg-backend` pointing to port `5000` (IP type).
    *   Create a Target Group named `tg-streamlit` pointing to port `8501` (IP type).
6. Click **Create load balancer**.

---

## 🌐 Step 10: Hosting Frontend (S3 + CloudFront CDN)

We will publish the React code static files so they load globally at lightning speed.

### 1. Build React
In your local terminal, run:
```bash
cd frontend
# Install dependencies
npm install
# Compile frontend for AWS production URL
VITE_API_URL=https://<YOUR_ALB_DOMAIN>/api npm run build
```

### 2. Upload to S3
1. Search for **S3** and create a new bucket named `mlstack-frontend-prod-<your-unique-suffix>`.
2. Keep **Block all public access** enabled.
3. Upload all files from your local `frontend/dist/` folder directly into this bucket.

### 3. Distribute globally with CloudFront
1. Search for **CloudFront** and click **Create distribution**.
2. Select your S3 bucket as the **Origin domain**.
3. Create an **Origin Access Control (OAC)** and attach it to the origin.
4. Update the S3 bucket policy with the OAC statement provided by CloudFront.
5. Under **Viewer Protocol Policy**, select **Redirect HTTP to HTTPS**.
6. Click **Create distribution**.

---

## 🎉 Deploy Complete!
Once the CloudFront distribution is deployed, you will be given a `.cloudfront.net` domain name. Open this in your browser:

**Congratulations! Your highly isolated, serverless, automated ML engine is officially live on AWS! 🚀**
