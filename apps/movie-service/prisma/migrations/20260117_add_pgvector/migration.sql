-- Migration: Add pgvector extension and movie_embeddings table
-- This migration must be run before Prisma migrations

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create movie_embeddings table with vector column
CREATE TABLE IF NOT EXISTS movie_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID NOT NULL UNIQUE REFERENCES movies(id) ON DELETE CASCADE,
    embedding vector(768), -- Gemini embedding-001 uses 768 dimensions
    model VARCHAR(50) DEFAULT 'gemini-embedding-001',
    text_hash VARCHAR(32), -- MD5 hash for change detection
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for efficient similarity search using HNSW
CREATE INDEX IF NOT EXISTS idx_movie_embeddings_embedding 
ON movie_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Create index on movie_id for joins
CREATE INDEX IF NOT EXISTS idx_movie_embeddings_movie_id 
ON movie_embeddings(movie_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_movie_embeddings_updated_at ON movie_embeddings;
CREATE TRIGGER update_movie_embeddings_updated_at
    BEFORE UPDATE ON movie_embeddings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
