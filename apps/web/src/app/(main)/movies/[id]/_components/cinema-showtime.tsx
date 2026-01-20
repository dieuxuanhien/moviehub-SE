'use client';
import { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { CinemaLocationResponse } from '@/libs/types/cinema.type';
import { useGetMovieShowtimesAtCinema } from '@/hooks/cinema-hooks';
import { Skeleton } from '@movie-hub/shacdn-ui/skeleton';
import { formatShowtimeTime, isShowtimePassed } from '@/libs/utils/timezone';

interface CinemaShowtimeProps {
  movieId: string;
  cinema: CinemaLocationResponse;
  selectedDate: string; // YYYY-MM-DD
  onSelectShowtime: (showtimeId: string) => void;
  selectedShowtime: string | null;
}

export const CinemaShowtime = ({
  movieId,
  cinema,
  selectedDate,
  onSelectShowtime,
  selectedShowtime,
}: CinemaShowtimeProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Query showtimes theo ngày
  const { data: showtimes, isLoading } = useGetMovieShowtimesAtCinema(
    cinema.id,
    movieId,
    { date: selectedDate }
  );

  const handleClick = (showtimeId: string) => {
    onSelectShowtime(showtimeId);
  };

  // 🔹 Group showtimes by format
  const groupedShowtimes = useMemo(() => {
    if (!showtimes) return {};
    return showtimes.reduce((acc, s) => {
      const key = s.format; // hoặc s.format nếu có
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {} as Record<string, typeof showtimes>);
  }, [showtimes]);

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-200/20 text-white rounded-xl overflow-hidden transition-all w-full shadow-lg hover:shadow-xl">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-200/10 transition-colors w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p className="text-white font-bold text-xl mb-1">{cinema.name}</p>
          <p className="text-sm text-slate-300">{cinema.address}</p>
        </div>
        {isOpen ? (
          <ChevronUpIcon className="text-slate-300 w-6 h-6" />
        ) : (
          <ChevronDownIcon className="text-slate-300 w-6 h-6" />
        )}
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-5 border-t border-slate-200/20 space-y-6 bg-slate-900/20">
          {isLoading ? (
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-20 rounded-lg bg-slate-200/10"
                />
              ))}
            </div>
          ) : !showtimes || showtimes.length === 0 ? (
            <p className="text-center text-neutral-400 py-4">Không có suất chiếu nào</p>
          ) : (
            Object.entries(groupedShowtimes).map(([format, times]) => (
              <div key={format} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                  <p className="font-bold text-primary text-sm uppercase tracking-wider px-3 py-1 bg-primary/10 rounded-full border border-primary/30">
                    {format}
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent"></div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {times.map((s) => {
                    const disabled = isShowtimePassed(s.startTime);

                    return (
                      <button
                        key={s.id}
                        onClick={() => !disabled && s.id && handleClick(s.id)}
                        disabled={disabled}
                        className={`border rounded-lg px-5 py-2.5 font-semibold text-base transition-all min-w-[80px] ${
                          disabled
                            ? 'text-gray-400 bg-neutral-700/50 border-neutral-600/50 cursor-not-allowed line-through'
                            : selectedShowtime === s.id
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/50 scale-105'
                            : 'text-white bg-slate-700/50 border-slate-500/50 hover:bg-primary/80 hover:text-white hover:border-primary hover:shadow-md hover:scale-105 hover:shadow-primary/30'
                        }`}
                      >
                        {formatShowtimeTime(s.startTime)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

CinemaShowtime.Skeleton = function CinemaShowtimeSkeleton() {
  return (
    <div className="p-4 border-t border-slate-200/10 space-y-5">
      {/* Tiêu đề phòng chiếu */}
      <Skeleton className="h-4 w-32 rounded bg-slate-200/10" />
      {/* Các nút giờ chiếu giả lập */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 rounded-md bg-slate-200/10" />
        ))}
      </div>
    </div>
  );
};
