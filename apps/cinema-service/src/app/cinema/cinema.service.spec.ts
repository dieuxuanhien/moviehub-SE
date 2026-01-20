import { Test, TestingModule } from '@nestjs/testing';
import { CinemaService } from './cinema.service';
import { PrismaService } from '../prisma.service';
import { CinemaStatusEnum } from '@movie-hub/shared-types';

describe('CinemaService', () => {
  let service: CinemaService;

  const mockPrismaService = {
    cinemas: {
      findMany: jest.fn(),
    },
  };

  const mockCinemas = [
    {
      id: 'cinema-1',
      name: 'CGV Vincom Center',
      address: '72 Le Thanh Ton, District 1, Ho Chi Minh City',
      city: 'Ho Chi Minh City',
      district: 'District 1',
      phone: '+84-28-3822-3456',
      email: 'cgv.vincom@cinema.com',
      website: 'https://www.cgv.vn',
      latitude: 10.7744,
      longitude: 106.701,
      description: 'Premium cinema experience in the heart of the city',
      amenities: ['IMAX', '3D', 'VIP', 'Parking'],
      facilities: { parking: true, foodCourt: true, wheelchairAccess: true },
      images: ['image1.jpg', 'image2.jpg'],
      virtual_tour_360_url: 'https://tour.cgv.vn/vincom',
      rating: 4.5,
      total_reviews: 1250,
      operating_hours: { open: '09:00', close: '23:00' },
      social_media: { facebook: 'cgv.vietnam', instagram: 'cgv_vietnam' },
      status: 'ACTIVE',
      timezone: 'Asia/Ho_Chi_Minh',
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'cinema-2',
      name: 'Lotte Cinema Landmark 81',
      address: 'Landmark 81, Vinhomes Central Park, Binh Thanh District',
      city: 'Ho Chi Minh City',
      district: 'Binh Thanh',
      phone: '+84-28-3555-7777',
      email: 'lotte.landmark@cinema.com',
      website: 'https://www.lottecinema.com.vn',
      latitude: 10.7956,
      longitude: 106.7217,
      description: 'Luxury cinema experience at Landmark 81',
      amenities: ['4DX', 'IMAX', 'VIP', 'Food Court'],
      facilities: { parking: true, foodCourt: true, vip: true },
      images: ['lotte1.jpg', 'lotte2.jpg'],
      virtual_tour_360_url: 'https://tour.lotte.vn/landmark81',
      rating: 4.7,
      total_reviews: 2100,
      operating_hours: { open: '08:30', close: '23:30' },
      social_media: {
        facebook: 'lotte.cinema.vietnam',
        instagram: 'lottecinema_vn',
      },
      status: 'ACTIVE',
      timezone: 'Asia/Ho_Chi_Minh',
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'cinema-3',
      name: 'Galaxy Cinema Nguyen Du',
      address: '116 Nguyen Du, District 1, Ho Chi Minh City',
      city: 'Ho Chi Minh City',
      district: 'District 1',
      phone: '+84-28-3829-9999',
      email: 'galaxy.nguyendu@cinema.com',
      website: 'https://www.galaxycine.vn',
      latitude: 10.7691,
      longitude: 106.6958,
      description: 'Modern cinema with latest technology',
      amenities: ['Standard', '3D', 'Parking'],
      facilities: { parking: true, snackBar: true },
      images: ['galaxy1.jpg'],
      virtual_tour_360_url: null,
      rating: 4.2,
      total_reviews: 800,
      operating_hours: { open: '09:30', close: '23:00' },
      social_media: { facebook: 'galaxy.cinema.vietnam' },
      status: 'ACTIVE',
      timezone: 'Asia/Ho_Chi_Minh',
      created_at: new Date('2024-01-01T00:00:00Z'),
      updated_at: new Date('2024-01-01T00:00:00Z'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CinemaService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: 'MOVIE_SERVICE',
          useValue: {
            send: jest.fn(),
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CinemaService>(CinemaService);

    // Reset mocks
    mockPrismaService.cinemas.findMany.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCinemas', () => {
    it('should return all cinemas', async () => {
      mockPrismaService.cinemas.findMany.mockResolvedValue(mockCinemas);

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      expect(result.data).toHaveLength(3);
      expect(result.message).toBe('Get all cinemas successfully!');
    });

    it('should return empty array when no cinemas exist', async () => {
      const emptyCinemas = [];
      mockPrismaService.cinemas.findMany.mockResolvedValue(emptyCinemas);

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      expect(result.data).toEqual([]);
      expect(result.data).toHaveLength(0);
    });

    it('should return single cinema when only one exists', async () => {
      const singleCinema = [mockCinemas[0]];
      mockPrismaService.cinemas.findMany.mockResolvedValue(singleCinema);

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('id');
    });

    it('should return cinemas with all expected schema properties', async () => {
      mockPrismaService.cinemas.findMany.mockResolvedValue(mockCinemas);

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('address');
    });

    it('should verify cinema data types and structure', async () => {
      mockPrismaService.cinemas.findMany.mockResolvedValue(mockCinemas);

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);
      const firstCinema = result.data[0];

      expect(typeof firstCinema.id).toBe('string');
      expect(typeof firstCinema.name).toBe('string');
      expect(typeof firstCinema.address).toBe('string');
      expect(typeof firstCinema.city).toBe('string');
      expect(firstCinema).toHaveProperty('totalReviews');
      expect(firstCinema).toHaveProperty('operatingHours');
      expect(firstCinema).toHaveProperty('socialMedia');
      expect(firstCinema).toHaveProperty('createdAt');
      expect(firstCinema).toHaveProperty('updatedAt');
    });

    it('should handle cinemas with different amenities', async () => {
      const cinemasWithDifferentAmenities = [
        {
          ...mockCinemas[0],
          amenities: ['IMAX', '3D', 'VIP'],
        },
        {
          ...mockCinemas[1],
          amenities: ['4DX', 'Standard'],
        },
        {
          ...mockCinemas[2],
          amenities: [],
        },
      ];

      mockPrismaService.cinemas.findMany.mockResolvedValue(
        cinemasWithDifferentAmenities
      );

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      expect(result.data[0].amenities).toContain('IMAX');
      expect(result.data[0].amenities).toContain('3D');
      expect(result.data[0].amenities).toContain('VIP');
      expect(result.data[1].amenities).toContain('4DX');
      expect(result.data[1].amenities).toContain('Standard');
      expect(result.data[2].amenities).toEqual([]);
    });

    it('should handle cinemas from different cities', async () => {
      const cinemasFromDifferentCities = [
        {
          ...mockCinemas[0],
          city: 'Ho Chi Minh City',
          district: 'District 1',
        },
        {
          ...mockCinemas[1],
          city: 'Ha Noi',
          district: 'Ba Dinh',
        },
        {
          ...mockCinemas[2],
          city: 'Da Nang',
          district: 'Hai Chau',
        },
      ];

      mockPrismaService.cinemas.findMany.mockResolvedValue(
        cinemasFromDifferentCities
      );

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      const cities = result.data.map((cinema) => cinema.city);
      expect(cities).toContain('Ho Chi Minh City');
      expect(cities).toContain('Ha Noi');
      expect(cities).toContain('Da Nang');
    });

    it('should handle cinemas with valid coordinates', async () => {
      mockPrismaService.cinemas.findMany.mockResolvedValue(mockCinemas);

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      result.data.forEach((cinema) => {
        expect(cinema.latitude).toBeGreaterThan(-90);
        expect(cinema.latitude).toBeLessThan(90);
        expect(cinema.longitude).toBeGreaterThan(-180);
        expect(cinema.longitude).toBeLessThan(180);
      });
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      mockPrismaService.cinemas.findMany.mockRejectedValue(dbError);

      await expect(service.getAllCinemas(CinemaStatusEnum.ACTIVE)).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should handle null or undefined optional fields gracefully', async () => {
      const cinemasWithNullFields = [
        {
          ...mockCinemas[0],
          email: null,
          website: null,
          description: null,
          virtual_tour_360_url: null,
          rating: null,
          operating_hours: null,
          social_media: null,
        },
      ];

      mockPrismaService.cinemas.findMany.mockResolvedValue(
        cinemasWithNullFields
      );

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toHaveProperty('id');
    });

    it('should handle large datasets efficiently', async () => {
      const largeCinemaDataset = Array.from({ length: 100 }, (_, index) => ({
        ...mockCinemas[0],
        id: `cinema-${index + 1}`,
        name: `Cinema ${index + 1}`,
        address: `Address ${index + 1}`,
      }));

      mockPrismaService.cinemas.findMany.mockResolvedValue(largeCinemaDataset);

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      expect(result.data).toHaveLength(100);
      expect(result.data[0]).toHaveProperty('id');
    });

    it('should maintain data integrity and structure', async () => {
      mockPrismaService.cinemas.findMany.mockResolvedValue(mockCinemas);

      const result = await service.getAllCinemas(CinemaStatusEnum.ACTIVE);

      expect(result.data).toBeDefined();
      expect(result.data).not.toBeNull();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('Error Scenarios', () => {
    it('should propagate database connection errors', async () => {
      const dbError = new Error('Failed to connect to database');
      mockPrismaService.cinemas.findMany.mockRejectedValue(dbError);

      await expect(service.getAllCinemas(CinemaStatusEnum.ACTIVE)).rejects.toThrow(
        'Failed to connect to database'
      );
    });

    it('should handle network timeout errors', async () => {
      const networkError = new Error('Network timeout');
      mockPrismaService.cinemas.findMany.mockRejectedValue(networkError);

      await expect(service.getAllCinemas(CinemaStatusEnum.ACTIVE)).rejects.toThrow('Network timeout');
    });

    it('should handle permission denied errors', async () => {
      const permissionError = new Error('Access denied');
      mockPrismaService.cinemas.findMany.mockRejectedValue(permissionError);

      await expect(service.getAllCinemas(CinemaStatusEnum.ACTIVE)).rejects.toThrow('Access denied');
    });
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have getAllCinemas method', () => {
      expect(service.getAllCinemas).toBeDefined();
      expect(typeof service.getAllCinemas).toBe('function');
    });
  });
});


