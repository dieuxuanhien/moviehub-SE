'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  Film,
  Calendar as CalendarIcon,
  Building2,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@movie-hub/shacdn-ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@movie-hub/shacdn-ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@movie-hub/shacdn-ui/select';
import { Calendar } from '@movie-hub/shacdn-ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@movie-hub/shacdn-ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@movie-hub/shacdn-ui/tabs';
import { Badge } from '@movie-hub/shacdn-ui/badge';
import type { Cinema, Movie } from '@/libs/api/types';
import { cinemasApi, moviesApi } from '@/libs/api/services';
import {
  getRevenueReport,
  getTopMovies,
  getTopCinemas,
  type RevenueReportDto,
  type TopMovieDto,
  type TopCinemaDto,
} from '@/libs/api/dashboard-api';

export default function ReportsPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedCinema, setSelectedCinema] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [revenueReport, setRevenueReport] = useState<RevenueReportDto | null>(
    null
  );
  const [topMovies, setTopMovies] = useState<TopMovieDto[]>([]);
  const [topCinemas, setTopCinemas] = useState<TopCinemaDto[]>([]);

  // Fetch static data (cinemas, movies) once
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [cinemasRes, moviesRes] = await Promise.all([
          cinemasApi.getAll(),
          moviesApi.getAll(),
        ]);
        setCinemas(cinemasRes || []);
        setMovies(moviesRes || []);
      } catch (err) {
        console.error('Failed to fetch static data:', err);
      }
    };
    fetchStaticData();
  }, []);

  // RBAC State - use Clerk metadata directly
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role as string | undefined;
  const userCinemaId = user?.publicMetadata?.cinemaId as string | undefined;
  const isManager = userRole === 'CINEMA_MANAGER';

  // Filter cinemas for managers - only show their assigned cinema
  const filteredCinemas =
    isManager && userCinemaId
      ? cinemas.filter((c) => c.id === userCinemaId)
      : cinemas;

  // Auto-initialize selectedCinema for managers (lock to their cinema)
  useEffect(() => {
    if (isManager && userCinemaId && selectedCinema === 'all') {
      setSelectedCinema(userCinemaId);
    }
  }, [isManager, userCinemaId, selectedCinema]);

  // Fetch report data based on date range & cinema
  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      // Format dates for API (YYYY-MM-DD format)
      const startDate = format(dateRange.from, 'yyyy-MM-dd');
      const endDate = format(dateRange.to, 'yyyy-MM-dd');
      const cinemaId = selectedCinema === 'all' ? undefined : selectedCinema;

      const [revenueRes, topMoviesRes, topCinemasRes] = await Promise.all([
        getRevenueReport({
          startDate,
          endDate,
          groupBy: 'day',
          cinemaId, // Filter revenue by cinema
        }),
        getTopMovies(5, cinemaId, startDate, endDate), // Filter movies by cinema
        getTopCinemas(5, undefined, startDate, endDate), // Don't filter cinemas - always show all for comparison
      ]);

      setRevenueReport(revenueRes);
      setTopMovies(topMoviesRes || []);
      setTopCinemas(topCinemasRes || []);
    } catch (err) {
      console.error('Failed to fetch report data:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange.from, dateRange.to, selectedCinema]);

  // Fetch report data when date range changes
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleRefresh = () => {
    fetchReportData();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const totalRevenue = revenueReport?.totalRevenue ?? 0;
  const totalTickets = revenueReport?.bookingCount ?? 0;
  const avgOccupancy =
    topCinemas.length > 0
      ? Math.round(
          topCinemas.reduce((acc, c) => acc + c.occupancyRate, 0) /
            topCinemas.length
        )
      : 0;

  const revenueChartData = (revenueReport?.revenueByPeriod || []).map((p) => ({
    date: new Date(p.period).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    }),
    revenue: p.revenue,
    tickets: p.bookingCount,
    avgPrice: p.bookingCount > 0 ? p.revenue / p.bookingCount : 0,
  }));

  const moviePerformance = topMovies.map((m) => ({
    name: m.title.length > 15 ? m.title.substring(0, 15) + '...' : m.title,
    revenue: m.totalRevenue,
    tickets: m.totalBookings,
  }));

  const cinemaPerformance = topCinemas.map((c) => ({
    name: c.name,
    revenue: c.totalRevenue,
    occupancy: Math.round(c.occupancyRate),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            Báo Cáo & Phân Tích
          </h1>
          <p className="text-gray-500 mt-1">
            Thông tin chi tiết về hoạt động của rạp chiếu phim
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Làm Mới
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Tải Xuống
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <Select
                  value={selectedCinema}
                  onValueChange={setSelectedCinema}
                  disabled={isManager}
                >
                  <SelectTrigger
                    className={`w-48 ${
                      isManager ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <SelectValue placeholder="Chọn rạp" />
                  </SelectTrigger>
                  <SelectContent>
                    {!isManager && (
                      <SelectItem value="all">Tất Cả Rạp</SelectItem>
                    )}
                    {filteredCinemas.map((cinema) => (
                      <SelectItem key={cinema.id} value={cinema.id}>
                        {cinema.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-64 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from && dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                          {format(dateRange.to, 'dd/MM/yyyy')}
                        </>
                      ) : (
                        <span>Chọn khoảng thời gian</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange({ from: range.from, to: range.to });
                        }
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              💡 Lọc theo rạp áp dụng cho <strong>Doanh Thu</strong> và <strong>Phim</strong>. Tab <strong>Rạp</strong> luôn hiển thị tất cả để so sánh hiệu suất.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Doanh Thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Trong khoảng thời gian đã chọn
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vé Đã Bán</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalTickets)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Tổng vé đã bán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lượng Lấp Đầy Trung Bình
            </CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOccupancy}%</div>
            <p className="text-xs text-gray-500 mt-2">
              Trung bình các rạp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Phim Đang Chiếu
            </CardTitle>
            <Film className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{movies.length}</div>
            <div className="flex items-center text-xs text-gray-500">
              Đang chiếu hiện tại
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Reports Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">Doanh Thu</TabsTrigger>
          <TabsTrigger value="movies">Phim</TabsTrigger>
          <TabsTrigger value="cinemas">Rạp</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Xu Hướng Doanh Thu</CardTitle>
              <CardDescription>
                Doanh thu hàng ngày trong khoảng thời gian đã chọn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(0)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Ngày: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Movies Tab */}
        <TabsContent value="movies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phim Có Hiệu Suất Tốt Nhất</CardTitle>
              <CardDescription>
                Xếp hạng theo doanh thu trong khoảng thời gian đã chọn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moviePerformance.map((movie, index) => (
                  <div
                    key={movie.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                            ? 'bg-gray-400'
                            : index === 2
                            ? 'bg-amber-600'
                            : 'bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{movie.name}</h4>
                        <p className="text-sm text-gray-500">
                          {formatNumber(movie.tickets)} vé đã bán
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">
                        {formatCurrency(movie.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cinemas Tab */}
        <TabsContent value="cinemas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hiệu Suất Rạp</CardTitle>
              <CardDescription>
                Doanh thu và lượng lấp đầy theo vị trí
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cinemaPerformance.map((cinema) => (
                  <div
                    key={cinema.name}
                    className="p-4 rounded-lg border hover:border-purple-200 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{cinema.name}</h4>
                      <Badge className="bg-green-100 text-green-700">
                        {cinema.occupancy}% lấp đầy
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Doanh thu:</span>{' '}
                      <span className="font-medium">
                        {formatCurrency(cinema.revenue)}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${cinema.occupancy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
