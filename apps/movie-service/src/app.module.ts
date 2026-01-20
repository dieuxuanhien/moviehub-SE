import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { GenreModule } from './module/genre/genre.module';
import { MovieModule } from './module/movie/movie.module';
import { ReviewModule } from './module/review/review.module';
import { EmbeddingModule } from './module/embedding/embedding.module';
import { RecommendationModule } from './module/recommendation/recommendation.module';

@Module({
  imports: [
    MovieModule,
    GenreModule,
    ReviewModule,
    EmbeddingModule,
    RecommendationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/movie-service/.env',
      validationSchema: Joi.object({
        TCP_PORT: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        GEMINI_API_KEY: Joi.string().optional(), // Optional for dev without embeddings
      }),
    }),
  ],
})
export class AppModule {}

