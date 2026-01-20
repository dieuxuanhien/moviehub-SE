'use client';
import { Button } from '@movie-hub/shacdn-ui/button';
import { Skeleton } from '@movie-hub/shacdn-ui/skeleton';
import { GenreResponse, MovieDetailResponse } from '@movie-hub/shared-types';
import {
  CalendarDays,
  Clock,
  FileTextIcon,
  Film,
  Globe2,
  Heart,
  PlayCircleIcon,
  User2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BlurCircle } from '../../../../../components/blur-circle';
import { useGetMovieDetail } from '@/hooks/movie-hooks';
import { ErrorFallback } from '@/components/error-fallback';
import { useTrailerModal } from '@/stores/trailer-modal-store';

export const MovieHeader = ({ movieId }: { movieId: string }) => {
  const { data, isLoading, isError, error } = useGetMovieDetail(movieId);
  const movieData: MovieDetailResponse | undefined = data?.data;

  const formattedDate = movieData?.releaseDate
    ? new Date(movieData?.releaseDate).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Chưa rõ ngày phát hành';

  const { openModal } = useTrailerModal();

  return (
    <>
      {isLoading ? (
        <MovieHeader.Skeleton />
      ) : isError || !movieData ? (
        <ErrorFallback message={error?.message} />
      ) : (
        <div className="relative flex flex-col flex-wrap md:flex-row items-center gap-8 aspect-video rounded-2xl overflow-hidden">
          {/* Backdrop with multiple layers for depth */}
          {movieData?.backdropUrl && movieData?.backdropUrl.trim() !== '' ? (
            <>
              {/* Main backdrop image */}
              <Image
                src={movieData.backdropUrl}
                alt={movieData.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              {/* Gradient overlays for better readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            </>
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-6 md:px-12 py-8">
            <div className="relative group">
              <Image
                width={288}
                height={416}
                src={
                  movieData.posterUrl && movieData.posterUrl.trim() !== ''
                    ? movieData.posterUrl
                    : '/images/placeholder-bg.png'
                }
                alt={movieData.title}
                className="rounded-xl h-[416px] w-[288px] object-cover shadow-2xl shadow-black/50 ring-2 ring-white/10 transition-transform group-hover:scale-105 duration-300"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="flex flex-1 flex-col gap-3 text-white max-w-2xl">
              {/* Language, Rating, Country badges */}
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold">
                  {movieData.languageType}
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground font-semibold">
                  {movieData.ageRating}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold">
                  {movieData.productionCountry}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                {movieData.title}
              </h1>
              {movieData.originalTitle && (
                <p className="text-gray-300 italic text-lg drop-shadow">
                  ({movieData.originalTitle})
                </p>
              )}

              {/* <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-rose-600 fill-rose-500" />
                <span>{mo</span>
              </div> */}

              <div className="flex items-start gap-3 mt-2 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10">
                <FileTextIcon className="w-5 h-5 flex-shrink-0 text-primary mt-0.5" />
                <p className="text-sm text-gray-200 leading-relaxed">{movieData.overview}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div className="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/5">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-gray-200">{movieData.runtime} phút</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/5">
                  <CalendarDays className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-gray-200">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/5">
                  <User2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-gray-200 truncate">{movieData.director}</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/5">
                  <Globe2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-gray-200 truncate">
                    {movieData.spokenLanguages?.length
                      ? movieData.spokenLanguages.join(', ')
                      : 'Không có thông tin'}
                    {movieData.originalLanguage &&
                      ` (${movieData.originalLanguage.toUpperCase()})`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 mt-2">
                <Film className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-gray-200">
                  {movieData.genre?.length
                    ? movieData.genre
                        .map((g: GenreResponse) => g.name)
                        .join(' • ')
                    : 'Chưa có thể loại'}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
                  onClick={() => {
                    if (movieData.trailerUrl) {
                      openModal(movieData.trailerUrl);
                    }
                  }}
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  {movieData.trailerUrl ? 'Xem Trailer' : 'Trailer chưa có'}
                </Button>

                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50">
                  <Link
                    href="#dateSelect"
                    className="px-8 py-2 text-sm font-semibold"
                  >
                    Mua vé
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

MovieHeader.Skeleton = function MovieHeaderSkeleton() {
  return (
    <div className="flex flex-col w-full flex-wrap md:flex-row items-center gap-8 mx-auto aspect-video rounded-2xl relative overflow-hidden bg-gray-900">
      {/* Overlay tối */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

      {/* Nội dung */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-6 md:px-12 py-8 w-full">
        {/* Poster Skeleton */}
        <Skeleton className="rounded-xl h-[416px] w-[288px]" />

        {/* Info skeleton */}
        <div className="flex flex-1 flex-col gap-3 text-white max-w-2xl">
          <BlurCircle top="-100px" left="-100px" />

          {/* Sub info row */}
          <div className="flex items-center gap-2 text-sm font-bold">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Title + original title */}
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Overview */}
          <Skeleton className="h-20 w-full mt-3" />

          {/* Grid info */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          {/* Genres */}
          <Skeleton className="h-4 w-1/2 mt-3" />

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-4">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
