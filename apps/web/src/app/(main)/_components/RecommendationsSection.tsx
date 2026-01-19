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
import { Sparkles, TrendingUp, Heart, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ErrorFallback } from '@/components/error-fallback';
import { Skeleton } from '@movie-hub/shacdn-ui/skeleton';
import { useState } from 'react';

// Popular recommendation queries with icons
const RECOMMENDATION_QUERIES = [
  { query: 'phim hành động hay nhất', label: 'Hành Động', icon: Zap },
  { query: 'phim tình cảm lãng mạn', label: 'Tình Cảm', icon: Heart },
  { query: 'phim khoa học viễn tưởng', label: 'Sci-Fi', icon: Sparkles },
  { query: 'phim kinh dị', label: 'Kinh Dị', icon: TrendingUp },
];

export default function RecommendationsSection() {
  const [selectedQuery, setSelectedQuery] = useState(RECOMMENDATION_QUERIES[0]);
  
  const { data, isLoading, isError, error } = useGetRecommendations(
    selectedQuery.query,
    12
  );

  const movies = data?.data?.movies || [];

  return (
    <div className="px-6">
      <div className="relative flex flex-col gap-6 pt-20 pb-6">
        <BlurCircle top="0" left="-80px" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-2xl md:text-[32px] font-bold text-white uppercase tracking-wider relative z-10 border-l-4 border-yellow-400 pl-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            Gợi ý cho bạn
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 relative z-10">
          {RECOMMENDATION_QUERIES.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedQuery.query === item.query;
            return (
              <button
                key={item.query}
                onClick={() => setSelectedQuery(item)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all
                  ${isSelected 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-orange-500/30' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Movie Carousel */}
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
              🎬 Không tìm thấy gợi ý phù hợp.
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
    </div>
  );
}
