import {
  CreateMovieSchema,
  MovieDetailResponse,
  MovieQuery,
  MovieSummary,
  UpdateMovieSchema,
} from '@movie-hub/shared-types';

import z from 'zod';
import api from '../../api/api-client';
import { ServiceResult } from '@movie-hub/shared-types/common';

export type CreateMovieRequest = z.infer<typeof CreateMovieSchema>;
export type UpdateMovieRequest = z.infer<typeof UpdateMovieSchema>;

export const getMovies = async (
  query: MovieQuery
): Promise<ServiceResult<MovieSummary[]>> => {
   
  try {
    const response = await api.get('/movies', { params: query });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMovieDetail = async (
  movieId: string
): Promise<ServiceResult<MovieDetailResponse>> => {
  try {
    const response = await api.get(`/movies/${movieId}`, {});
    return response.data;
  } catch (error) {
    // Re-throw the error so callers can handle it (or handle/log here as needed)
    throw error;
  }
};

export const createMovie = async (
  movieData: CreateMovieRequest,
  token: string
): Promise<MovieSummary> => {
  try {
    const response = await api.post('/movies', movieData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as MovieSummary;
  } catch (error) {
    throw error;
  }
};

export const updateMovie = async (
  movieId: string,
  movieData: UpdateMovieRequest,
  token: string
): Promise<MovieSummary> => {
   
  try {
    const response = await api.put(`/movies/${movieId}`, movieData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as MovieSummary;
  } catch (error) {
    // Re-throw the error so callers can handle it (or handle/log here as needed)
    throw error;
  }
};

export const deleteMovie = async (
  movieId: string,
  token: string
): Promise<void> => {
   
  try {
    await api.delete(`/movies/${movieId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    // Re-throw the error so callers can handle it (or handle/log here as needed)
    throw error;
  }
};

// Similar Movies Response Type
export interface SimilarMovie {
  id: string;
  title: string;
  posterUrl: string;
  similarity: number;
}

export interface SimilarMoviesResponse {
  movies: SimilarMovie[];
  total: number;
  hasMore: boolean;
}

// Get similar movies for a given movie
export const getSimilarMovies = async (
  movieId: string,
  limit = 20
): Promise<SimilarMoviesResponse> => {
  try {
    const response = await api.get(`/movies/${movieId}/similar`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Recommendations Response Type
export interface RecommendedMovie {
  id: string;
  title: string;
  posterUrl: string;
  similarity: number; // Backend returns 'similarity', not 'score'
  genres?: string[];
}

export interface RecommendationsResponse {
  movies: RecommendedMovie[];
  total: number;
  query: string;
  enrichedQuery?: string; // LLM-expanded query for better semantic matching
}

// Get personalized recommendations based on a query (genre, mood, etc.)
export const getRecommendations = async (
  query: string,
  limit = 10
): Promise<RecommendationsResponse> => {
  try {
    const response = await api.post('/movies/recommendations', {
      query,
      limit,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// For You Recommendations Response Type
export interface ForYouResponse {
  movies: SimilarMovie[];
  total: number;
  hasMore: boolean;
  isPersonalized: boolean;
}

// Get personalized "For You" recommendations based on booking history
export const getForYouRecommendations = async (
  limit = 20,
  token: string
): Promise<ForYouResponse> => {
  try {
    const response = await api.get('/movies/for-you', {
      params: { limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
