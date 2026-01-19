import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma';

const prisma = new PrismaClient();

// Synthetic data to generate 200+ diverse movies
const directors = [
  'Christopher Nolan', 'James Cameron', 'Denis Villeneuve', 'Quentin Tarantino',
  'Martin Scorsese', 'Steven Spielberg', 'David Fincher', 'Ridley Scott',
  'Peter Jackson', 'Bong Joon-ho', 'Nguyễn Quang Dũng', 'Victor Vũ',
  'Jordan Peele', 'Greta Gerwig', 'Chloe Zhao', 'Lee Isaac Chung',
  'Trần Anh Hùng', 'Đặng Nhật Minh', 'Charlie Nguyễn', 'Phan Đăng Di',
];

const actors = [
  'Leonardo DiCaprio', 'Tom Hanks', 'Margot Robbie', 'Scarlett Johansson',
  'Robert Downey Jr.', 'Ryan Gosling', 'Brad Pitt', 'Meryl Streep',
  'Cate Blanchett', 'Christian Bale', 'Timothée Chalamet', 'Zendaya',
  'Song Kang-ho', 'Park Seo-joon', 'Ngô Thanh Vân', 'Ninh Dương Lan Ngọc',
  'Trấn Thành', 'Thu Trang', 'Hồng Đào', 'Kiều Minh Tuấn',
];

const genreNames = [
  'Hành động', 'Khoa học viễn tưởng', 'Tâm lý', 'Hoạt hình', 'Phiêu lưu',
  'Thảm họa', 'Chính kịch', 'Giật gân', 'Quái vật', 'Kinh dị', 'Lãng mạn',
  'Gia đình', 'Hài', 'Tội phạm', 'Bí ẩn', 'Chiến tranh', 'Lịch sử',
  'Âm nhạc', 'Thể thao', 'Tài liệu',
];

const movieTitles = [
  // Sci-Fi
  ['Vùng Đất Mới', 'Tương Lai Xa Xôi', 'Hành Tinh X', 'Công Nghệ Bí Ẩn', 'Robot Nổi Loạn'],
  // Action  
  ['Nhiệm Vụ Cuối', 'Đặc Vụ Bóng Đêm', 'Chiến Binh Cổ Đại', 'Cuộc Trốn Chạy', 'Phục Kích'],
  // Drama
  ['Ký Ức Phai Mờ', 'Nỗi Đau Thương', 'Hành Trình Của Mẹ', 'Giấc Mơ Xa Vời', 'Tình Yêu Đầu'],
  // Horror
  ['Bóng Ma Trở Về', 'Căn Nhà Ma Ám', 'Đêm Kinh Hoàng', 'Lời Nguyền Cổ Xưa', 'Thực Thể'],
  // Comedy
  ['Cười Thả Ga', 'Gia Đình Hài Hước', 'Công Sở Điên Đảo', 'Chuyến Du Lịch Vui Nhộn', 'Hài Triệu View'],
  // Animation
  ['Vương Quốc Kỳ Diệu', 'Chú Gấu Phiêu Lưu', 'Thế Giới Thần Tiên', 'Cuộc Hành Trình', 'Những Người Bạn'],
];

