# ===========================================
# DEPENDENCIES STAGE - Install all deps
# ===========================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only package files for better caching
COPY package*.json ./

# Install ALL dependencies (needed for build)
# Configure npm for better network resilience
RUN npm config set fetch-timeout 600000 && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 60000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm i --legacy-peer-deps
# ===========================================
# BUILD STAGE - Build the application
# ===========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files needed for build
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY libs ./libs
COPY eslint.config.mjs ./
COPY apps/cinema-service ./apps/cinema-service

# Generate Prisma Client for cinema-service
WORKDIR /app/apps/cinema-service
RUN npx --yes prisma@6.16.2 generate

# Build the cinema-service using Nx
WORKDIR /app
RUN npx nx build cinema-service --prod

# ===========================================
# PRODUCTION STAGE - Minimal runtime image
# ===========================================
FROM node:20-alpine AS production

# Install openssl for Prisma, wget for healthcheck, dumb-init for signal handling
RUN apk add --no-cache openssl wget dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copy the Nx-generated package.json (minimal production dependencies only)
COPY --chown=nestjs:nodejs --from=builder /app/dist/apps/cinema-service/package*.json ./

# Install ONLY minimal production dependencies
RUN npm ci --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Copy ONLY the built application and Prisma files
COPY --chown=nestjs:nodejs --from=builder /app/dist/apps/cinema-service ./
COPY --chown=nestjs:nodejs --from=builder /app/apps/cinema-service/generated ./generated
COPY --chown=nestjs:nodejs --from=builder /app/apps/cinema-service/prisma ./prisma

USER nestjs

# Health check (verify actual service health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3003/health || exit 1

# Expose TCP port (configured via environment)
EXPOSE 3003

# Start the application with dumb-init for proper signal handling
CMD ["dumb-init", "node", "main.js"]
