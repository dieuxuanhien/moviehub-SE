import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as crypto from 'crypto';

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  textHash: string;
}

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EmbeddingService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private readonly MODEL_NAME = 'text-embedding-004'; // Gemini embedding model

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
      this.logger.log(`✅ Gemini embedding service initialized with model: ${this.MODEL_NAME}`);
    } catch (error) {
      this.logger.error('❌ Failed to initialize Gemini:', error);
      this.genAI = null;
    }
  }

  /**
   * Check if embedding service is available
   */
  isAvailable(): boolean {
    return this.genAI !== null;
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
        model: this.MODEL_NAME 
      });
      
      const result = await embeddingModel.embedContent(text);
      const embedding = result.embedding.values;
      
      this.logger.debug(`Generated embedding with ${embedding.length} dimensions`);
      
      return {
        embedding,
        model: this.MODEL_NAME,
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
