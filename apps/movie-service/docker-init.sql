-- Init script for postgres-movie database
-- This runs automatically when the container starts with an empty data volume

-- Enable pgvector extension (required for movie recommendations/embeddings)
CREATE EXTENSION IF NOT EXISTS vector;
