'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@movie-hub/shacdn-ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@movie-hub/shacdn-ui/carousel';
import { useGetSimilarMovies } from '@/hooks/movie-hooks';
import { ErrorFallback } from '@/components/error-fallback';
import { Film, Sparkles } from 'lucide-react';
import { SimilarMovie } from '@/libs/actions/movies/movie-action';

interface SimilarMoviesProps {
  movieId: string;
  limit?: number;
}

export const SimilarMovies = ({ movieId, limit = 10 }: SimilarMoviesProps) => {
  const { data, isLoading, isError, error } = useGetSimilarMovies(movieId, limit);
  const movies = data?.movies || [];

  if (isLoading) {
    return (
      <section className="relative flex flex-col gap-6 px-4">
        <h2 className="text-white text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Phim tương tự
        </h2>
        <Carousel className="w-full">
          <CarouselContent className="m-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <CarouselItem key={i} className="basis-1/2 md:basis-1/3 lg:basis-1/6 p-2">
                <div className="flex flex-col gap-3">
                  <Skeleton className="aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="relative flex flex-col gap-6 px-4">
        <h2 className="text-white text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          Phim tương tự
        </h2>
        <ErrorFallback message={error?.message} />
      </section>
    );
  }

  if (movies.length === 0) {
    return null; // Don't show section if no similar movies
  }

  return (
    <section className="relative flex flex-col gap-6 px-4">
      <h2 className="text-white text-3xl font-bold tracking-tight flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-yellow-400" />
        Phim tương tự
      </h2>
      
      <Carousel className="w-full">
        <CarouselContent className="m-0">
          {movies.map((movie: SimilarMovie) => (
            <CarouselItem
              key={movie.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/6 p-2"
            >
              <Link
                href={`/movies/${movie.id}`}
                className="group flex flex-col gap-3 transition-transform hover:scale-105"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={
                      movie.posterUrl && !movie.posterUrl.includes('placeholder')
                        ? movie.posterUrl
                        : '/images/placeholder.png'
                    }
                    alt={movie.title}
                    className="object-cover aspect-[2/3] group-hover:brightness-110 transition-all duration-300"
                    height={280}
                    width={180}
                  />
                  
                  {/* Similarity badge */}
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    {Math.round(movie.similarity * 100)}% match
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Film className="w-4 h-4" />
                      Xem chi tiết
                    </div>
                  </div>
                </div>
                
                <p className="text-neutral-300 font-medium text-sm line-clamp-2 group-hover:text-white transition-colors">
                  {movie.title}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
