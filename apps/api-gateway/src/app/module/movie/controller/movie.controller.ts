import {
  CreateMovieRequest,
  CreateReviewRequest,
  MovieQuery,
  ReviewQuery,
  UpdateMovieRequest,
  UpdateReviewRequest,
} from '@movie-hub/shared-types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MovieService } from '../service/movie.service';

@Controller({
  version: '1',
  path: 'movies',
})
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  // ============ Admin Routes (MUST be before :id routes) ============

  @Post('admin/embeddings/batch')
  async batchGenerateEmbeddings() {
    return this.movieService.batchGenerateEmbeddings();
  }

  @Post('admin/embeddings/generate/:id')
  async generateEmbedding(@Param('id') id: string) {
    return this.movieService.generateEmbedding(id);
  }

  // ============ Recommendation Routes ============

  @Post('recommendations')
  async getRecommendations(@Body() body: { query: string; limit?: number }) {
    return this.movieService.getRecommendations(body.query, body.limit || 10);
  }

  // ============ Movie CRUD ============

  @Get()
  async getMovies(@Query() query: MovieQuery) {
    return this.movieService.getMovies(query);
  }

  @Post()
  async createMovie(@Body() request: CreateMovieRequest) {
    return this.movieService.createMovie(request);
  }

  // ============ Movie by ID routes ============

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.movieService.getMovieDetail(id);
  }

  @Get(':id/releases')
  async getMovieRelease(@Param('id') id: string) {
    return this.movieService.getMovieRelease(id);
  }

  @Get(':id/similar')
  async getSimilarMovies(
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.movieService.getSimilarMovies(
      id,
      limit ? parseInt(limit, 10) : 20,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Put(':id')
  async updateMovie(
    @Param('id') id: string,
    @Body() request: UpdateMovieRequest
  ) {
    return this.movieService.updateMovie(id, request);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.movieService.deleteMovie(id);
    return null;
  }

  // ============ Reviews ============

  @Get(':id/reviews')
  async getReviews(@Param('id') id: string, @Query() query: ReviewQuery) {
    query.movieId = id;
    return this.movieService.getReviews(query);
  }

  @Post(':id/reviews')
  async createReview(
    @Param('id') id: string,
    @Body() request: CreateReviewRequest
  ) {
    request.movieId = id;
    return this.movieService.createReviews(request);
  }

  @Put(':id/reviews/:reviewId')
  async updateReview(
    @Param('reviewId') reviewId: string,
    @Body() request: UpdateReviewRequest
  ) {
    return this.movieService.updateReview(reviewId, request);
  }
}
