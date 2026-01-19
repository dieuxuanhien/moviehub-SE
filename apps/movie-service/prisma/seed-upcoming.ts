/**
 * SEED: Upcoming & Now Showing Movies
 * Creates movies with future and recent release dates
 * 
 * Usage: npx tsx prisma/seed-upcoming.ts
 */

import { getSeedPosterUrl, getSeedTrailerUrl } from './seed-helper';
import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma';

const prisma = new PrismaClient();

// Get dates relative to today
const today = new Date();
const nowShowing = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};
const upcoming = (daysFromNow: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

const movies = [
  // ============ NOW SHOWING (Released within last 30 days) ============
  {
    title: 'Captain America: Brave New World',
    originalTitle: 'Captain America: Brave New World',
    overview: 'Sam Wilson hoàn toàn đảm nhận vai trò Captain America sau sự kiện The Falcon and the Winter Soldier.',
    runtime: 135,
    releaseDate: nowShowing(7),
    ageRating: AgeRating.T13,
    director: 'Julius Onah',
    cast: ['Anthony Mackie', 'Harrison Ford', 'Tim Blake Nelson'],
    genres: ['Hành động', 'Siêu anh hùng'],
    status: 'NOW_SHOWING',
  },
  {
    title: 'Paddington in Peru',
    originalTitle: 'Paddington in Peru',
    overview: 'Gấu Paddington trở về Peru để thăm dì Lucy tại Nhà Dưỡng Lão Gấu.',
    runtime: 106,
    releaseDate: nowShowing(14),
    ageRating: AgeRating.P,
    director: 'Dougal Wilson',
    cast: ['Ben Whishaw', 'Hugh Bonneville', 'Emily Mortimer'],
    genres: ['Gia đình', 'Hài', 'Phiêu lưu'],
    status: 'NOW_SHOWING',
  },
  {
    title: 'Nosferatu - Ma Cà Rồng',
    originalTitle: 'Nosferatu',
    overview: 'Phiên bản làm lại kinh điển về câu chuyện ma cà rồng Nosferatu.',
    runtime: 132,
    releaseDate: nowShowing(21),
    ageRating: AgeRating.T18,
    director: 'Robert Eggers',
    cast: ['Bill Skarsgård', 'Lily-Rose Depp', 'Nicholas Hoult'],
    genres: ['Kinh dị', 'Giật gân'],
    status: 'NOW_SHOWING',
  },
  {
    title: 'Sonic the Hedgehog 3 - Nhím Sonic 3',
    originalTitle: 'Sonic the Hedgehog 3',
    overview: 'Sonic, Knuckles và Tails phải đối mặt với kẻ thù mới: Shadow the Hedgehog.',
    runtime: 109,
    releaseDate: nowShowing(28),
    ageRating: AgeRating.P,
    director: 'Jeff Fowler',
    cast: ['Ben Schwartz', 'Jim Carrey', 'Idris Elba', 'Keanu Reeves'],
    genres: ['Hành động', 'Gia đình', 'Phiêu lưu'],
    status: 'NOW_SHOWING',
  },
  {
    title: 'Mufasa: The Lion King - Vua Sư Tử',
    originalTitle: 'Mufasa: The Lion King',
    overview: 'Câu chuyện về nguồn gốc của Mufasa và hành trình trở thành vua.',
    runtime: 118,
    releaseDate: nowShowing(30),
    ageRating: AgeRating.P,
    director: 'Barry Jenkins',
    cast: ['Aaron Pierre', 'Kelvin Harrison Jr.', 'Beyoncé'],
    genres: ['Hoạt hình', 'Gia đình', 'Phiêu lưu'],
    status: 'NOW_SHOWING',
  },
  {
    title: 'Wicked - Phù Thủy Xanh',
    originalTitle: 'Wicked',
    overview: 'Câu chuyện về tình bạn giữa Elphaba và Glinda trước khi một người trở thành Phù Thủy Xấu.',
    runtime: 160,
    releaseDate: nowShowing(60),
    ageRating: AgeRating.P,
    director: 'Jon M. Chu',
    cast: ['Cynthia Erivo', 'Ariana Grande', 'Michelle Yeoh', 'Jeff Goldblum'],
    genres: ['Nhạc kịch', 'Gia đình', 'Kỳ ảo'],
    status: 'NOW_SHOWING',
  },
  {
    title: 'Moana 2 - Hành Trình Của Moana 2',
    originalTitle: 'Moana 2',
    overview: 'Moana lên đường trong hành trình mới để cứu người dân đảo của mình.',
    runtime: 100,
    releaseDate: nowShowing(55),
    ageRating: AgeRating.P,
    director: 'David Derrick Jr.',
    cast: ['Auli\'i Cravalho', 'Dwayne Johnson'],
    genres: ['Hoạt hình', 'Gia đình', 'Phiêu lưu', 'Nhạc kịch'],
    status: 'NOW_SHOWING',
  },
  {
    title: 'Kraven the Hunter - Thợ Săn Kraven',
    originalTitle: 'Kraven the Hunter',
    overview: 'Nguồn gốc của Kraven, một trong những kẻ thù nguy hiểm nhất của Spider-Man.',
    runtime: 127,
    releaseDate: nowShowing(35),
    ageRating: AgeRating.T16,
    director: 'J.C. Chandor',
    cast: ['Aaron Taylor-Johnson', 'Ariana DeBose', 'Russell Crowe'],
    genres: ['Hành động', 'Siêu anh hùng'],
    status: 'NOW_SHOWING',
  },
  
  // ============ UPCOMING (Future release dates) ============
  {
    title: 'Thunderbolts* - Biệt Đội Sấm Sét',
    originalTitle: 'Thunderbolts*',
    overview: 'Nhóm những phản anh hùng và những người hùng bị ruồng bỏ được tập hợp để thực hiện nhiệm vụ đặc biệt.',
    runtime: 130,
    releaseDate: upcoming(45),
    ageRating: AgeRating.T13,
    director: 'Jake Schreier',
    cast: ['Florence Pugh', 'Sebastian Stan', 'David Harbour', 'Olga Kurylenko'],
    genres: ['Hành động', 'Siêu anh hùng'],
    status: 'UPCOMING',
  },
  {
    title: 'The Fantastic Four: First Steps',
    originalTitle: 'The Fantastic Four: First Steps',
    overview: 'Bộ Tứ Siêu Đẳng - Reed Richards, Sue Storm, Johnny Storm và Ben Grimm - lần đầu tiên bước vào MCU.',
    runtime: 140,
    releaseDate: upcoming(35),
    ageRating: AgeRating.T13,
    director: 'Matt Shakman',
    cast: ['Pedro Pascal', 'Vanessa Kirby', 'Joseph Quinn', 'Ebon Moss-Bachrach'],
    genres: ['Hành động', 'Siêu anh hùng', 'Khoa học viễn tưởng'],
    status: 'UPCOMING',
  },
  {
    title: 'Avatar 3 - Fire and Ash',
    originalTitle: 'Avatar 3',
    overview: 'Jake Sully và Neytiri tiếp tục chiến đấu bảo vệ Pandora khỏi mối đe dọa mới.',
    runtime: 180,
    releaseDate: upcoming(58),
    ageRating: AgeRating.T13,
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    genres: ['Khoa học viễn tưởng', 'Phiêu lưu', 'Kỳ ảo'],
    status: 'UPCOMING',
  },
  {
    title: 'Mission: Impossible 8 - The Final Reckoning',
    originalTitle: 'Mission: Impossible 8',
    overview: 'Ethan Hunt đối mặt với nhiệm vụ nguy hiểm nhất và có thể là cuối cùng.',
    runtime: 165,
    releaseDate: upcoming(42),
    ageRating: AgeRating.T13,
    director: 'Christopher McQuarrie',
    cast: ['Tom Cruise', 'Hayley Atwell', 'Simon Pegg', 'Ving Rhames'],
    genres: ['Hành động', 'Gián điệp', 'Giật gân'],
    status: 'UPCOMING',
  },
  {
    title: 'Superman - Người Đàn Ông Thép',
    originalTitle: 'Superman',
    overview: 'Clark Kent quay trở lại màn ảnh lớn trong phiên bản mới của James Gunn.',
    runtime: 150,
    releaseDate: upcoming(52),
    ageRating: AgeRating.T13,
    director: 'James Gunn',
    cast: ['David Corenswet', 'Rachel Brosnahan', 'Nicholas Hoult'],
    genres: ['Hành động', 'Siêu anh hùng'],
    status: 'UPCOMING',
  },
  {
    title: 'How to Train Your Dragon - Bí Kíp Luyện Rồng',
    originalTitle: 'How to Train Your Dragon',
    overview: 'Phiên bản người thật của bộ phim hoạt hình nổi tiếng về Hiccup và Toothless.',
    runtime: 120,
    releaseDate: upcoming(28),
    ageRating: AgeRating.P,
    director: 'Dean DeBlois',
    cast: ['Mason Thames', 'Nico Parker', 'Gerard Butler'],
    genres: ['Gia đình', 'Phiêu lưu', 'Kỳ ảo'],
    status: 'UPCOMING',
  },
  {
    title: 'Jurassic World Rebirth - Thế Giới Khủng Long: Tái Sinh',
    originalTitle: 'Jurassic World Rebirth',
    overview: 'Cuộc phiêu lưu mới với khủng long trong thế giới hiện đại.',
    runtime: 145,
    releaseDate: upcoming(55),
    ageRating: AgeRating.T13,
    director: 'Gareth Edwards',
    cast: ['Scarlett Johansson', 'Jonathan Bailey', 'Mahershala Ali'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
    status: 'UPCOMING',
  },
  {
    title: 'Elio - Chuyến Phiêu Lưu Của Elio',
    originalTitle: 'Elio',
    overview: 'Cậu bé Elio tình cờ được gửi vào không gian và trở thành đại sứ liên lạc của Trái Đất.',
    runtime: 100,
    releaseDate: upcoming(60),
    ageRating: AgeRating.P,
    director: 'Adrian Molina',
    cast: ['Yonas Kibreab', 'America Ferrera'],
    genres: ['Hoạt hình', 'Gia đình', 'Khoa học viễn tưởng'],
    status: 'UPCOMING',
  },
  {
    title: 'Snow White - Bạch Tuyết',
    originalTitle: 'Snow White',
    overview: 'Phiên bản live-action của câu chuyện cổ tích kinh điển.',
    runtime: 110,
    releaseDate: upcoming(50),
    ageRating: AgeRating.P,
    director: 'Marc Webb',
    cast: ['Rachel Zegler', 'Gal Gadot', 'Andrew Burnap'],
    genres: ['Gia đình', 'Nhạc kịch', 'Kỳ ảo'],
    status: 'UPCOMING',
  },
  {
    title: 'Karate Kid: Legends - Cậu Bé Karate: Huyền Thoại',
    originalTitle: 'Karate Kid: Legends',
    overview: 'Sự kết hợp giữa thế hệ cũ và mới trong vũ trụ Karate Kid.',
    runtime: 115,
    releaseDate: upcoming(55),
    ageRating: AgeRating.T13,
    director: 'Jonathan Entwistle',
    cast: ['Ralph Macchio', 'Jackie Chan', 'Ben Wang'],
    genres: ['Hành động', 'Chính kịch', 'Gia đình'],
    status: 'UPCOMING',
  },
  {
    title: 'A Minecraft Movie - Phim Minecraft',
    originalTitle: 'A Minecraft Movie',
    overview: 'Bốn người bất ngờ bị teleport vào thế giới Minecraft và phải chiến đấu để sinh tồn.',
    runtime: 105,
    releaseDate: upcoming(25),
    ageRating: AgeRating.P,
    director: 'Jared Hess',
    cast: ['Jack Black', 'Jason Momoa', 'Emma Myers'],
    genres: ['Phiêu lưu', 'Gia đình', 'Hài'],
    status: 'UPCOMING',
  },
  {
    title: 'Lilo & Stitch - Lilo và Stitch',
    originalTitle: 'Lilo & Stitch',
    overview: 'Phiên bản live-action của câu chuyện về tình bạn giữa cô bé Lilo và sinh vật ngoài hành tinh Stitch.',
    runtime: 108,
    releaseDate: upcoming(38),
    ageRating: AgeRating.P,
    director: 'Dean Fleischer Camp',
    cast: ['Maia Kealoha', 'Chris Sanders', 'Sydney Agudong'],
    genres: ['Gia đình', 'Hài', 'Khoa học viễn tưởng'],
    status: 'UPCOMING',
  },
  {
    title: 'Ballerina - Sát Thủ Ballerina',
    originalTitle: 'Ballerina',
    overview: 'Eve Macarro - vũ công ballet được huấn luyện thành sát thủ - trả thù cho gia đình.',
    runtime: 112,
    releaseDate: upcoming(18),
    ageRating: AgeRating.T18,
    director: 'Lee Chung-hyeon',
    cast: ['Ana de Armas', 'Keanu Reeves', 'Ian McShane'],
    genres: ['Hành động', 'Giật gân'],
    status: 'UPCOMING',
  },
];

// UUID generator
function generateUUID(title: string): string {
  const str = title + '-upcoming-nowshowing';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(32, '0');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

async function main() {
  console.log('🎬 UPCOMING & NOW SHOWING: Adding movies...\n');
  console.log(`📅 Today: ${today.toISOString().split('T')[0]}\n`);

  const genres = await prisma.genre.findMany();
  const genreByName: Record<string, string> = {};
  for (const g of genres) {
    genreByName[g.name] = g.id;
  }

  let nowShowingCount = 0;
  let upcomingCount = 0;

  for (const movieData of movies) {
    try {
      const movieId = generateUUID(movieData.title);

      const existing = await prisma.movie.findUnique({ where: { id: movieId } });
      if (existing) {
        console.log(`⏭️  Skipping (exists): ${movieData.title}`);
        continue;
      }

      const movie = await prisma.movie.create({
        data: {
          id: movieId,
          title: movieData.title,
          originalTitle: movieData.originalTitle,
          overview: movieData.overview,
          posterUrl: getSeedPosterUrl(movieData.title, `https://via.placeholder.com/500x750?text=${encodeURIComponent(movieData.title.slice(0, 20))}`),
          trailerUrl: getSeedTrailerUrl(movieData.title, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
          backdropUrl: `https://via.placeholder.com/1920x1080?text=${encodeURIComponent(movieData.title.slice(0, 20))}`,
          runtime: movieData.runtime,
          releaseDate: new Date(movieData.releaseDate),
          ageRating: movieData.ageRating,
          originalLanguage: 'en',
          spokenLanguages: ['vi', 'en'],
          productionCountry: 'Hoa Kỳ',
          languageType: LanguageOption.SUBTITLE,
          director: movieData.director,
          cast: movieData.cast.map(name => ({ name, character: '' })),
        },
      });

      for (const genreName of movieData.genres) {
        if (genreByName[genreName]) {
          await prisma.movieGenre.create({
            data: { movieId: movie.id, genreId: genreByName[genreName] },
          });
        }
      }

      const isUpcoming = movieData.status === 'UPCOMING';
      if (isUpcoming) {
        upcomingCount++;
        console.log(`🔜 [UPCOMING] ${movieData.title} (${movieData.releaseDate})`);
      } else {
        nowShowingCount++;
        console.log(`🎬 [NOW SHOWING] ${movieData.title} (${movieData.releaseDate})`);
      }
    } catch (error) {
      console.error(`❌ Failed: ${movieData.title}`, error);
    }
  }

  console.log(`\n🎉 Complete!`);
  console.log(`🎬 Now Showing: ${nowShowingCount}`);
  console.log(`🔜 Upcoming: ${upcomingCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
