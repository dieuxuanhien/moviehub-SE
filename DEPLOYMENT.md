# MovieHub Deployment Guide

This guide explains how to deploy MovieHub using pre-built Docker images from Docker Hub.

## Prerequisites

- Docker and Docker Compose installed
- Clone the repository (for `.env` files and database init scripts)

## Quick Start

### 1. Clone the repository:
```bash
git clone https://github.com/your-org/moviehub-SE.git
cd moviehub-SE
```

### 2. Set up environment files:
Copy the example `.env` files for each service:
```bash
# Database env files
cp apps/user-service/.env.db.example apps/user-service/.env.db
cp apps/movie-service/.env.db.example apps/movie-service/.env.db
cp apps/cinema-service/.env.db.example apps/cinema-service/.env.db
cp apps/booking-service/.env.db.example apps/booking-service/.env.db

# Service env files
cp apps/user-service/.env.example apps/user-service/.env
cp apps/movie-service/.env.example apps/movie-service/.env
cp apps/cinema-service/.env.example apps/cinema-service/.env
cp apps/booking-service/.env.example apps/booking-service/.env
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/web/.env.example apps/web/.env
```

### 3. Configure required API keys:
Edit the `.env` files with your credentials:
- **Clerk** (apps/api-gateway/.env, apps/web/.env): Get from https://clerk.com
- **Gemini API** (apps/movie-service/.env): Get from https://aistudio.google.com

### 4. Pull images and start:
```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

### 5. Access the application:
- **Frontend**: http://localhost:5200
- **API Gateway**: http://localhost:4000/api/v1

## Docker Hub Images

| Service | Image | Port |
|---------|-------|------|
| API Gateway | `ngoctruonggiang/moviehub-api-gateway:latest` | 4000 |
| Movie Service | `ngoctruonggiang/moviehub-movie-service:latest` | 4002 |
| Booking Service | `ngoctruonggiang/moviehub-booking-service:latest` | 4004 |
| Cinema Service | `ngoctruonggiang/moviehub-cinema-service:latest` | 4003 |
| User Service | `ngoctruonggiang/moviehub-user-service:latest` | 4001 |
| Web Frontend | `ngoctruonggiang/moviehub-web:latest` | 5200 |

## Pull All Images

```bash
docker pull ngoctruonggiang/moviehub-api-gateway:latest
docker pull ngoctruonggiang/moviehub-movie-service:latest
docker pull ngoctruonggiang/moviehub-booking-service:latest
docker pull ngoctruonggiang/moviehub-cinema-service:latest
docker pull ngoctruonggiang/moviehub-user-service:latest
docker pull ngoctruonggiang/moviehub-web:latest
```

## Useful Commands

```bash
# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop all services
docker compose -f docker-compose.prod.yml down

# Restart a specific service
docker compose -f docker-compose.prod.yml restart movie-service

# View running containers
docker compose -f docker-compose.prod.yml ps
```

## Environment Files Structure

```
apps/
├── api-gateway/.env          # API Gateway config (Clerk, service hosts)
├── booking-service/
│   ├── .env                  # Booking service config
│   └── .env.db               # Booking database credentials
├── cinema-service/
│   ├── .env                  # Cinema service config
│   └── .env.db               # Cinema database credentials
├── movie-service/
│   ├── .env                  # Movie service config (Gemini API key)
│   └── .env.db               # Movie database credentials
├── user-service/
│   ├── .env                  # User service config (Clerk)
│   └── .env.db               # User database credentials
└── web/.env                  # Frontend config (Clerk public key)
```
