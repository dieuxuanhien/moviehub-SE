'use client';

import 'swiper/css';
import 'swiper/css/navigation';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@movie-hub/shacdn-ui/carousel';
import { BlurCircle } from '@/components/blur-circle';
import { useGetRecommendations } from '@/hooks/movie-hooks';
import { Sparkles, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ErrorFallback } from '@/components/error-fallback';
import { Skeleton } from '@movie-hub/shacdn-ui/skeleton';
import { useState, useCallback } from 'react';

// Example suggestions for placeholder
const PLACEHOLDER_SUGGESTIONS = [
  'phim hành động hay',
  'phim tình cảm lãng mạn',
  'phim khoa học viễn tưởng',
  'phim kinh dị rùng rợn',
  'phim hoạt hình vui nhộn',
  'phim chiến tranh lịch sử',
];

export default function RecommendationsSection() {
  const [searchInput, setSearchInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  
  // Only fetch when user has submitted a query
  const { data, isLoading, isError, error, isFetching } = useGetRecommendations(
    submittedQuery,
    12
  );

  const movies = data?.movies || [];

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim().length >= 2) {
      setSubmittedQuery(searchInput.trim());
    }
  }, [searchInput]);

  // Random placeholder from suggestions
  const [placeholderIndex] = useState(() => 
    Math.floor(Math.random() * PLACEHOLDER_SUGGESTIONS.length)
  );

  return (
    <div className="px-6">
      <div className="relative flex flex-col gap-6 pt-20 pb-6">
        <BlurCircle top="0" left="-80px" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-2xl md:text-[32px] font-bold text-white uppercase tracking-wider relative z-10 border-l-4 border-yellow-400 pl-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            AI Gợi ý phim
          </p>
        </div>

        {/* Search Input with Submit Button */}
        <form onSubmit={handleSubmit} className="relative z-10 max-w-2xl">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                placeholder={`Ví dụ: "${PLACEHOLDER_SUGGESTIONS[placeholderIndex]}"`}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 
                           rounded-xl text-white placeholder:text-white/40 
                           focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50
                           transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={searchInput.trim().length < 2 || isFetching}
              className="px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium 
                         rounded-xl hover:from-yellow-400 hover:to-orange-400 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
            >
              {isFetching ? (
                <span className="animate-pulse">Đang tìm...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Tìm kiếm
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-sm text-white/50">
            💡 Nhập mô tả và nhấn Tìm kiếm, AI sẽ mở rộng ý tưởng của bạn để tìm phim phù hợp nhất
          </p>
        </form>

        {/* Search result indicator */}
        {submittedQuery && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white/70">
              <span>Kết quả cho:</span>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium">
                &quot;{submittedQuery}&quot;
              </span>
            </div>
            {/* Show enriched query if available */}
            {data?.enrichedQuery && (
              <div className="flex items-start gap-2 text-white/50 text-sm">
                <span className="shrink-0">🔮 AI hiểu:</span>
                <span className="italic line-clamp-2">{data.enrichedQuery}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Movie Carousel - Only show when user has submitted */}
      {submittedQuery ? (
        <Carousel className="w-full">
          <CarouselContent className="m-0">
            {isError ? (
              <div className="w-full flex justify-center py-10">
                <ErrorFallback message={error?.message || 'Không thể tải gợi ý'} />
              </div>
            ) : isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="basis-1/2 md:basis-1/3 lg:basis-1/6 p-2">
                  <div className="flex flex-col gap-3">
                    <Skeleton className="aspect-[2/3] rounded-lg" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </div>
                </CarouselItem>
              ))
            ) : movies.length === 0 ? (
              <div className="text-center py-10 text-gray-500 flex items-center justify-center w-full">
                🎬 Không tìm thấy phim phù hợp với &quot;{submittedQuery}&quot;. Thử mô tả khác nhé!
              </div>
            ) : (
              movies.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/6 p-2"
                >
                  <Link
                    href={`/movies/${movie.id}`}
                    className="group flex flex-col gap-3 transition-transform hover:scale-105"
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-lg aspect-[2/3]">
                      <Image
                        src={
                          movie.posterUrl && !movie.posterUrl.includes('placeholder')
                            ? movie.posterUrl
                            : '/images/placeholder.png'
                        }
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:brightness-110 transition-all duration-300"
                      />
                      
                      {/* Score badge */}
                      {movie.similarity > 0.7 && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                          🔥 Hot
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <span className="text-white text-sm font-medium">Xem chi tiết →</span>
                      </div>
                    </div>
                    
                    <p className="text-neutral-300 font-medium text-sm line-clamp-2 group-hover:text-white transition-colors">
                      {movie.title}
                    </p>
                  </Link>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        /* Initial state - encourage user to search */
        <div className="text-center py-16 text-white/50">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-400/50" />
          <p className="text-lg">Nhập mô tả và nhấn Tìm kiếm</p>
          <p className="text-sm mt-2">AI sẽ mở rộng ý tưởng của bạn để tìm phim phù hợp nhất</p>
        </div>
      )}
    </div>
  );
}
