import { getSeedPosterUrl, getSeedReleaseData } from './seed-helper';
import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma';

const prisma = new PrismaClient();

const movieIds = {
  dune2: '11111111-1111-1111-1111-111111111111',
  insideOut2: '22222222-2222-2222-2222-222222222222',
  oppenheimer: '33333333-3333-3333-3333-333333333333',
  gxk: '44444444-4444-4444-4444-444444444444',
  // Additional movies for recommendation testing
  interstellar: '55555555-5555-5555-5555-555555555555',
  tenet: '66666666-6666-6666-6666-666666666666',
  coco: '77777777-7777-7777-7777-777777777777',
  conjuring: '88888888-8888-8888-8888-888888888888',
  titanic: '99999999-9999-9999-9999-999999999999',
  avatar: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
};

const releaseIds = {
  dune2: '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  insideOut2: '22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  oppenheimer: '33333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  gxk: '44444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  interstellar: '55555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  tenet: '66666666-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  coco: '77777777-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  conjuring: '88888888-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  titanic: '99999999-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  avatar: 'aaaaaaaa-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
};

async function main() {
  console.log('🌱 Seeding Movie Service database...');

  await prisma.review.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.movieRelease.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();

  const genreNames = [
    'Hành động',
    'Khoa học viễn tưởng',
    'Tâm lý',
    'Hoạt hình',
    'Phiêu lưu',
    'Thảm họa',
    'Chính kịch',
    'Giật gân',
    'Quái vật',
    // Additional genres for testing
    'Kinh dị',
    'Lãng mạn',
    'Gia đình',
  ];

  const genres = await Promise.all(
    genreNames.map((name) => prisma.genre.create({ data: { name } }))
  );

  const genreByName = Object.fromEntries(genres.map((g) => [g.name, g.id]));

  const movies = [
    {
      id: movieIds.dune2,
      releaseId: releaseIds.dune2,
      title: 'Dune: Hành Tinh Cát - Phần Hai',
      originalTitle: 'Dune: Part Two',
      overview:
        'Paul Atreides liên minh với người Fremen để phục thù cho gia tộc, đồng thời đối mặt với lựa chọn giữa tình yêu và sứ mệnh giải phóng Arrakis.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=WayI4O0cZk0',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/AcKVlWaNVVVFQwro3nLXqPljcYA.jpg',
      runtime: 166,
      releaseDate: new Date('2024-02-28'),
      ageRating: AgeRating.T13,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.SUBTITLE,
      director: 'Denis Villeneuve',
      cast: [
        { name: 'Timothée Chalamet', character: 'Paul Atreides' },
        { name: 'Zendaya', character: 'Chani' },
        { name: 'Rebecca Ferguson', character: 'Lady Jessica' },
      ],
      genres: ['Hành động', 'Khoa học viễn tưởng', 'Chính kịch'],
    },
    {
      id: movieIds.insideOut2,
      releaseId: releaseIds.insideOut2,
      title: 'Những Mảnh Ghép Cảm Xúc 2',
      originalTitle: 'Inside Out 2',
      overview:
        'Riley bước vào tuổi thiếu niên với những cảm xúc mới như Lo Âu và Xấu Hổ, khiến thế giới nội tâm của cô bé một lần nữa hỗn loạn.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=MR3CwFNojfQ',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/w13Jg8p7icmPjOJ1rTmlQIP3h5E.jpg',
      runtime: 100,
      releaseDate: new Date('2024-06-14'),
      ageRating: AgeRating.P,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.DUBBED,
      director: 'Kelsey Mann',
      cast: [
        { name: 'Amy Poehler', character: 'Joy (lồng tiếng gốc)' },
        { name: 'Maya Hawke', character: 'Anxiety (lồng tiếng gốc)' },
        { name: 'Ayo Edebiri', character: 'Envy (lồng tiếng gốc)' },
      ],
      genres: ['Hoạt hình', 'Phiêu lưu', 'Chính kịch'],
    },
    {
      id: movieIds.oppenheimer,
      releaseId: releaseIds.oppenheimer,
      title: 'Oppenheimer',
      originalTitle: 'Oppenheimer',
      overview:
        'Chân dung J. Robert Oppenheimer trong cuộc chạy đua chế tạo bom nguyên tử, cùng những giằng xé đạo đức và hệ lụy hậu chiến.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/8Gxv8g8EXXuS1wE3q4PPRyuqX3y.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/jIvdc7HqE0nqnEqMAH0lZVzfCwZ.jpg',
      runtime: 180,
      releaseDate: new Date('2023-07-21'),
      ageRating: AgeRating.T18,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.SUBTITLE,
      director: 'Christopher Nolan',
      cast: [
        { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer' },
        { name: 'Emily Blunt', character: 'Katherine Oppenheimer' },
        { name: 'Robert Downey Jr.', character: 'Lewis Strauss' },
      ],
      genres: ['Chính kịch', 'Tâm lý'],
    },
    {
      id: movieIds.gxk,
      releaseId: releaseIds.gxk,
      title: 'Godzilla x Kong: Đế Chúa & Quái Vật',
      originalTitle: 'Godzilla x Kong: The New Empire',
      overview:
        'Godzilla và Kong hợp lực trước mối đe dọa cổ xưa từ Lòng Trái Đất, hé lộ nguồn gốc của các Titan.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/bQ2ywkchIiaKLSEaMrcT6e29f91.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=sx6ihN32ISQ',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/sRLC052ieEzkQs9dEtPMfFxYkej.jpg',
      runtime: 115,
      releaseDate: new Date('2024-03-29'),
      ageRating: AgeRating.T13,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.SUBTITLE,
      director: 'Adam Wingard',
      cast: [
        { name: 'Rebecca Hall', character: 'Dr. Ilene Andrews' },
        { name: 'Brian Tyree Henry', character: 'Bernie Hayes' },
        { name: 'Dan Stevens', character: 'Trapper' },
      ],
      genres: ['Hành động', 'Quái vật', 'Phiêu lưu'],
    },
    // ========== ADDITIONAL MOVIES FOR RECOMMENDATION TESTING ==========
    {
      id: movieIds.interstellar,
      releaseId: releaseIds.interstellar,
      title: 'Hố Đen Tử Thần',
      originalTitle: 'Interstellar',
      overview:
        'Một nhóm phi hành gia du hành qua lỗ giun trong không gian để tìm ngôi nhà mới cho nhân loại khi Trái Đất sắp diệt vong.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
      runtime: 169,
      releaseDate: new Date('2014-11-07'),
      ageRating: AgeRating.T13,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.SUBTITLE,
      director: 'Christopher Nolan',  // Same as Oppenheimer
      cast: [
        { name: 'Matthew McConaughey', character: 'Cooper' },
        { name: 'Anne Hathaway', character: 'Brand' },
        { name: 'Jessica Chastain', character: 'Murph' },
      ],
      genres: ['Khoa học viễn tưởng', 'Phiêu lưu', 'Chính kịch'],
    },
    {
      id: movieIds.tenet,
      releaseId: releaseIds.tenet,
      title: 'TENET',
      originalTitle: 'Tenet',
      overview:
        'Một đặc vụ CIA được giao nhiệm vụ ngăn chặn Thế chiến III thông qua công nghệ đảo ngược thời gian bí ẩn.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=LdOM0x0XDMo',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/wzJRB4MKi3yK138SqEeDmHn5X0k.jpg',
      runtime: 150,
      releaseDate: new Date('2020-08-26'),
      ageRating: AgeRating.T13,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.SUBTITLE,
      director: 'Christopher Nolan',  // Same as Oppenheimer & Interstellar
      cast: [
        { name: 'John David Washington', character: 'The Protagonist' },
        { name: 'Robert Pattinson', character: 'Neil' },
        { name: 'Elizabeth Debicki', character: 'Kat' },
      ],
      genres: ['Hành động', 'Khoa học viễn tưởng', 'Giật gân'],
    },
    {
      id: movieIds.coco,
      releaseId: releaseIds.coco,
      title: 'Coco: Hội Ngộ Diệu Kỳ',
      originalTitle: 'Coco',
      overview:
        'Cậu bé Miguel theo đuổi giấc mơ âm nhạc và vô tình lạc vào Thế giới người Chết, nơi cậu khám phá bí mật gia đình.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=xlnPHQ3TLX8',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/askg3SMvhqEl4OL52YuvdtY40Yb.jpg',
      runtime: 105,
      releaseDate: new Date('2017-10-27'),
      ageRating: AgeRating.P,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.DUBBED,
      director: 'Lee Unkrich',
      cast: [
        { name: 'Anthony Gonzalez', character: 'Miguel (lồng tiếng gốc)' },
        { name: 'Gael García Bernal', character: 'Héctor (lồng tiếng gốc)' },
        { name: 'Benjamin Bratt', character: 'Ernesto (lồng tiếng gốc)' },
      ],
      genres: ['Hoạt hình', 'Phiêu lưu', 'Gia đình'],
    },
    {
      id: movieIds.conjuring,
      releaseId: releaseIds.conjuring,
      title: 'Ám Ảnh Kinh Hoàng',
      originalTitle: 'The Conjuring',
      overview:
        'Cặp đôi điều tra siêu nhiên Warren giúp một gia đình chống lại thế lực quỷ ám đen tối trong ngôi nhà nông trại.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=k10ETZ41q5o',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/wXsQvli6tWqja6kRtiISd3Q20g6.jpg',
      runtime: 112,
      releaseDate: new Date('2013-07-19'),
      ageRating: AgeRating.T18,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.SUBTITLE,
      director: 'James Wan',
      cast: [
        { name: 'Vera Farmiga', character: 'Lorraine Warren' },
        { name: 'Patrick Wilson', character: 'Ed Warren' },
        { name: 'Lili Taylor', character: 'Carolyn Perron' },
      ],
      genres: ['Kinh dị', 'Giật gân'],
    },
    {
      id: movieIds.titanic,
      releaseId: releaseIds.titanic,
      title: 'Titanic',
      originalTitle: 'Titanic',
      overview:
        'Chuyện tình giữa chàng họa sĩ nghèo Jack và tiểu thư Rose trên con tàu định mệnh Titanic trong chuyến đi bi thảm năm 1912.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOUN.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=kVrqfYjkTdQ',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/yDI6D5ZQh67YU4r2ms8EcBJRpfx.jpg',
      runtime: 194,
      releaseDate: new Date('1997-12-19'),
      ageRating: AgeRating.T13,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.SUBTITLE,
      director: 'James Cameron',  // Same as Avatar
      cast: [
        { name: 'Leonardo DiCaprio', character: 'Jack Dawson' },
        { name: 'Kate Winslet', character: 'Rose DeWitt Bukater' },
        { name: 'Billy Zane', character: 'Cal Hockley' },
      ],
      genres: ['Chính kịch', 'Lãng mạn', 'Thảm họa'],
    },
    {
      id: movieIds.avatar,
      releaseId: releaseIds.avatar,
      title: 'Avatar',
      originalTitle: 'Avatar',
      overview:
        'Một cựu lính thủy đánh bộ bị liệt được gửi đến hành tinh Pandora, nơi anh phải lựa chọn giữa nhiệm vụ và bảo vệ bộ lạc Na\'vi.',
      posterUrl:
        'https://image.tmdb.org/t/p/w500/6EiRUJpuoeQPghrs3YNktfnqOVh.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=5PSNL1qE6VY',
      backdropUrl:
        'https://image.tmdb.org/t/p/original/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg',
      runtime: 162,
      releaseDate: new Date('2009-12-18'),
      ageRating: AgeRating.T13,
      originalLanguage: 'en',
      spokenLanguages: ['vi', 'en'],
      productionCountry: 'Hoa Kỳ',
      languageType: LanguageOption.SUBTITLE,
      director: 'James Cameron',  // Same as Titanic
      cast: [
        { name: 'Sam Worthington', character: 'Jake Sully' },
        { name: 'Zoe Saldana', character: 'Neytiri' },
        { name: 'Sigourney Weaver', character: 'Dr. Grace Augustine' },
      ],
      genres: ['Hành động', 'Phiêu lưu', 'Khoa học viễn tưởng'],
    },
  ];

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

    const releaseStart =
      movieData.title === 'Godzilla x Kong: Đế Chúa & Quái Vật'
        ? new Date('2026-02-10') // Upcoming (Future)
        : new Date('2025-12-20'); // Now Showing (Past)

    const releases = getSeedReleaseData(movieData.title, successCount, new Date(movieData.releaseDate));
      for (const rel of releases) {
        const releases = getSeedReleaseData(movieData.title, successCount, new Date(movieData.releaseDate));
      for (const rel of releases) {
        await prisma.movieRelease.create({
          data: {
            movieId: movie.id,
            startDate: new Date(rel.startDate),
            endDate: rel.endDate ? new Date(rel.endDate) : null,
            note: rel.note,
          },
        });
      }
      }

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
  }

  const reviews = [
    {
      movieId: movieIds.dune2,
      userId: 'user-customer-001',
      rating: 5,
      content:
        'Hình ảnh sa mạc và âm thanh IMAX quá ấn tượng, nhịp phim chặt chẽ hơn phần 1.',
    },
    {
      movieId: movieIds.insideOut2,
      userId: 'user-customer-002',
      rating: 4,
      content:
        'Phim dễ thương, thông điệp lớn lên tinh tế và lồng tiếng Việt nghe ổn.',
    },
    // Additional reviews for testing hybrid scoring
    {
      movieId: movieIds.oppenheimer,
      userId: 'user-customer-001',
      rating: 5,
      content: 'Siêu phẩm của Nolan, diễn xuất của Cillian Murphy xuất sắc.',
    },
    {
      movieId: movieIds.oppenheimer,
      userId: 'user-customer-003',
      rating: 4,
      content: 'Kịch bản chặt chẽ, hình ảnh đẹp, hơi dài nhưng đáng xem.',
    },
    {
      movieId: movieIds.interstellar,
      userId: 'user-customer-001',
      rating: 5,
      content: 'Phim khoa học viễn tưởng hay nhất mọi thời đại, xem đi xem lại vẫn hay.',
    },
    {
      movieId: movieIds.interstellar,
      userId: 'user-customer-002',
      rating: 5,
      content: 'Nhạc phim Hans Zimmer quá tuyệt vời, kết thúc cảm động.',
    },
    {
      movieId: movieIds.tenet,
      userId: 'user-customer-003',
      rating: 3,
      content: 'Khá khó hiểu, cần xem nhiều lần mới hiểu hết.',
    },
    {
      movieId: movieIds.coco,
      userId: 'user-customer-002',
      rating: 5,
      content: 'Cảm động không thể chịu nổi, Pixar làm quá tốt về gia đình.',
    },
    {
      movieId: movieIds.conjuring,
      userId: 'user-customer-003',
      rating: 4,
      content: 'Kinh dị ám ảnh, diễn viên đóng rất tốt.',
    },
    {
      movieId: movieIds.titanic,
      userId: 'user-customer-001',
      rating: 5,
      content: 'Kinh điển không bao giờ lỗi mốt, xem bao nhiêu lần vẫn khóc.',
    },
    {
      movieId: movieIds.avatar,
      userId: 'user-customer-002',
      rating: 4,
      content: 'Hình ảnh 3D đẹp mãn nhãn, thế giới Pandora tuyệt vời.',
    },
    // Note: GxK has no reviews (cold-start test case)
  ];

  await prisma.review.createMany({ data: reviews });

  console.log(
    '✅ Seeded genres, movies, releases, và đánh giá bằng dữ liệu TMDB (tiếng Việt)'
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
