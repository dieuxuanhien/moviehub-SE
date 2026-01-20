# ===========================================
# MovieHub Environment Setup Script
# Creates .env and .env.db files for Docker
# ===========================================
# Usage: .\setup-env.ps1 [-Mode docker|local] [-SkipSecrets]
# Example: .\setup-env.ps1 -Mode docker

param(
    [ValidateSet("docker", "local")]
    [string]$Mode = "docker",
    [switch]$SkipSecrets
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   MovieHub Environment Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Mode: $Mode" -ForegroundColor Yellow
Write-Host ""

# ===========================================
# Configuration based on mode
# ===========================================
if ($Mode -eq "docker") {
    $config = @{
        # Database hosts (Docker service names)
        POSTGRES_USER_HOST = "postgres-user"
        POSTGRES_MOVIE_HOST = "postgres-movie"
        POSTGRES_CINEMA_HOST = "postgres-cinema"
        POSTGRES_BOOKING_HOST = "postgres-booking"
        POSTGRES_PORT = "5432"
        
        # Service hosts (Docker service names)
        USER_HOST = "user-service"
        MOVIE_HOST = "movie-service"
        CINEMA_HOST = "cinema-service"
        BOOKING_HOST = "booking-service"
        API_GATEWAY_HOST = "api-gateway"
        
        # Service ports (internal Docker ports)
        USER_PORT = "3001"
        MOVIE_PORT = "3002"
        CINEMA_PORT = "3003"
        BOOKING_PORT = "3004"
        API_GATEWAY_PORT = "3000"
        
        # Redis
        REDIS_HOST = "redis"
        REDIS_PORT = "6379"
        REDIS_URL = "redis://redis:6379"
    }
} else {
    $config = @{
        # Database hosts (localhost with external ports)
        POSTGRES_USER_HOST = "localhost"
        POSTGRES_MOVIE_HOST = "localhost"
        POSTGRES_CINEMA_HOST = "localhost"
        POSTGRES_BOOKING_HOST = "localhost"
        POSTGRES_USER_PORT = "5435"
        POSTGRES_MOVIE_PORT = "5436"
        POSTGRES_CINEMA_PORT = "5437"
        POSTGRES_BOOKING_PORT = "5438"
        
        # Service hosts (localhost)
        USER_HOST = "localhost"
        MOVIE_HOST = "localhost"
        CINEMA_HOST = "localhost"
        BOOKING_HOST = "localhost"
        
        # Service ports (external ports)
        USER_PORT = "4001"
        MOVIE_PORT = "4002"
        CINEMA_PORT = "4003"
        BOOKING_PORT = "4004"
        API_GATEWAY_PORT = "3000"
        
        # Redis
        REDIS_HOST = "localhost"
        REDIS_PORT = "6379"
        REDIS_URL = "redis://localhost:6379"
    }
}

# ===========================================
# Prompt for secrets
# ===========================================
$clerkSecretKey = ""
$vnpayTmnCode = ""
$vnpayHashSecret = ""

if (-not $SkipSecrets) {
    Write-Host "`n[Required] Enter your Clerk Secret Key" -ForegroundColor Yellow
    Write-Host "(Get from https://dashboard.clerk.com -> API Keys)" -ForegroundColor Gray
    $clerkSecretKey = Read-Host "CLERK_SECRET_KEY (sk_test_...)"
    
    Write-Host "`n[Optional] VNPay Configuration (press Enter to skip)" -ForegroundColor Yellow
    $vnpayTmnCode = Read-Host "VNPAY_TMN_CODE"
    if ($vnpayTmnCode) {
        $vnpayHashSecret = Read-Host "VNPAY_HASH_SECRET"
    }
}

# ===========================================
# Create .env.db files (same for both modes)
# ===========================================
$envDbFiles = @{
    "apps/user-service/.env.db" = @"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=movie_hub_user
"@
    "apps/movie-service/.env.db" = @"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=movie_hub_movie
"@
    "apps/cinema-service/.env.db" = @"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=movie_hub_cinema
"@
    "apps/booking-service/.env.db" = @"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=movie_hub_booking
"@
}

Write-Host "`n[1/3] Creating .env.db files..." -ForegroundColor Green
foreach ($file in $envDbFiles.Keys) {
    $fullPath = Join-Path $ScriptDir $file
    $envDbFiles[$file] | Out-File -FilePath $fullPath -Encoding utf8 -NoNewline
    Write-Host "  Created: $file" -ForegroundColor Gray
}

# ===========================================
# Create service .env files
# ===========================================
Write-Host "`n[2/3] Creating service .env files..." -ForegroundColor Green

# API Gateway
$apiGatewayEnv = @"
# API Gateway Configuration
# Mode: $Mode
CLERK_SECRET_KEY=$clerkSecretKey
PORT=$($config.API_GATEWAY_PORT)

# 🔓 DEV MODE: Set to 'true' to bypass Clerk auth (faster development)
SKIP_AUTH=true
DEV_USER_ID=dev-admin-user

# Microservice connections
USER_HOST=$($config.USER_HOST)
USER_PORT=$($config.USER_PORT)

MOVIE_HOST=$($config.MOVIE_HOST)
MOVIE_PORT=$($config.MOVIE_PORT)

CINEMA_HOST=$($config.CINEMA_HOST)
CINEMA_PORT=$($config.CINEMA_PORT)

BOOKING_HOST=$($config.BOOKING_HOST)
BOOKING_PORT=$($config.BOOKING_PORT)

# Redis
REDIS_HOST=$($config.REDIS_HOST)
REDIS_PORT=$($config.REDIS_PORT)
REDIS_URL=$($config.REDIS_URL)

NODE_ENV=development
"@
$apiGatewayEnv | Out-File -FilePath (Join-Path $ScriptDir "apps/api-gateway/.env") -Encoding utf8 -NoNewline
Write-Host "  Created: apps/api-gateway/.env" -ForegroundColor Gray

# User Service
if ($Mode -eq "docker") {
    $userDbUrl = "postgresql://postgres:postgres@$($config.POSTGRES_USER_HOST):$($config.POSTGRES_PORT)/movie_hub_user?schema=public"
} else {
    $userDbUrl = "postgresql://postgres:postgres@$($config.POSTGRES_USER_HOST):$($config.POSTGRES_USER_PORT)/movie_hub_user?schema=public"
}
$userServiceEnv = @"
# User Service Configuration
# Mode: $Mode
CLERK_SECRET_KEY=$clerkSecretKey

TCP_HOST=0.0.0.0
TCP_PORT=$($config.USER_PORT)

DATABASE_URL="$userDbUrl"

NODE_ENV=development
LOG_LEVEL=debug
"@
$userServiceEnv | Out-File -FilePath (Join-Path $ScriptDir "apps/user-service/.env") -Encoding utf8 -NoNewline
Write-Host "  Created: apps/user-service/.env" -ForegroundColor Gray

# Movie Service
if ($Mode -eq "docker") {
    $movieDbUrl = "postgresql://postgres:postgres@$($config.POSTGRES_MOVIE_HOST):$($config.POSTGRES_PORT)/movie_hub_movie?schema=public"
} else {
    $movieDbUrl = "postgresql://postgres:postgres@$($config.POSTGRES_MOVIE_HOST):$($config.POSTGRES_MOVIE_PORT)/movie_hub_movie?schema=public"
}
$movieServiceEnv = @"
# Movie Service Configuration
# Mode: $Mode
TCP_HOST=0.0.0.0
TCP_PORT=$($config.MOVIE_PORT)

DATABASE_URL="$movieDbUrl"

NODE_ENV=development
LOG_LEVEL=debug
"@
$movieServiceEnv | Out-File -FilePath (Join-Path $ScriptDir "apps/movie-service/.env") -Encoding utf8 -NoNewline
Write-Host "  Created: apps/movie-service/.env" -ForegroundColor Gray

# Cinema Service
if ($Mode -eq "docker") {
    $cinemaDbUrl = "postgresql://postgres:postgres@$($config.POSTGRES_CINEMA_HOST):$($config.POSTGRES_PORT)/movie_hub_cinema?schema=public"
} else {
    $cinemaDbUrl = "postgresql://postgres:postgres@$($config.POSTGRES_CINEMA_HOST):$($config.POSTGRES_CINEMA_PORT)/movie_hub_cinema?schema=public"
}
$cinemaServiceEnv = @"
# Cinema Service Configuration
# Mode: $Mode
TCP_HOST=0.0.0.0
TCP_PORT=$($config.CINEMA_PORT)

DATABASE_URL="$cinemaDbUrl"

MOVIE_HOST=$($config.MOVIE_HOST)
MOVIE_PORT=$($config.MOVIE_PORT)

REDIS_HOST=$($config.REDIS_HOST)
REDIS_PORT=$($config.REDIS_PORT)
REDIS_URL=$($config.REDIS_URL)

NODE_ENV=development
LOG_LEVEL=debug
"@
$cinemaServiceEnv | Out-File -FilePath (Join-Path $ScriptDir "apps/cinema-service/.env") -Encoding utf8 -NoNewline
Write-Host "  Created: apps/cinema-service/.env" -ForegroundColor Gray

# Booking Service
if ($Mode -eq "docker") {
    $bookingDbUrl = "postgresql://postgres:postgres@$($config.POSTGRES_BOOKING_HOST):$($config.POSTGRES_PORT)/movie_hub_booking?schema=public"
} else {
    $bookingDbUrl = "postgresql://postgres:postgres@$($config.POSTGRES_BOOKING_HOST):$($config.POSTGRES_BOOKING_PORT)/movie_hub_booking?schema=public"
}
$bookingServiceEnv = @"
# Booking Service Configuration
# Mode: $Mode
TCP_HOST=0.0.0.0
TCP_PORT=$($config.BOOKING_PORT)

DATABASE_URL="$bookingDbUrl"

CINEMA_HOST=$($config.CINEMA_HOST)
CINEMA_PORT=$($config.CINEMA_PORT)

USER_HOST=$($config.USER_HOST)
USER_PORT=$($config.USER_PORT)

REDIS_HOST=$($config.REDIS_HOST)
REDIS_PORT=$($config.REDIS_PORT)
REDIS_URL=$($config.REDIS_URL)

# Email (disabled by default)
EMAIL_ENABLED=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# VNPay
VNPAY_TMN_CODE=$vnpayTmnCode
VNPAY_HASH_SECRET=$vnpayHashSecret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:4200/payment/callback

NODE_ENV=development
LOG_LEVEL=debug
"@
$bookingServiceEnv | Out-File -FilePath (Join-Path $ScriptDir "apps/booking-service/.env") -Encoding utf8 -NoNewline
Write-Host "  Created: apps/booking-service/.env" -ForegroundColor Gray

# Web Frontend
if ($Mode -eq "docker") {
    $apiUrl = "http://localhost:4000"
    $wsUrl = "ws://localhost:4000"
} else {
    $apiUrl = "http://localhost:3000"
    $wsUrl = "ws://localhost:3000"
}
$webEnv = @"
# Web Frontend Configuration
# Mode: $Mode
NODE_ENV=development
PORT=4200

NEXT_PUBLIC_API_URL=$apiUrl
NEXT_PUBLIC_WEBSOCKET_URL=$wsUrl
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
"@
$webEnv | Out-File -FilePath (Join-Path $ScriptDir "apps/web/.env") -Encoding utf8 -NoNewline
Write-Host "  Created: apps/web/.env" -ForegroundColor Gray

# ===========================================
# Summary
# ===========================================
Write-Host "`n[3/3] Validation..." -ForegroundColor Green

$createdFiles = @(
    "apps/api-gateway/.env",
    "apps/user-service/.env",
    "apps/user-service/.env.db",
    "apps/movie-service/.env",
    "apps/movie-service/.env.db",
    "apps/cinema-service/.env",
    "apps/cinema-service/.env.db",
    "apps/booking-service/.env",
    "apps/booking-service/.env.db",
    "apps/web/.env"
)

$allExist = $true
foreach ($file in $createdFiles) {
    $fullPath = Join-Path $ScriptDir $file
    if (Test-Path $fullPath) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $allExist = $false
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
if ($allExist) {
    Write-Host "  Setup Complete!" -ForegroundColor Green
} else {
    Write-Host "  Setup completed with errors" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
if ($Mode -eq "docker") {
    Write-Host "  1. Run: docker compose up -d" -ForegroundColor White
    Write-Host "  2. Access frontend at: http://localhost:5200" -ForegroundColor White
    Write-Host "  3. Access API docs at: http://localhost:4000/docs" -ForegroundColor White
} else {
    Write-Host "  1. Run: npm run docker:up:infra" -ForegroundColor White
    Write-Host "  2. Run: npm run dev:all" -ForegroundColor White
    Write-Host "  3. Run: npm run dev:web (in new terminal)" -ForegroundColor White
    Write-Host "  4. Access frontend at: http://localhost:4200" -ForegroundColor White
}

if (-not $clerkSecretKey) {
    Write-Host "`n[WARNING] CLERK_SECRET_KEY not set - auth will not work!" -ForegroundColor Yellow
    Write-Host "  Edit the .env files or re-run: .\setup-env.ps1 -Mode $Mode" -ForegroundColor Yellow
}

Write-Host ""
