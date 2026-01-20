import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from '../embedding/embedding.service';

// Public API response type
export interface SimilarMovie {
  id: string;
  title: string;
  posterUrl: string;
  similarity: number;
}

// Internal: Raw result from SQL before hybrid scoring
interface RawMovieCandidate {
  id: string;
  title: string;
  posterUrl: string;
  genreIds: string[];
  embeddingSimilarity: number;  // Raw cosine similarity from SQL
  avgRating: number;
  reviewCount: number;
  releaseDate: Date;
}

// Internal: After hybrid scoring adds similarity
interface ScoredMovieCandidate extends RawMovieCandidate {
  similarity: number;  // Calculated by applyHybridScoring()
}

export interface RecommendationResult {
  movies: SimilarMovie[];
  total: number;
  hasMore: boolean;
}

// V1 Diversity configuration
const DIVERSITY_CONFIG = {
  // Lambda: 0 = pure diversity, 1 = pure similarity. 0.7 balances both
  lambda: 0.7,
  // Fetch more candidates than needed for reranking
  candidateMultiplier: 3,
};

// Weights for query-based recommendations (homepage)
const HYBRID_WEIGHTS = {
  embeddingSimilarity: 0.70,  // Semantic relevance - main signal for queries
  rating: 0.20,               // Quality signal
  recency: 0.10,              // Boost newer releases
};

// Weights for similar movies (movie detail page) - research-backed
const SIMILARITY_WEIGHTS = {
  genreMatch: 0.40,           // 40% - Research says metadata > embeddings for "similar"
  embeddingSimilarity: 0.35,  // 35% - Reduced from 70%
  rating: 0.15,               // 15% - Quality signal
  recency: 0.10,              // 10% - Freshness
};

