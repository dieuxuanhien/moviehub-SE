import { getSeedPosterUrl, getSeedTrailerUrl, getSeedReleaseData } from './seed-helper';
import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma';

const prisma = new PrismaClient();

/**
 * SEED-EXTRA: 20 Additional Movies to reach 300 total
 * Replaces skipped duplicates + fills gaps
 */

const movieData = [
  // === ACTION/ADVENTURE 2020-2024 ===
  {
    title: 'The Suicide Squad (2021)',
    originalTitle: 'The Suicide Squad (2021)',
    overview: 'Đội Task Force X được gửi đến đảo quốc Nam Mỹ để phá hủy phòng thí nghiệm chứa thí nghiệm Starfish khổng lồ.',
    runtime: 132,
    releaseDate: '2021-08-06',
    ageRating: AgeRating.T18,
    director: 'James Gunn',
    cast: ['Margot Robbie', 'Idris Elba', 'John Cena', 'Viola Davis'],
    genres: ['Hành động', 'Hài hước'],
  },
  {
    title: 'Knives Out - Kẻ Đâm Lén',
    originalTitle: 'Knives Out',
    overview: 'Thám tử điều tra vụ chết bí ẩn của tiểu thuyết gia giàu có trong gia đình đầy bí mật.',
    runtime: 130,
    releaseDate: '2019-11-27',
    ageRating: AgeRating.T13,
    director: 'Rian Johnson',
    cast: ['Daniel Craig', 'Chris Evans', 'Ana de Armas', 'Jamie Lee Curtis'],
    genres: ['Bí ẩn', 'Hài hước', 'Tội phạm'],
  },
  {
    title: 'Free Guy - Người Hùng Game',
    originalTitle: 'Free Guy',
    overview: 'Nhân vật NPC trong game phát hiện mình sống trong video game và quyết định trở thành anh hùng.',
    runtime: 115,
    releaseDate: '2021-08-13',
    ageRating: AgeRating.T13,
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Jodie Comer', 'Taika Waititi', 'Joe Keery'],
    genres: ['Hành động', 'Hài hước', 'Khoa học viễn tưởng'],
  },
  {
    title: 'Jungle Cruise - Truy Tìm Kho Báu',
    originalTitle: 'Jungle Cruise',
    overview: 'Thuyền trưởng đưa chị em nhà khoa học vào rừng Amazon tìm cây chữa bệnh huyền thoại.',
    runtime: 127,
    releaseDate: '2021-07-30',
    ageRating: AgeRating.T13,
    director: 'Jaume Collet-Serra',
    cast: ['Dwayne Johnson', 'Emily Blunt', 'Edgar Ramírez', 'Jack Whitehall'],
    genres: ['Phiêu lưu', 'Hài hước'],
  },
  {
    title: 'Ambulance - Cuộc Đào Thoát',
    originalTitle: 'Ambulance',
    overview: 'Hai anh em cướp ngân hàng và chiếm xe cứu thương để chạy trốn khắp Los Angeles.',
    runtime: 136,
    releaseDate: '2022-04-08',
    ageRating: AgeRating.T16,
    director: 'Michael Bay',
    cast: ['Jake Gyllenhaal', 'Yahya Abdul-Mateen II', 'Eiza González'],
    genres: ['Hành động', 'Tội phạm', 'Giật gân'],
  },
  {
    title: 'Uncharted - Thợ Săn Kho Báu',
    originalTitle: 'Uncharted',
    overview: 'Nathan Drake hợp tác với Victor Sullivan tìm kiếm kho báu của Magellan.',
    runtime: 116,
    releaseDate: '2022-02-18',
    ageRating: AgeRating.T13,
    director: 'Ruben Fleischer',
    cast: ['Tom Holland', 'Mark Wahlberg', 'Sophia Ali', 'Tati Gabrielle'],
    genres: ['Hành động', 'Phiêu lưu'],
  },
  {
    title: 'The Northman - Chiến Binh Phương Bắc',
    originalTitle: 'The Northman',
    overview: 'Hoàng tử Viking thề trả thù chú đã giết cha và cướp mẹ.',
    runtime: 136,
    releaseDate: '2022-04-22',
    ageRating: AgeRating.T18,
    director: 'Robert Eggers',
    cast: ['Alexander Skarsgård', 'Nicole Kidman', 'Claes Bang', 'Anya Taylor-Joy'],
    genres: ['Hành động', 'Chính kịch', 'Lịch sử'],
  },
  {
    title: 'Don\'t Worry Darling',
    originalTitle: 'Don\'t Worry Darling',
    overview: 'Bà nội trợ hoàn hảo ở thập niên 50 bắt đầu nghi ngờ về cuộc sống tưởng như hoàn hảo.',
    runtime: 123,
    releaseDate: '2022-09-23',
    ageRating: AgeRating.T16,
    director: 'Olivia Wilde',
    cast: ['Florence Pugh', 'Harry Styles', 'Chris Pine', 'Olivia Wilde'],
    genres: ['Giật gân', 'Bí ẩn', 'Chính kịch'],
  },
  {
    title: 'Amsterdam',
    originalTitle: 'Amsterdam',
    overview: 'Ba người bạn trở thành nghi phạm trong vụ giết người và phát hiện âm mưu lớn hơn.',
    runtime: 134,
    releaseDate: '2022-10-07',
    ageRating: AgeRating.T16,
    director: 'David O. Russell',
    cast: ['Christian Bale', 'Margot Robbie', 'John David Washington', 'Robert De Niro'],
    genres: ['Hài hước', 'Bí ẩn', 'Lịch sử'],
  },
  {
    title: 'Nope (2022)',
    originalTitle: 'Nope (2022)',
    overview: 'Hai anh em chủ trang trại ngựa phát hiện vật thể bay bí ẩn trên bầu trời.',
    runtime: 130,
    releaseDate: '2022-07-22',
    ageRating: AgeRating.T16,
    director: 'Jordan Peele',
    cast: ['Daniel Kaluuya', 'Keke Palmer', 'Steven Yeun', 'Michael Wincott'],
    genres: ['Kinh dị', 'Khoa học viễn tưởng', 'Bí ẩn'],
  },
  // === MORE 2023-2024 FILMS ===
  {
    title: 'Mission: Impossible – Dead Reckoning Part One',
    originalTitle: 'Mission: Impossible - Dead Reckoning Part One',
    overview: 'Ethan Hunt phải ngăn chặn AI nguy hiểm có thể kiểm soát toàn bộ hệ thống vũ khí thế giới.',
    runtime: 164,
    releaseDate: '2023-07-12',
    ageRating: AgeRating.T13,
    director: 'Christopher McQuarrie',
    cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg'],
    genres: ['Hành động', 'Phiêu lưu', 'Giật gân'],
  },
  {
    title: 'Indiana Jones and the Dial of Destiny',
    originalTitle: 'Indiana Jones and the Dial of Destiny',
    overview: 'Indiana Jones 80 tuổi phải đua với Đức Quốc xã để tìm thiết bị cổ đại của Archimedes.',
    runtime: 154,
    releaseDate: '2023-06-30',
    ageRating: AgeRating.T13,
    director: 'James Mangold',
    cast: ['Harrison Ford', 'Phoebe Waller-Bridge', 'Mads Mikkelsen', 'Antonio Banderas'],
    genres: ['Phiêu lưu', 'Hành động'],
  },
  {
    title: 'Gran Turismo',
    originalTitle: 'Gran Turismo',
    overview: 'Câu chuyện thật về game thủ trở thành tay đua xe chuyên nghiệp.',
    runtime: 134,
    releaseDate: '2023-08-25',
    ageRating: AgeRating.T13,
    director: 'Neill Blomkamp',
    cast: ['David Harbour', 'Archie Madekwe', 'Orlando Bloom', 'Djimon Hounsou'],
    genres: ['Hành động', 'Thể thao', 'Chính kịch'],
  },
  {
    title: 'Blue Beetle',
    originalTitle: 'Blue Beetle (2023)',
    overview: 'Thiếu niên Mexico-American trở thành siêu anh hùng sau khi bọ cánh cứng ngoài hành tinh gắn vào người.',
    runtime: 127,
    releaseDate: '2023-08-18',
    ageRating: AgeRating.T13,
    director: 'Angel Manuel Soto',
    cast: ['Xolo Maridueña', 'Bruna Marquezine', 'George Lopez', 'Susan Sarandon'],
    genres: ['Hành động', 'Phiêu lưu', 'Khoa học viễn tưởng'],
  },
  {
    title: 'Dungeons & Dragons: Honor Among Thieves',
    originalTitle: 'Dungeons & Dragons: Honor Among Thieves',
    overview: 'Kẻ trộm quyến rũ và nhóm phiêu lưu phải lấy lại hiện vật bị đánh cắp.',
    runtime: 134,
    releaseDate: '2023-03-31',
    ageRating: AgeRating.T13,
    director: 'John Francis Daley, Jonathan Goldstein',
    cast: ['Chris Pine', 'Michelle Rodriguez', 'Regé-Jean Page', 'Hugh Grant'],
    genres: ['Phiêu lưu', 'Hài hước', 'Viễn tưởng'],
  },
  {
    title: 'Cocaine Bear - Gấu Phê Pha',
    originalTitle: 'Cocaine Bear',
    overview: 'Dựa trên câu chuyện thật về con gấu ăn cocaine và tấn công mọi người trong rừng.',
    runtime: 95,
    releaseDate: '2023-02-24',
    ageRating: AgeRating.T18,
    director: 'Elizabeth Banks',
    cast: ['Keri Russell', 'O\'Shea Jackson Jr.', 'Alden Ehrenreich', 'Ray Liotta'],
    genres: ['Hài hước', 'Kinh dị', 'Giật gân'],
  },
  {
    title: 'Scream VI',
    originalTitle: 'Scream VI',
    overview: 'Nhóm Woodsboro chuyển đến New York để bắt đầu cuộc sống mới nhưng Ghostface theo đuổi.',
    runtime: 123,
    releaseDate: '2023-03-10',
    ageRating: AgeRating.T18,
    director: 'Matt Bettinelli-Olpin, Tyler Gillett',
    cast: ['Melissa Barrera', 'Jenna Ortega', 'Courteney Cox', 'Hayden Panettiere'],
    genres: ['Kinh dị', 'Bí ẩn', 'Giật gân'],
  },
  {
    title: 'Scream (2022)',
    originalTitle: 'Scream (2022)',
    overview: '25 năm sau vụ thảm sát, Ghostface mới nhắm vào nhóm thiếu niên có liên quan đến các nạn nhân gốc.',
    runtime: 114,
    releaseDate: '2022-01-14',
    ageRating: AgeRating.T18,
    director: 'Matt Bettinelli-Olpin, Tyler Gillett',
    cast: ['Melissa Barrera', 'Jenna Ortega', 'Mason Gooding', 'Neve Campbell'],
    genres: ['Kinh dị', 'Bí ẩn', 'Giật gân'],
  },
  {
    title: 'Violent Night - Đêm Bạo Lực',
    originalTitle: 'Violent Night',
    overview: 'Ông già Noel phải cứu gia đình giàu có bị nhóm cướp bắt làm con tin đêm Giáng sinh.',
    runtime: 112,
    releaseDate: '2022-12-02',
    ageRating: AgeRating.T18,
    director: 'Tommy Wirkola',
    cast: ['David Harbour', 'John Leguizamo', 'Beverly D\'Angelo', 'Cam Gigandet'],
    genres: ['Hành động', 'Hài hước', 'Tội phạm'],
  },
  {
    title: 'Prey - Con Mồi',
    originalTitle: 'Prey',
    overview: 'Năm 1719, nữ chiến binh Comanche đối mặt với Predator ngoài hành tinh săn mồi.',
    runtime: 100,
    releaseDate: '2022-08-05',
    ageRating: AgeRating.T18,
    director: 'Dan Trachtenberg',
    cast: ['Amber Midthunder', 'Dakota Beavers', 'Dane DiLiegro', 'Michelle Thrush'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Giật gân'],
  },
];

async function main() {
  console.log('🌱 Seeding Movie Service database - EXTRA (20 replacement movies)...\n');
  console.log('⚠️ Skipping existing movies by originalTitle...\n');

  const existingGenres = await prisma.genre.findMany();
  const genreMap = new Map(existingGenres.map(g => [g.name, g.id]));

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < movieData.length; i++) {
    const movie = movieData[i];
    try {
      const exists = await prisma.movie.findFirst({
        where: { originalTitle: movie.originalTitle }
      });

      if (exists) {
        skippedCount++;
        console.log(`⏭️  [${i + 1}/${movieData.length}] Skipped (exists): ${movie.title}`);
        continue;
      }

      const createdMovie = await prisma.movie.create({
        data: {
          title: movie.title,
          originalTitle: movie.originalTitle,
          overview: movie.overview,
          posterUrl: getSeedPosterUrl(movieData.title, `https://via.placeholder.com/500x750?text=${encodeURIComponent(movie.title.slice(0, 20))}`),
          trailerUrl: getSeedTrailerUrl(movie.title, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
          backdropUrl: `https://via.placeholder.com/1920x1080?text=${encodeURIComponent(movie.title.slice(0, 20))}`,
          runtime: movie.runtime,
          releaseDate: new Date(movie.releaseDate),
          ageRating: movie.ageRating,
          originalLanguage: 'en',
          spokenLanguages: ['vi', 'en'],
          productionCountry: 'Hoa Kỳ',
          languageType: LanguageOption.SUBTITLE,
          director: movie.director,
          cast: movie.cast,
        },
      });

      for (const genreName of movie.genres) {
        const genreId = genreMap.get(genreName);
        if (genreId) {
          await prisma.movieGenre.create({
            data: { movieId: createdMovie.id, genreId },
          });
        }
      }

      successCount++;
      console.log(`✅ [${i + 1}/${movieData.length}] ${movie.title}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ [${i + 1}/${movieData.length}] Failed: ${movie.title}`, error);
    }
  }

  console.log(`\n🎉 Extra batch complete: ${successCount} created, ${skippedCount} skipped, ${errorCount} failed`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
