# MovieHub Deployment Guide

This guide explains how to deploy MovieHub using pre-built Docker images from Docker Hub.

## Quick Start

### 1. Create a `docker-compose.prod.yml` file:

```yaml
version: '3.8'

services:
  # ==================== DATABASES ====================
  postgres-movie:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: movie_hub_movie
    volumes:
      - postgres_movie_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  postgres-user:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: movie_hub_user
    volumes:
      - postgres_user_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  postgres-booking:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: movie_hub_booking
    volumes:
      - postgres_booking_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  postgres-cinema:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: movie_hub_cinema
    volumes:
      - postgres_cinema_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  # ==================== BACKEND SERVICES ====================
  movie-service:
    image: ngoctruonggiang/moviehub-movie-service:latest
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres-movie:5432/movie_hub_movie
      - TCP_HOST=0.0.0.0
      - TCP_PORT=3002
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      postgres-movie:
        condition: service_healthy

  user-service:
    image: ngoctruonggiang/moviehub-user-service:latest
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres-user:5432/movie_hub_user
      - TCP_HOST=0.0.0.0
      - TCP_PORT=3001
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    depends_on:
      postgres-user:
        condition: service_healthy

  booking-service:
    image: ngoctruonggiang/moviehub-booking-service:latest
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres-booking:5432/movie_hub_booking
      - TCP_HOST=0.0.0.0
      - TCP_PORT=3003
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - CINEMA_HOST=cinema-service
      - CINEMA_PORT=3004
      - USER_HOST=user-service
      - USER_PORT=3001
    depends_on:
      postgres-booking:
        condition: service_healthy
      redis:
        condition: service_started

  cinema-service:
    image: ngoctruonggiang/moviehub-cinema-service:latest
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres-cinema:5432/movie_hub_cinema
      - TCP_HOST=0.0.0.0
      - TCP_PORT=3004
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      postgres-cinema:
        condition: service_healthy
      redis:
        condition: service_started

  # ==================== API GATEWAY ====================
  api-gateway:
    image: ngoctruonggiang/moviehub-api-gateway:latest
    ports:
      - "4000:3000"
    environment:
      - MOVIE_HOST=movie-service
      - MOVIE_PORT=3002
      - USER_HOST=user-service
      - USER_PORT=3001
      - BOOKING_HOST=booking-service
      - BOOKING_PORT=3003
      - CINEMA_HOST=cinema-service
      - CINEMA_PORT=3004
      - CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    depends_on:
      - movie-service
      - user-service
      - booking-service
      - cinema-service

  # ==================== FRONTEND ====================
  web:
    image: ngoctruonggiang/moviehub-web:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api-gateway:3000/api/v1
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
    depends_on:
      - api-gateway

volumes:
  postgres_movie_data:
  postgres_user_data:
  postgres_booking_data:
  postgres_cinema_data:
  redis_data:
```

### 2. Create a `.env` file:

```env
# Clerk Authentication (get from https://clerk.com)
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Gemini API (get from https://aistudio.google.com)
GEMINI_API_KEY=AIzaSy...
```

### 3. Pull and Run:

```bash
# Pull all images
docker compose -f docker-compose.prod.yml pull

# Start all services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker compose -f docker-compose.prod.yml ps
```

### 4. Access the Application:

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:4000/api/v1

## Docker Hub Images

| Service | Image |
|---------|-------|
| API Gateway | `ngoctruonggiang/moviehub-api-gateway:latest` |
| Movie Service | `ngoctruonggiang/moviehub-movie-service:latest` |
| Booking Service | `ngoctruonggiang/moviehub-booking-service:latest` |
| Cinema Service | `ngoctruonggiang/moviehub-cinema-service:latest` |
| User Service | `ngoctruonggiang/moviehub-user-service:latest` |
| Web Frontend | `ngoctruonggiang/moviehub-web:latest` |

## Notes

1. **Database Migrations**: The databases will be empty. You'll need to run Prisma migrations for each service.
2. **Seed Data**: After migrations, seed data can be imported from the project's SQL files.
3. **Environment Variables**: Make sure to set all required environment variables in the `.env` file.
