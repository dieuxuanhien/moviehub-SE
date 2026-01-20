import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import * as crypto from 'crypto';

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  textHash: string;
}

export interface EnrichmentResult {
  originalQuery: string;
  enrichedQuery: string;
  genres?: string[];
  mood?: string;
}

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private generativeModel: GenerativeModel | null = null;
  private readonly EMBEDDING_MODEL = 'text-embedding-004'; // Gemini embedding model
  private readonly GENERATIVE_MODEL = 'gemini-2.5-flash'; // For query enrichment

  constructor(private readonly configService: ConfigService) {
    this.logger.log('🔧 EmbeddingService constructor called');
  }                

  async onModuleInit() {
    // Try ConfigService first, then fall back to process.env
    let apiKey = this.configService.get<string>('GEMINI_API_KEY');
    
    if (!apiKey) {
      // Fallback to direct process.env (in case ConfigModule envFilePath doesn't work in Docker)
      apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        this.logger.log('📌 Using GEMINI_API_KEY from process.env (ConfigService returned empty)');
      }
    }
    
    if (!apiKey) {
      this.logger.warn('⚠️ GEMINI_API_KEY not set - embedding features disabled');
      this.logger.debug('Available env vars: ' + Object.keys(process.env).filter(k => k.includes('GEMINI')).join(', '));
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      
      // Initialize generative model for query enrichment
      this.generativeModel = this.genAI.getGenerativeModel({ 
        model: this.GENERATIVE_MODEL 
      });
      
      this.logger.log(`✅ Gemini services initialized:`);
      this.logger.log(`   - Embedding model: ${this.EMBEDDING_MODEL}`);
      this.logger.log(`   - Generative model: ${this.GENERATIVE_MODEL}`);
    } catch (error) {
      this.logger.error('❌ Failed to initialize Gemini:', error);
      this.genAI = null;
      this.generativeModel = null;
    }
  }

  /**
   * Check if embedding service is available
   */
  isAvailable(): boolean {
    return this.genAI !== null;
  }

  /**
   * Check if generative model is available for query enrichment
   */
  isGenerativeAvailable(): boolean {
    return this.generativeModel !== null;
  }

  /**
   * Enrich a short user query into a detailed movie description
   * This helps improve embedding similarity matching
   * 
   * @example
   * Input: "action"
   * Output: "action movie with exciting fight scenes, car chases, explosions, and heroic protagonists saving the world"
   */
  async enrichQuery(query: string): Promise<EnrichmentResult> {
    const result: EnrichmentResult = {
      originalQuery: query,
      enrichedQuery: query, // Default to original if enrichment fails
    };

    // Return original if service not available or query is already detailed
    if (!this.isGenerativeAvailable() || !this.generativeModel) {
      this.logger.warn('Generative model not available, using original query');
      return result;
    }

    // Skip enrichment for already detailed queries (> 50 chars)
    if (query.length > 50) {
      this.logger.debug('Query already detailed, skipping enrichment');
      return result;
    }

    try {
      const prompt = `You are a movie search assistant. Expand this short movie search query into a detailed description that captures what the user likely wants. Include relevant themes, moods, genres, and typical elements.

User query: "${query}"

Rules:
- Keep the response under 100 words
- Focus on movie characteristics (plot themes, mood, style, typical elements)
- Include Vietnamese context if the query is in Vietnamese
- Do NOT mention specific movie titles
- Respond in the same language as the query

Respond with ONLY the expanded description, no explanations:`;

      const response = await this.generativeModel.generateContent(prompt);
      const enrichedText = response.response.text().trim();

      if (enrichedText && enrichedText.length > query.length) {
        result.enrichedQuery = enrichedText;
        this.logger.log(`✨ Query enriched: "${query}" → "${enrichedText.substring(0, 80)}..."`);
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to enrich query:', error);
      return result; // Return original query on error
    }
  }

  /**
   * Generate embedding for movie text
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult | null> {
    if (!this.isAvailable() || !this.genAI) {
      this.logger.warn('Embedding service not available');
      return null;
    }

    try {
      const textHash = this.hashText(text);
      
      // Get embedding model and call embedContent
      const embeddingModel = this.genAI.getGenerativeModel({ 
        model: this.EMBEDDING_MODEL 
      });
      
      const result = await embeddingModel.embedContent(text);
      const embedding = result.embedding.values;
      
      this.logger.debug(`Generated embedding with ${embedding.length} dimensions`);
      
      return {
        embedding,
        model: this.EMBEDDING_MODEL,
        textHash,
      };
    } catch (error) {
      this.logger.error('Failed to generate embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embedding for a movie based on its content
   */
  async generateMovieEmbedding(movie: {
    title: string;
    overview: string;
    genres?: string[];
    director?: string;
    cast?: string[];
  }): Promise<EmbeddingResult | null> {
    // Combine movie fields into rich text for embedding
    const parts: string[] = [
      movie.title,
      movie.overview,
    ];

    if (movie.genres?.length) {
      parts.push(`Genres: ${movie.genres.join(', ')}`);
    }

    if (movie.director) {
      parts.push(`Director: ${movie.director}`);
    }

    if (movie.cast?.length) {
      parts.push(`Cast: ${movie.cast.slice(0, 5).join(', ')}`);
    }

    const text = parts.join(' | ');
    
    this.logger.debug(`Generating embedding for: ${movie.title}`);
    
    return this.generateEmbedding(text);
  }

  /**
   * Create hash of text for change detection
   */
  private hashText(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
  }
}