const overviews = [
  'Một câu chuyện cảm động về tình yêu và hy sinh.',
  'Hành trình phiêu lưu đầy kịch tính qua nhiều thử thách.',
  'Cuộc chiến sinh tồn căng thẳng đến nghẹt thở.',
  'Bí ẩn được hé lộ dần trong mạch phim hấp dẫn.',
  'Câu chuyện về gia đình, tình bạn và những giá trị đẹp.',
  'Phim hành động mãn nhãn với những pha hành động đỉnh cao.',
  'Thế giới tương lai với công nghệ tiên tiến.',
  'Hành trình tìm kiếm bản thân qua nhiều biến cố.',
];

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function generateMovie(index: number) {
  const titleCategory = movieTitles[index % movieTitles.length];
  const baseTitle = titleCategory[index % titleCategory.length];
  const title = index < 30 ? baseTitle : `${baseTitle} ${Math.floor(index / 30) + 1}`;
  
  const director = directors[index % directors.length];
  const genres = pickRandomN(genreNames, 2 + Math.floor(Math.random() * 2));
  const cast = pickRandomN(actors, 3).map((name, i) => ({
    name,
    character: `Nhân vật ${i + 1}`,
  }));
  
  const year = 2015 + Math.floor(Math.random() * 10);
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  
  const ageRatings = [AgeRating.P, AgeRating.T13, AgeRating.T16, AgeRating.T18];
  const langOptions = [LanguageOption.SUBTITLE, LanguageOption.DUBBED];
  
  return {
    id: generateUUID(),
    releaseId: generateUUID(),
    title,
    originalTitle: `Original ${title}`,
    overview: pickRandom(overviews),
    posterUrl: `https://via.placeholder.com/500x750?text=${encodeURIComponent(title)}`,
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    backdropUrl: `https://via.placeholder.com/1920x1080?text=${encodeURIComponent(title)}`,
    runtime: 90 + Math.floor(Math.random() * 90),
    releaseDate: new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`),
    ageRating: pickRandom(ageRatings),
    originalLanguage: Math.random() > 0.3 ? 'en' : 'vi',
    spokenLanguages: ['vi', 'en'],
    productionCountry: Math.random() > 0.3 ? 'Hoa Kỳ' : 'Việt Nam',
    languageType: pickRandom(langOptions),
    director,
    cast,
    genres,
  };
}

function generateReviews(movieId: string, count: number) {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      movieId,
      userId: `user-customer-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      rating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
      content: pickRandom([
        'Phim hay, đáng xem!',
        'Kịch bản tốt, diễn viên đóng xuất sắc.',
        'Hình ảnh đẹp, âm thanh tốt.',
        'Phim khá ổn, đáng để giải trí.',
        'Tuyệt vời, nên xem ngay!',
      ]),
    });
  }
  return reviews;
}

async function main() {
  console.log('🌱 Seeding Movie Service database with 200+ movies...');

  // Clean up
  await prisma.review.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.movieRelease.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();

  // Create genres
  const genres = await Promise.all(
    genreNames.map((name) => prisma.genre.create({ data: { name } }))
  );
  const genreByName = Object.fromEntries(genres.map((g) => [g.name, g.id]));
  console.log(`✅ Created ${genres.length} genres`);

  // Generate 200 movies
  const movies = Array.from({ length: 200 }, (_, i) => generateMovie(i));
  console.log(`📽️ Generating ${movies.length} movies...`);

  let allReviews: any[] = [];
  
  for (const movieData of movies) {
    const movie = await prisma.movie.create({
      data: {
        id: movieData.id,
        title: movieData.title,
        originalTitle: movieData.originalTitle,
        overview: movieData.overview,
        posterUrl: movieData.posterUrl,
        trailerUrl: movieData.trailerUrl,
        backdropUrl: movieData.backdropUrl,
        runtime: movieData.runtime,
        releaseDate: movieData.releaseDate,
        ageRating: movieData.ageRating,
        originalLanguage: movieData.originalLanguage,
        spokenLanguages: movieData.spokenLanguages,
        productionCountry: movieData.productionCountry,
        languageType: movieData.languageType,
        director: movieData.director,
        cast: movieData.cast,
      },
    });

    await prisma.movieRelease.create({
      data: {
        id: movieData.releaseId,
        movieId: movie.id,
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-03-01'),
        note: 'Lịch chiếu mùa Tết 2026',
      },
    });

    await Promise.all(
      movieData.genres.map((name) =>
        prisma.movieGenre.create({
          data: {
            movieId: movie.id,
            genreId: genreByName[name],
          },
        })
      )
    );

    // Generate 0-5 reviews per movie (some movies have no reviews for cold-start testing)
    const reviewCount = Math.floor(Math.random() * 6);
    allReviews = allReviews.concat(generateReviews(movie.id, reviewCount));
  }

  // Insert all reviews
  if (allReviews.length > 0) {
    await prisma.review.createMany({ data: allReviews });
  }
  
  console.log(`✅ Created ${movies.length} movies`);
  console.log(`✅ Created ${allReviews.length} reviews`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
