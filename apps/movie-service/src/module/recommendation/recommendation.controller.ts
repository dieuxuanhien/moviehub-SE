import { Body, Controller, Get, Param, Query, Post, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RecommendationService } from './recommendation.service';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Recommendations')
@Controller('movies')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  // ============ HTTP Endpoints (for API Gateway) ============

  @Get(':id/similar')
  @ApiOperation({ summary: 'Get similar movies based on content similarity' })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of results (default: 20)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination (default: 0)' })
  @ApiResponse({ status: 200, description: 'List of similar movies' })
  async getSimilarMovies(
    @Param('id') movieId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.recommendationService.getSimilarMovies(
      movieId,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Post('admin/embeddings/generate/:id')
  @ApiOperation({ summary: 'Generate embedding for a single movie (admin)' })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  async generateEmbedding(@Param('id') movieId: string) {
    const success = await this.recommendationService.generateAndStoreEmbedding(movieId);
    return { success, movieId };
  }

  @Post('admin/embeddings/batch')
  @ApiOperation({ summary: 'Generate embeddings for all movies without embeddings (admin)' })
  async batchGenerateEmbeddings() {
    return this.recommendationService.batchGenerateEmbeddings();
  }

  @Post('recommendations')
  @ApiOperation({ summary: 'Get AI-powered movie recommendations based on natural language query' })
  @ApiResponse({ status: 200, description: 'List of recommended movies' })
  async getRecommendations(
    @Body() body: { query: string; limit?: number },
  ) {
    return this.recommendationService.getRecommendationsByQuery(
      body.query,
      body.limit ?? 10,
    );
  }

  // ============ TCP Microservice Endpoints ============

  @MessagePattern({ cmd: 'get_similar_movies' })
  async getSimilarMoviesTcp(
    @Payload() data: { movieId: string; limit?: number; offset?: number },
  ) {
    return this.recommendationService.getSimilarMovies(
      data.movieId,
      data.limit ?? 20,
      data.offset ?? 0,
    );
  }

  @MessagePattern({ cmd: 'generate_embedding' })
  async generateEmbeddingTcp(@Payload() data: { movieId: string }) {
    const success = await this.recommendationService.generateAndStoreEmbedding(data.movieId);
    return { success, movieId: data.movieId };
  }

  @MessagePattern({ cmd: 'batch_generate_embeddings' })
  async batchGenerateEmbeddingsTcp() {
    return this.recommendationService.batchGenerateEmbeddings();
  }

  @MessagePattern({ cmd: 'get_recommendations' })
  async getRecommendationsTcp(
    @Payload() data: { query: string; limit?: number },
  ) {
    return this.recommendationService.getRecommendationsByQuery(
      data.query,
      data.limit ?? 10,
    );
  }
}

