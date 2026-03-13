<div align="center">

# ⚔️ PIXELISM
### *Realm of Pixels*

**A curated pixel art gallery where you discover, collect and integrate sprites seamlessly into your games.**

Built for creators. Designed for enthusiasts.

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)](https://aws.amazon.com/ec2/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)

---

## 🌍 Overview

**Pixelism** is a full-stack pixel art marketplace platform that allows game developers and pixel art enthusiasts to:

- 🖼️ **Browse & discover** thousands of hand-crafted pixel sprites
- 📦 **Collect sprites** individually or bundle them into Asset Packs
- 🤖 **Auto-validated uploads** — an ML model ensures only real pixel art enters the realm
- 🔐 **Secure authentication** via email/password or OAuth2 (Google & GitHub)
- ⚡ **Real-time notifications** via Server-Sent Events (SSE)

> *"Venture through thousands of hand-crafted pixel relics. Claim them individually or pledge allegiance for boundless access."*

---

## 🏗️ Architecture

```
pixel-art-shop-pixelism/
├── client-shop/       # Next.js 15 — Frontend (App Router)
├── shop/              # Spring Boot — REST API Backend
├── ml-service/        # FastAPI + PyTorch — Pixel Art Classifier
└── scripts/           # AWS EC2 & Nginx setup scripts
```

The three services communicate as follows:

```
[Browser] ──► [Next.js Client] ──► [Spring Boot API]
                                         │
                              ┌──────────┴──────────┐
                         [PostgreSQL]         [ML Service]
                         [Redis]              (pixel art validation)
                         [Cloudinary]
                         [Supabase Storage]
```

---

## ✨ Features

### 🔐 Authentication & Identity
- **Email/Password** registration with OTP email verification
- **OAuth2** login via Google and GitHub
- **JWT** access tokens + **Refresh Token** rotation (stored in HttpOnly cookies)
- Password reset flow with OTP via email
- Multi-provider account linking per user

### 🖼️ Sprite Management (Sanctum)
- Upload sprites with drag-and-drop
- **ML-powered validation** — only pixel art images are accepted (PyTorch classifier)
- **SSE real-time feedback** — upload status pushed live to the client
- Browse, filter and search sprites by category
- Soft-delete with scheduled cleanup (`SpriteCleanupScheduler`)
- Preview sprites before downloading
- Cloudinary CDN for optimized image delivery

### 📂 Categories
- Sprites organized by categories
- Admin-managed category system

### ⚡ Real-Time (SSE)
- Server-Sent Events for live upload processing feedback
- No polling — push-based updates from backend to client

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Spring Boot 3, Java, Spring Security, Spring Data JPA |
| **ML Service** | FastAPI, PyTorch, Python |
| **Database** | PostgreSQL (Supabase) |
| **Cache** | Redis (OTP storage, session caching) |
| **Storage** | Cloudinary (image CDN) |
| **Auth** | JWT, OAuth2 (Google, GitHub) |
| **Email** | SMTP with custom HTML template engine |
| **Infrastructure** | Docker, Docker Compose, AWS EC2, Nginx |

---

## 📁 Project Structure

<details>
<summary><strong>client-shop/</strong> — Next.js Frontend</summary>

```
client-shop/
├── app/
│   ├── (protected)/         # Auth-guarded pages
│   │   ├── kingdom/         # Homepage — hero, featured sprites
│   │   ├── bazaar/          # Asset pack marketplace
│   │   ├── sanctum/         # Sprite gallery & management
│   │   ├── chronicle/       # Purchase/download history
│   │   └── grimoire/        # Documentation / guides
│   └── api/
│       └── v1/sse/connect/  # SSE proxy endpoint
├── features/
│   ├── auth/                # Login, register, reset password
│   ├── sprite/              # Sprite browsing, upload, modals
│   ├── assetpack/           # Asset pack logic
│   ├── category/            # Category filters
│   └── user/                # User profile
└── shared/
    ├── components/          # Navbar, footer, pagination, UI
    ├── hooks/               # useDebounced, useNotification, usePagination
    └── lib/                 # Axios, Cloudinary loader, runtime config
```
</details>

<details>
<summary><strong>shop/</strong> — Spring Boot Backend</summary>

```
shop/src/main/java/pixelart/shop/
├── features/
│   ├── auth/                # JWT auth, OTP, login, register
│   ├── oauth2/              # Google & GitHub OAuth2 handlers
│   ├── sprite/              # Sprite CRUD, events, cleanup scheduler
│   ├── assetpack/           # Asset pack management
│   ├── category/            # Category management
│   └── user/                # User entity, refresh tokens
└── shared/
    ├── config/              # Security, CORS, Redis, Cloudinary, JWT filter
    ├── infrastructure/
    │   ├── email/           # HTML email templates + SMTP sender
    │   ├── storage/         # Cloudinary file storage
    │   └── cache/           # Redis OTP store
    └── sse/                 # Server-Sent Events service
```
</details>

<details>
<summary><strong>ml-service/</strong> — FastAPI ML Classifier</summary>

```
ml-service/
├── app/
│   ├── main.py              # FastAPI app & prediction endpoint
│   ├── model.py             # PyTorch model loader & inference
│   └── schemas.py           # Request/response schemas
└── best_model.pth           # Trained model weights (16MB)
```

The ML service exposes a single endpoint that accepts an image and returns whether it is pixel art or not. The Spring Boot backend calls this service asynchronously during sprite upload.
</details>

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js 22+](https://nodejs.org/) (for local frontend dev)
- [Java 17+](https://adoptium.net/) (for local backend dev)
- [Python 3.10+](https://www.python.org/) (for local ML dev)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pixel-art-shop-pixelism.git
cd pixel-art-shop-pixelism
```

### 2. Configure environment variables

```bash
cp env.example .env
# Edit .env with your credentials (see Environment Variables section)
```

### 3. Run with Docker Compose

```bash
docker compose up --build
```

This starts all three services:

| Service | URL |
|---|---|
| Next.js Frontend | `http://localhost:3000` |
| Spring Boot API | `http://localhost:8080` |
| ML Service | `http://localhost:8000` |

> 🌐 **Live:** [https://pixelism.duckdns.org](https://pixelism.duckdns.org)

### 4. (Optional) Run services individually

**Frontend:**
```bash
cd client-shop
npm install
npm run dev
```

**Backend:**
```bash
cd shop
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**ML Service:**
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 🔑 Environment Variables

Copy `env.example` to `.env` and fill in the values:

```env
# Database (Supabase PostgreSQL)
DB_URL=jdbc:postgresql://<host>:<port>/<database>
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# ML Service
ML_SERVICE_URL=http://ml-service:8000

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## ☁️ Deployment

The project is deployed on **AWS EC2** using Docker and Nginx as a reverse proxy.

Setup scripts are provided in the `scripts/` directory:

```bash
# 1. Initial EC2 server setup (Docker, dependencies)
bash scripts/ec2-setup.sh

# 2. Configure Nginx reverse proxy
bash scripts/nginx-set-up.sh

# 3. Create database indexes
psql -f scripts/create_index.sql
```

**Production architecture:**

```
Internet
   │
[Nginx] ← SSL termination, reverse proxy
   ├──► :3000  Next.js Frontend
   ├──► :8080  Spring Boot API
   └──► :8000  ML Service (internal only)
```

---

## 📜 License

This project is licensed under the terms found in the [LICENSE](./LICENSE) file.

---

<div align="center">

*Forged with ⚔️ for pixel art adventurers*

</div>