// New release boost for business promotion
const NEW_RELEASE_BOOST = {
  enabled: true,
  days: 30,        // Movies released within last 30 days
  boost: 0.10,     // +10% score boost
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Genre keyword mappings (Vietnamese + English)
// Keys must match EXACTLY with database genre names
const GENRE_KEYWORDS = {
  'Hành động': ['hành động', 'action', 'chiến đấu', 'fight', 'rượt đuổi', 'chase'],
  'Hài': ['hài', 'hài hước', 'comedy', 'vui', 'funny'],
  'Kinh dị': ['kinh dị', 'horror', 'ma', 'ghost', 'sợ hãi', 'scary'],
  'Lãng mạn': ['tình cảm', 'romance', 'lãng mạn', 'romantic', 'yêu', 'love'],
  'Khoa học viễn tưởng': ['khoa học viễn tưởng', 'sci-fi', 'science fiction', 'viễn tưởng'],
  'Chính kịch': ['chính kịch', 'drama'],
  'Phiêu lưu': ['phiêu lưu', 'adventure'],
  'Giật gân': ['giật gân', 'thriller', 'hồi hộp'],
  'Hoạt hình': ['hoạt hình', 'animation', 'anime', 'cartoon'],
};

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  /**
   * Validate UUID format for defense-in-depth
   * Note: Prisma's $queryRaw with tagged templates is already parameterized,
   * but we add validation as an extra layer of security
   */
  private validateUUID(id: string, fieldName = 'id'): void {
    if (!UUID_REGEX.test(id)) {
      throw new BadRequestException(`Invalid ${fieldName} format`);
    }
  }

  /**
   * Get similar movies based on embedding similarity
   */
  async getSimilarMovies(
    movieId: string,
    limit = 20,
    offset = 0,
  ): Promise<RecommendationResult> {
    // Validate input - defense in depth (Prisma already parameterizes)
    this.validateUUID(movieId, 'movieId');

    // Fetch source movie with genres for similarity boosting
    const sourceMovie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        movieGenres: {
          select: { genreId: true }
        }
      }
    });

    if (!sourceMovie) {
      throw new BadRequestException('Source movie not found');
    }

    const sourceGenreIds = sourceMovie.movieGenres.map(mg => mg.genreId);

    // Check if source movie has embedding
    let sourceEmbedding = await this.prisma.movieEmbedding.findUnique({
      where: { movieId },
    });

    // If no embedding exists, try to generate on-demand (< 3s acceptable per plan)
    if (!sourceEmbedding) {
      this.logger.log(`No embedding found for movie ${movieId}, generating on-demand...`);
      
      try {
        const generated = await this.generateAndStoreEmbedding(movieId);
        if (generated) {
          // Re-fetch the embedding after generation
          sourceEmbedding = await this.prisma.movieEmbedding.findUnique({
            where: { movieId },
          });
        }
      } catch (error) {
        this.logger.warn(`Failed to generate embedding on-demand: ${error.message}`);
      }

      // If still no embedding after generation attempt, use fallback
      if (!sourceEmbedding) {
        this.logger.warn(`Could not generate embedding for movie ${movieId}, using fallback`);
        return this.getFallbackRecommendations(movieId, limit, offset);
      }
    }

    try {
      // V2: Fetch more candidates with metadata for hybrid scoring
      const candidateLimit = Math.min(limit * DIVERSITY_CONFIG.candidateMultiplier, 100);
      
      // Use pgvector + join with reviews for hybrid scoring data
      const candidates = await this.prisma.$queryRaw<RawMovieCandidate[]>`
        SELECT 
          m.id,
          m.title,
          m.poster_url as "posterUrl",
          m.release_date as "releaseDate",
          1 - (me.embedding <=> (
            SELECT embedding FROM movie_embeddings WHERE movie_id = ${movieId}::uuid
          )) as "embeddingSimilarity",
          COALESCE(
            (SELECT ARRAY_AGG(mg.genre_id::text) FROM movie_genres mg WHERE mg.movie_id = m.id),
            ARRAY[]::text[]
          ) as "genreIds",
          COALESCE(
            (SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id),
            0
          ) as "avgRating",
          COALESCE(
            (SELECT COUNT(*)::int FROM reviews r WHERE r.movie_id = m.id),
            0
          ) as "reviewCount"
        FROM movies m
        INNER JOIN movie_embeddings me ON m.id = me.movie_id
        WHERE m.id != ${movieId}::uuid
          AND me.embedding IS NOT NULL
          AND EXISTS (
            SELECT 1 FROM movie_releases mr 
            WHERE mr.movie_id = m.id 
            AND (
              (mr.start_date <= CURRENT_DATE AND (mr.end_date >= CURRENT_DATE OR mr.end_date IS NULL)) -- Now Showing
              OR (mr.start_date > CURRENT_DATE AND mr.start_date <= (CURRENT_DATE + interval '60 days')) -- Upcoming within 60 days
            )
          )
        ORDER BY "embeddingSimilarity" DESC
        LIMIT ${candidateLimit}
        OFFSET ${offset}
      `;

      // V2: Apply hybrid scoring with genre boost for similarity
      const hybridScoredCandidates = this.applyHybridScoringWithGenreBoost(
        candidates,
        sourceGenreIds
      );

      // Movie Detail Page: NO MMR - user wants "more like this" (accuracy over diversity)
      // Just take top N results, already sorted by genre-boosted similarity
      const rerankedMovies = hybridScoredCandidates.slice(0, limit);

      this.logger.debug(`Similar movies: ${candidates.length} candidates → ${rerankedMovies.length} results (MMR disabled for accuracy)`);

      // Get total count
      const totalResult = await this.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM movie_embeddings
        WHERE movie_id != ${movieId}::uuid
          AND embedding IS NOT NULL
      `;
      const total = Number(totalResult[0].count);

      return {
        movies: rerankedMovies.map(({ genreIds, embeddingSimilarity, avgRating, reviewCount, releaseDate, ...movie }) => movie),
        total,
        hasMore: offset + limit < total,
      };
    } catch (error) {
      this.logger.error('Error finding similar movies:', error);
      return this.getFallbackRecommendations(movieId, limit, offset);
    }
  }

  /**
   * Get movie recommendations based on natural language query
   * Generates embedding for the query and finds similar movies
   */
  async getRecommendationsByQuery(
    query: string,
    limit = 10,
  ): Promise<RecommendationResult & { enrichedQuery?: string }> {
    if (!query || query.trim().length === 0) {
      throw new BadRequestException('Query is required');
    }

    this.logger.debug(`Getting recommendations for query: "${query}"`);

    // Detect genre from ORIGINAL query keywords (before enrichment)
    const detectedGenres: string[] = [];
    const queryLower = query.toLowerCase();
    
    for (const [genreName, keywords] of Object.entries(GENRE_KEYWORDS)) {
      if (keywords.some(keyword => queryLower.includes(keyword.toLowerCase()))) {
        detectedGenres.push(genreName);
      }
    }
    
    if (detectedGenres.length > 0) {
      this.logger.debug(`Detected genres from query: ${detectedGenres.join(', ')}`);
    }

    try {
      // Step 1: Enrich the query using LLM for better embedding matching
      // Short queries like "action" become "action movie with exciting fight scenes..."
      const enrichmentResult = await this.embeddingService.enrichQuery(query);
      const enrichedQuery = enrichmentResult.enrichedQuery;
      
      if (enrichedQuery !== query) {
        this.logger.log(`🔮 Query enriched: "${query}" → "${enrichedQuery.substring(0, 60)}..."`);
      }

      // Step 2: Generate embedding for the ENRICHED query text
      const embeddingResult = await this.embeddingService.generateEmbedding(enrichedQuery);
      
      if (!embeddingResult || !embeddingResult.embedding) {
        this.logger.error('Failed to generate embedding for query');
        throw new BadRequestException('Failed to process query');
      }
      
      const queryEmbedding = embeddingResult.embedding;

      // V2: Fetch more candidates with metadata for hybrid scoring
      const candidateLimit = Math.min(limit * DIVERSITY_CONFIG.candidateMultiplier, 100);
      
      // Format embedding as PostgreSQL array literal
      const embeddingStr = `[${queryEmbedding.join(',')}]`;
      
      // Build genre filter if genres detected
      let genreIds: string[] = [];
      if (detectedGenres.length > 0) {
        // Get genre IDs for detected genres
        const genreRecords = await this.prisma.genre.findMany({
          where: { name: { in: detectedGenres } },
          select: { id: true }
        });
        genreIds = genreRecords.map(g => g.id);
        
        if (genreIds.length > 0) {
          this.logger.debug(`Pre-filtering by genres: ${detectedGenres.join(', ')}`);
        }
      }

      // Use pgvector to find similar movies based on query embedding
      // If genres detected, add genre filter; otherwise query all movies
      const candidates = genreIds.length > 0
        ? await this.prisma.$queryRaw<RawMovieCandidate[]>`
            SELECT 
              m.id,
              m.title,
              m.poster_url as "posterUrl",
              m.release_date as "releaseDate",
              1 - (me.embedding <=> ${embeddingStr}::vector) as "embeddingSimilarity",
              COALESCE(
                (SELECT ARRAY_AGG(mg.genre_id::text) FROM movie_genres mg WHERE mg.movie_id = m.id),
                ARRAY[]::text[]
              ) as "genreIds",
              COALESCE(
                (SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id),
                0
              ) as "avgRating",
              COALESCE(
                (SELECT COUNT(*)::int FROM reviews r WHERE r.movie_id = m.id),
                0
              ) as "reviewCount"
            FROM movies m
            INNER JOIN movie_embeddings me ON m.id = me.movie_id
            WHERE me.embedding IS NOT NULL
              AND EXISTS (
                SELECT 1 FROM movie_genres mg 
                WHERE mg.movie_id = m.id 
                AND mg.genre_id = ANY(${genreIds}::uuid[])
              )
              AND EXISTS (
                SELECT 1 FROM movie_releases mr 
                WHERE mr.movie_id = m.id 
                AND (
                  (mr.start_date <= CURRENT_DATE AND (mr.end_date >= CURRENT_DATE OR mr.end_date IS NULL)) -- Now Showing
                  OR (mr.start_date > CURRENT_DATE AND mr.start_date <= (CURRENT_DATE + interval '60 days')) -- Upcoming within 60 days
                )
              )
            ORDER BY "embeddingSimilarity" DESC
            LIMIT ${candidateLimit}
          `
        : await this.prisma.$queryRaw<RawMovieCandidate[]>`
            SELECT 
              m.id,
              m.title,
              m.poster_url as "posterUrl",
              m.release_date as "releaseDate",
              1 - (me.embedding <=> ${embeddingStr}::vector) as "embeddingSimilarity",
              COALESCE(
                (SELECT ARRAY_AGG(mg.genre_id::text) FROM movie_genres mg WHERE mg.movie_id = m.id),
                ARRAY[]::text[]
              ) as "genreIds",
              COALESCE(
                (SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id),
                0
              ) as "avgRating",
              COALESCE(
                (SELECT COUNT(*)::int FROM reviews r WHERE r.movie_id = m.id),
                0
              ) as "reviewCount"
            FROM movies m
            INNER JOIN movie_embeddings me ON m.id = me.movie_id
            WHERE me.embedding IS NOT NULL
              AND EXISTS (
                SELECT 1 FROM movie_releases mr 
                WHERE mr.movie_id = m.id 
                AND (
                  (mr.start_date <= CURRENT_DATE AND (mr.end_date >= CURRENT_DATE OR mr.end_date IS NULL)) -- Now Showing
                  OR (mr.start_date > CURRENT_DATE AND mr.start_date <= (CURRENT_DATE + interval '60 days')) -- Upcoming within 60 days
                )
              )
            ORDER BY "embeddingSimilarity" DESC
            LIMIT ${candidateLimit}
          `;

      // V2: Apply hybrid scoring (embedding + rating + recency)
      const hybridScoredCandidates = this.applyHybridScoring(candidates);

      // For query-based search with genre filtering, skip MMR diversity
      // Genre pre-filtering already ensures relevance, so just return top N
      const rerankedMovies = hybridScoredCandidates.slice(0, limit);

      this.logger.debug(`Query-based recommendations: ${candidates.length} candidates → ${rerankedMovies.length} results (MMR skipped, genre pre-filtered)`);

      // Get total count
      const totalResult = await this.prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM movie_embeddings
        WHERE embedding IS NOT NULL
      `;
      const total = Number(totalResult[0].count);

      return {
        movies: rerankedMovies.map(({ genreIds, embeddingSimilarity, avgRating, reviewCount, releaseDate, ...movie }) => movie),
        total,
        hasMore: limit < total,
        enrichedQuery: enrichedQuery !== query ? enrichedQuery : undefined,
      };
    } catch (error) {
      this.logger.error('Error getting recommendations by query:', error);
      throw error;
    }
  }

  /**
   * V2 Hybrid Scoring: Combine multiple signals
   * 
   * Formula: 0.70 * embedding + 0.20 * rating + 0.10 * recency
   * Note: Popularity removed to prevent classic films from dominating
   */
  private applyHybridScoring(
    candidates: RawMovieCandidate[],
  ): ScoredMovieCandidate[] {
    if (candidates.length === 0) return [];

    // Find max values for normalization
    const maxRating = 5; // Reviews are 1-5

    const scored = candidates.map(candidate => {
      // Normalize each component to 0-1
      const embeddingScore = Math.max(0, Math.min(1, candidate.embeddingSimilarity));
      
      // Cold-start fix: Default to neutral rating (0.5) for movies with no reviews
      // This prevents new movies from being penalized for lack of ratings
      const ratingScore = candidate.reviewCount > 0 
        ? candidate.avgRating / maxRating 
        : 0.5;  // Assume average quality for unrated movies
      
      // Recency: 1 for today, 0 for 1+ years old
      const daysSinceRelease = Math.max(0,
        (Date.now() - new Date(candidate.releaseDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      const recencyScore = Math.max(0, 1 - daysSinceRelease / 365);

      // New release boost: +10% for movies released within 30 days
      const newReleaseBoost = NEW_RELEASE_BOOST.enabled && daysSinceRelease <= NEW_RELEASE_BOOST.days
        ? NEW_RELEASE_BOOST.boost
        : 0;

      // Weighted combination + new release boost
      const hybridScore = 
        HYBRID_WEIGHTS.embeddingSimilarity * embeddingScore +
        HYBRID_WEIGHTS.rating * ratingScore +
        HYBRID_WEIGHTS.recency * recencyScore +
        newReleaseBoost;

      return {
        ...candidate,
        similarity: hybridScore, // Override similarity with hybrid score
      };
    });

    // Re-sort by hybrid score
    scored.sort((a, b) => b.similarity - a.similarity);

    this.logger.debug(`Hybrid scoring applied to ${candidates.length} candidates`);
    return scored;
  }

  /**
   * V2.1 Hybrid Scoring with Genre Boost for Similarity Endpoint
   * Applies hybrid scoring with bonus for genre matches
   */
  private applyHybridScoringWithGenreBoost(
    candidates: RawMovieCandidate[],
    sourceGenreIds: string[]
  ): ScoredMovieCandidate[] {
    if (candidates.length === 0) return [];

    const maxRating = 5;
    const maxGenreOverlap = Math.max(1, sourceGenreIds.length); // Normalize by source genres

    const scored = candidates.map(candidate => {
      // Normalize embedding similarity to 0-1
      const embeddingScore = Math.max(0, Math.min(1, candidate.embeddingSimilarity));
      
      // Rating score (0-1), default 0.5 for unrated movies
      const ratingScore = candidate.reviewCount > 0 
        ? candidate.avgRating / maxRating 
        : 0.5;
      
      // Recency score: 1 for today, 0 for 1+ years old
      const daysSinceRelease = Math.max(0,
        (Date.now() - new Date(candidate.releaseDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      const recencyScore = Math.max(0, 1 - daysSinceRelease / 365);

      // Genre match score (0-1): how many genres overlap with source movie
      const genreOverlap = candidate.genreIds.filter(id => sourceGenreIds.includes(id)).length;
      const genreMatchScore = genreOverlap / maxGenreOverlap;

      // New release boost
      const newReleaseBoost = NEW_RELEASE_BOOST.enabled && daysSinceRelease <= NEW_RELEASE_BOOST.days
        ? NEW_RELEASE_BOOST.boost
        : 0;

      // Calculate final score using SIMILARITY_WEIGHTS (research-backed)
      const finalScore = 
        SIMILARITY_WEIGHTS.genreMatch * genreMatchScore +
        SIMILARITY_WEIGHTS.embeddingSimilarity * embeddingScore +
        SIMILARITY_WEIGHTS.rating * ratingScore +
        SIMILARITY_WEIGHTS.recency * recencyScore +
        newReleaseBoost;

      return {
        ...candidate,
        similarity: finalScore,
      };
    });

    scored.sort((a, b) => b.similarity - a.similarity);

    this.logger.debug(`Similarity scoring (40% genre, 35% embedding, 15% rating, 10% recency): ${scored.length} candidates`);
    return scored;
  }

  /**
   * MMR (Maximal Marginal Relevance) reranking for diversity
   * Balances similarity with genre diversity
   * 
   * MMR = lambda * similarity - (1 - lambda) * max_similarity_to_selected
   * 
   * Instead of embedding-level diversity (expensive), we use genre overlap as proxy
   */
  private applyMMRDiversity<T extends { genreIds: string[]; similarity: number }>(
    candidates: T[],
    limit: number,
  ): T[] {
    if (candidates.length <= limit) {
      return candidates;
    }

    const lambda = DIVERSITY_CONFIG.lambda;
    const selected: T[] = [];
    const remaining = [...candidates];

    // Optimization: Only check overlap with last N selected (reduces O(k²) to O(k))
    const maxOverlapCheckCount = 5;
    // Optional early termination if MMR score drops too low
    const minMmrScore = 0.2;

    // Greedily select movies using MMR
    while (selected.length < limit && remaining.length > 0) {
      let bestIdx = 0;
      let bestScore = -Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        
        // Similarity score (normalized to 0-1)
        const similarityScore = candidate.similarity;

        // Diversity penalty: max overlap with recent selected movies (optimized)
        // Only check last 5 to reduce complexity from O(k²) to O(k)
        const recentSelected = selected.slice(-maxOverlapCheckCount);
        let maxOverlap = 0;
        for (const sel of recentSelected) {
          const overlap = this.calculateGenreOverlap(candidate.genreIds, sel.genreIds);
          maxOverlap = Math.max(maxOverlap, overlap);
        }

        // MMR score: balance similarity and diversity
        // High lambda = prioritize similarity, low lambda = prioritize diversity
        const mmrScore = lambda * similarityScore - (1 - lambda) * maxOverlap;

        if (mmrScore > bestScore) {
          bestScore = mmrScore;
          bestIdx = i;
        }
      }

      // Early termination: Stop if best score is too low (no good candidates left)
      if (bestScore < minMmrScore && selected.length >= limit / 2) {
        this.logger.debug(`MMR early termination at ${selected.length} results (score ${bestScore.toFixed(3)} < ${minMmrScore})`);
        break;
      }

      // Add best candidate to selected and remove from remaining
      selected.push(remaining[bestIdx]);
      remaining.splice(bestIdx, 1);
    }

    this.logger.debug(`MMR reranking: ${candidates.length} candidates → ${selected.length} diverse results`);
    return selected;
  }

  /**
   * Calculate genre overlap between two movies (Jaccard similarity)
   * Returns 0-1 where 1 = identical genres, 0 = no overlap
   */
  private calculateGenreOverlap(genres1: string[], genres2: string[]): number {
    if (!genres1?.length || !genres2?.length) return 0;
    
    const set1 = new Set(genres1);
    const set2 = new Set(genres2);
    
    const intersection = [...set1].filter(g => set2.has(g)).length;
    const union = new Set([...genres1, ...genres2]).size;
    
    return union > 0 ? intersection / union : 0;
  }

  /**
   * Weighted Cascade Fallback when embeddings fail
   * 
   * Scoring: director_match(0.3) + cast_overlap(0.25) + genre_match(0.35) + recency(0.1)
   */
  async getFallbackRecommendations(
    movieId: string,
    limit: number,
    offset: number,
  ): Promise<RecommendationResult> {
    this.logger.debug('Using weighted cascade fallback');

    // Get source movie with all relevant data
    const sourceMovie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      include: { 
        movieGenres: { include: { genre: true } },
      },
    });

    if (!sourceMovie) {
      return { movies: [], total: 0, hasMore: false };
    }

    const sourceGenreIds = new Set(sourceMovie.movieGenres.map(mg => mg.genreId));
    const sourceDirector = sourceMovie.director?.toLowerCase() || '';
    const sourceCast = this.extractCastNames(sourceMovie.cast);

    // Get candidate movies with their metadata
    const candidates = await this.prisma.movie.findMany({
      where: {
        id: { not: movieId },
      },
      include: {
        movieGenres: true,
      },
      orderBy: { releaseDate: 'desc' },
    });

    // Score each candidate
    const scoredCandidates = candidates.map(candidate => {
      const candidateGenreIds = new Set(candidate.movieGenres.map(mg => mg.genreId));
      const candidateDirector = candidate.director?.toLowerCase() || '';
      const candidateCast = this.extractCastNames(candidate.cast);

      // 1. Director match (0 or 1)
      const directorScore = sourceDirector && candidateDirector && 
        sourceDirector === candidateDirector ? 1 : 0;

      // 2. Cast overlap (Jaccard similarity)
      const castScore = this.calculateSetOverlap(sourceCast, candidateCast);

      // 3. Genre match (proportion of source genres matched)
      const genreIntersection = [...sourceGenreIds].filter(g => candidateGenreIds.has(g)).length;
      const genreScore = sourceGenreIds.size > 0 
        ? genreIntersection / sourceGenreIds.size 
        : 0;

      // 4. Recency score (newer = higher, normalized to 0-1)
      const daysSinceRelease = Math.max(0, 
        (Date.now() - new Date(candidate.releaseDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      const recencyScore = Math.max(0, 1 - daysSinceRelease / 365); // 1 year = 0

      // Weighted cascade score
      const totalScore = 
        0.35 * genreScore +
        0.30 * directorScore +
        0.25 * castScore +
        0.10 * recencyScore;

      return {
        id: candidate.id,
        title: candidate.title,
        posterUrl: candidate.posterUrl,
        similarity: totalScore,
        _debug: { directorScore, castScore, genreScore, recencyScore },
      };
    });

    // Sort by score descending
    scoredCandidates.sort((a, b) => b.similarity - a.similarity);

    // Filter out zero-score movies (no relation at all)
    const relevantCandidates = scoredCandidates.filter(c => c.similarity > 0);

    // Apply pagination
    const paginatedMovies = relevantCandidates.slice(offset, offset + limit);
    const total = relevantCandidates.length;

    this.logger.debug(`Fallback: ${candidates.length} total → ${relevantCandidates.length} relevant → ${paginatedMovies.length} returned`);

    return {
      movies: paginatedMovies.map(({ _debug, ...movie }) => movie),
      total,
      hasMore: offset + limit < total,
    };
  }

  /**
   * Extract cast names from JSON cast field
   */
  private extractCastNames(cast: unknown): Set<string> {
    if (!cast || !Array.isArray(cast)) return new Set();
    
    return new Set(
      cast
        .slice(0, 10) // Top 10 cast members
        .map(c => {
          if (typeof c === 'string') return c.toLowerCase();
          if (typeof c === 'object' && c !== null && 'name' in c) {
            return String((c as { name: string }).name).toLowerCase();
          }
          return '';
        })
        .filter(Boolean)
    );
  }

  /**
   * Calculate overlap between two sets (Jaccard similarity)
   */
  private calculateSetOverlap(set1: Set<string>, set2: Set<string>): number {
    if (set1.size === 0 || set2.size === 0) return 0;
    
    const intersection = [...set1].filter(item => set2.has(item)).length;
    const union = new Set([...set1, ...set2]).size;
    
    return union > 0 ? intersection / union : 0;
  }

  /**
   * Generate and store embedding for a movie
   */
  async generateAndStoreEmbedding(movieId: string): Promise<boolean> {
    // Validate input - defense in depth
    this.validateUUID(movieId, 'movieId');

    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      include: { movieGenres: { include: { genre: true } } },
    });

    if (!movie) {
      this.logger.warn(`Movie ${movieId} not found`);
      return false;
    }

    const genres = movie.movieGenres.map(mg => mg.genre.name);
    const cast = Array.isArray(movie.cast) ? movie.cast.slice(0, 5) : [];

    const result = await this.embeddingService.generateMovieEmbedding({
      title: movie.title,
      overview: movie.overview,
      genres,
      director: movie.director,
      cast: cast.map(c => {
        if (typeof c === 'string') return c;
        if (c && typeof c === 'object' && 'name' in c) {
          return String((c as { name: unknown }).name);
        }
        return '';
      }).filter(Boolean),
    });

    if (!result) {
      this.logger.error(`Failed to generate embedding for movie ${movieId}`);
      return false;
    }

    // Store embedding using raw SQL (Prisma doesn't support vector type natively)
    await this.prisma.$executeRaw`
      INSERT INTO movie_embeddings (id, movie_id, embedding, model, text_hash, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        ${movieId}::uuid,
        ${result.embedding}::vector,
        ${result.model},
        ${result.textHash},
        NOW(),
        NOW()
      )
      ON CONFLICT (movie_id) 
      DO UPDATE SET 
        embedding = ${result.embedding}::vector,
        model = ${result.model},
        text_hash = ${result.textHash},
        updated_at = NOW()
    `;

    this.logger.log(`✅ Stored embedding for movie: ${movie.title}`);
    return true;
  }

  /**
   * Batch generate embeddings for all movies without embeddings
   */
  async batchGenerateEmbeddings(): Promise<{ success: number; failed: number }> {
    // Get all movies without embeddings
    const movies = await this.prisma.movie.findMany({
      where: {
        embedding: null,
      },
      select: { id: true, title: true },
    });

    this.logger.log(`Generating embeddings for ${movies.length} movies...`);

    let success = 0;
    let failed = 0;

    for (const movie of movies) {
      try {
        const result = await this.generateAndStoreEmbedding(movie.id);
        if (result) {
          success++;
        } else {
          failed++;
        }
        
        // Rate limiting - wait 100ms between API calls
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        this.logger.error(`Failed to process movie ${movie.title}:`, error);
        failed++;
      }
    }

    this.logger.log(`Batch complete: ${success} success, ${failed} failed`);
    return { success, failed };
  }

  /**
   * Get personalized "For You" recommendations based on user's booking history
   * 
   * Algorithm:
   * 1. If user has booking history → find similar movies to their watched movies
   * 2. If no history (cold-start) → return trending movies
   * 
   * @param bookedMovieIds - Array of movie IDs the user has booked/watched
   * @param limit - Number of recommendations to return
   */
  async getForYouRecommendations(
    bookedMovieIds: string[],
    limit = 20,
  ): Promise<RecommendationResult & { isPersonalized: boolean }> {
    // Validate input
    for (const id of bookedMovieIds) {
      this.validateUUID(id, 'bookedMovieId');
    }

    // Cold-start: No booking history → return trending
    if (bookedMovieIds.length === 0) {
      this.logger.log('Cold-start user: returning trending movies');
      const trending = await this.getTrendingMovies(limit);
      return { ...trending, isPersonalized: false };
    }

    this.logger.log(`Generating personalized recommendations from ${bookedMovieIds.length} booked movies`);

    try {
      // Step 1: Get genres from booked movies
      const bookedMovies = await this.prisma.movie.findMany({
        where: { id: { in: bookedMovieIds } },
        include: { movieGenres: { include: { genre: true } } },
      });

      // Extract unique genre IDs from booked movies
      const preferredGenreIds = new Set<string>();
      for (const movie of bookedMovies) {
        for (const mg of movie.movieGenres) {
          preferredGenreIds.add(mg.genreId);
        }
      }

      this.logger.log(`User prefers ${preferredGenreIds.size} genres: ${[...preferredGenreIds].join(', ')}`);

      // Step 2: Find similar movies user hasn't watched
      // Use embedding similarity if available, otherwise fallback to genre matching
      const candidateLimit = Math.min(limit * DIVERSITY_CONFIG.candidateMultiplier, 100);
      
      // Format booked movie IDs for SQL
      const bookedIdsArray = bookedMovieIds.map(id => `'${id}'`).join(',');

      const candidates = await this.prisma.$queryRaw<RawMovieCandidate[]>`
        SELECT 
          m.id,
          m.title,
          m.poster_url as "posterUrl",
          m.release_date as "releaseDate",
          COALESCE(
            (SELECT 1 - MIN(me2.embedding <=> me.embedding)
             FROM movie_embeddings me2 
             WHERE me2.movie_id = ANY(${bookedMovieIds}::uuid[])
             AND me.embedding IS NOT NULL),
            0.5
          ) as "embeddingSimilarity",
          COALESCE(
            (SELECT ARRAY_AGG(mg.genre_id::text) FROM movie_genres mg WHERE mg.movie_id = m.id),
            ARRAY[]::text[]
          ) as "genreIds",
          COALESCE(
            (SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id),
            0
          ) as "avgRating",
          COALESCE(
            (SELECT COUNT(*)::int FROM reviews r WHERE r.movie_id = m.id),
            0
          ) as "reviewCount"
        FROM movies m
        LEFT JOIN movie_embeddings me ON m.id = me.movie_id
        WHERE m.id != ALL(${bookedMovieIds}::uuid[])
          AND EXISTS (
            SELECT 1 FROM movie_releases mr 
            WHERE mr.movie_id = m.id 
            AND (
              (mr.start_date <= CURRENT_DATE AND (mr.end_date >= CURRENT_DATE OR mr.end_date IS NULL))
              OR (mr.start_date > CURRENT_DATE AND mr.start_date <= (CURRENT_DATE + interval '60 days'))
            )
          )
          AND EXISTS (
            SELECT 1 FROM movie_genres mg 
            WHERE mg.movie_id = m.id 
            AND mg.genre_id = ANY(${[...preferredGenreIds]}::uuid[])
          )
        ORDER BY "embeddingSimilarity" DESC, m.release_date DESC
        LIMIT ${candidateLimit}
      `;

      if (candidates.length === 0) {
        this.logger.warn('No candidates found with preferred genres, falling back to trending');
        const trending = await this.getTrendingMovies(limit);
        return { ...trending, isPersonalized: false };
      }

      // Step 3: Apply hybrid scoring with genre boost
      const scored = this.applyHybridScoringWithGenreBoost(candidates, [...preferredGenreIds]);

      // Step 4: Apply MMR diversity to avoid repetitive recommendations
      const diverseResults = this.applyMMRDiversity(scored, limit);

      // Step 5: Format results
      const movies: SimilarMovie[] = diverseResults.map(m => ({
        id: m.id,
        title: m.title,
        posterUrl: m.posterUrl,
        similarity: m.similarity,
      }));

      return {
        movies,
        total: movies.length,
        hasMore: candidates.length > limit,
        isPersonalized: true,
      };

    } catch (error) {
      this.logger.error('Error generating For You recommendations:', error);
      // Fallback to trending on error
      const trending = await this.getTrendingMovies(limit);
      return { ...trending, isPersonalized: false };
    }
  }

  /**
   * Get trending movies (cold-start fallback)
   * 
   * Scoring: 50% rating + 50% recency
   * Includes:
   * - Movies with valid movie_releases (now showing or upcoming 60 days)
   * - OR movies with release_date in the past year (fallback for movies without releases)
   */
  async getTrendingMovies(limit = 20): Promise<RecommendationResult> {
    this.logger.log(`Fetching ${limit} trending movies`);

    const movies = await this.prisma.$queryRaw<Array<{
      id: string;
      title: string;
      posterUrl: string;
      avgRating: number;
      releaseDate: Date;
    }>>`
      SELECT 
        m.id,
        m.title,
        m.poster_url as "posterUrl",
        COALESCE((SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id), 3.0) as "avgRating",
        m.release_date as "releaseDate"
      FROM movies m
      WHERE (
        -- Option 1: Has valid movie_releases entry
        EXISTS (
          SELECT 1 FROM movie_releases mr 
          WHERE mr.movie_id = m.id 
          AND (
            (mr.start_date <= CURRENT_DATE AND (mr.end_date >= CURRENT_DATE OR mr.end_date IS NULL))
            OR (mr.start_date > CURRENT_DATE AND mr.start_date <= (CURRENT_DATE + interval '60 days'))
          )
        )
        -- Option 2: Fallback - movie released in past 2 years
        OR (m.release_date >= (CURRENT_DATE - interval '2 years'))
      )
      ORDER BY (
        0.5 * (COALESCE((SELECT AVG(r.rating)::float FROM reviews r WHERE r.movie_id = m.id), 3.0) / 5.0) +
        0.5 * GREATEST(0, 1.0 - (EXTRACT(EPOCH FROM (CURRENT_DATE::timestamp - m.release_date::timestamp)) / (365.0 * 24 * 60 * 60)))
      ) DESC
      LIMIT ${limit}
    `;

    const result: SimilarMovie[] = movies.map(m => ({
      id: m.id,
      title: m.title,
      posterUrl: m.posterUrl,
      similarity: (m.avgRating / 5.0) * 0.5 + 0.5, // Pseudo-similarity for UI consistency
    }));

    return {
      movies: result,
      total: result.length,
      hasMore: false,
    };
  }
}

