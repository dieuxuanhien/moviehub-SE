import { getSeedPosterUrl, getSeedTrailerUrl, getSeedReleaseData } from './seed-helper';
import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma';

const prisma = new PrismaClient();

/**
 * BATCH 6: 50 More Trending Films (2018-2025)
 * Focus: DC films, Thriller/Drama, Musicals, Action sequels, International hits
 * 
 * NOTE: Uses findFirst + create to skip existing movies (by originalTitle)
 */

const movieData = [
  // === DC UNIVERSE ===
  {
    title: 'The Flash',
    originalTitle: 'The Flash',
    overview: 'Barry Allen sử dụng tốc độ để du hành thời gian cứu mẹ, vô tình tạo ra thực tại mới với nhiều Batman.',
    runtime: 144,
    releaseDate: '2023-06-16',
    ageRating: AgeRating.T13,
    director: 'Andy Muschietti',
    cast: ['Ezra Miller', 'Michael Keaton', 'Ben Affleck', 'Sasha Calle'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Siêu anh hùng'],
  },
  {
    title: 'Aquaman and the Lost Kingdom',
    originalTitle: 'Aquaman and the Lost Kingdom',
    overview: 'Aquaman phải kết hợp với em trai Orm để ngăn Black Manta sử dụng sức mạnh cổ đại hủy diệt Atlantis.',
    runtime: 124,
    releaseDate: '2023-12-22',
    ageRating: AgeRating.T13,
    director: 'James Wan',
    cast: ['Jason Momoa', 'Patrick Wilson', 'Yahya Abdul-Mateen II', 'Amber Heard'],
    genres: ['Hành động', 'Phiêu lưu', 'Siêu anh hùng'],
  },
  {
    title: 'Blue Beetle',
    originalTitle: 'Blue Beetle',
    overview: 'Thanh niên gốc Mexico tình cờ được sinh vật ngoài hành tinh chọn làm vật chủ và trở thành siêu anh hùng.',
    runtime: 127,
    releaseDate: '2023-08-18',
    ageRating: AgeRating.T13,
    director: 'Angel Manuel Soto',
    cast: ['Xolo Maridueña', 'Bruna Marquezine', 'Susan Sarandon', 'George Lopez'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Siêu anh hùng'],
  },
  {
    title: 'Shazam! Fury of the Gods',
    originalTitle: 'Shazam! Fury of the Gods',
    overview: 'Billy Batson và gia đình siêu anh hùng phải đối mặt với các nữ thần Hy Lạp muốn đoạt lại sức mạnh.',
    runtime: 130,
    releaseDate: '2023-03-17',
    ageRating: AgeRating.T13,
    director: 'David F. Sandberg',
    cast: ['Zachary Levi', 'Asher Angel', 'Helen Mirren', 'Lucy Liu'],
    genres: ['Hành động', 'Hài hước', 'Siêu anh hùng'],
  },
  {
    title: 'Black Adam',
    originalTitle: 'Black Adam',
    overview: 'Sau 5.000 năm bị giam cầm, Black Adam được giải phóng và đối đầu Justice Society of America.',
    runtime: 125,
    releaseDate: '2022-10-21',
    ageRating: AgeRating.T13,
    director: 'Jaume Collet-Serra',
    cast: ['Dwayne Johnson', 'Aldis Hodge', 'Pierce Brosnan', 'Sarah Shahi'],
    genres: ['Hành động', 'Kỳ ảo', 'Siêu anh hùng'],
  },
  {
    title: 'The Suicide Squad',
    originalTitle: 'The Suicide Squad',
    overview: 'Đội tội phạm siêu năng lực được gửi đến đảo quốc Nam Mỹ để phá hủy phòng thí nghiệm bí mật.',
    runtime: 132,
    releaseDate: '2021-08-06',
    ageRating: AgeRating.T18,
    director: 'James Gunn',
    cast: ['Margot Robbie', 'Idris Elba', 'John Cena', 'Joel Kinnaman'],
    genres: ['Hành động', 'Hài hước', 'Siêu anh hùng'],
  },
  {
    title: 'Wonder Woman 1984',
    originalTitle: 'Wonder Woman 1984',
    overview: 'Diana Prince đối đầu với hai kẻ thù mới trong bối cảnh Chiến tranh Lạnh năm 1984.',
    runtime: 151,
    releaseDate: '2020-12-25',
    ageRating: AgeRating.T13,
    director: 'Patty Jenkins',
    cast: ['Gal Gadot', 'Chris Pine', 'Kristen Wiig', 'Pedro Pascal'],
    genres: ['Hành động', 'Phiêu lưu', 'Siêu anh hùng'],
  },
  {
    title: 'Birds of Prey',
    originalTitle: 'Birds of Prey',
    overview: 'Harley Quinn chia tay Joker và tập hợp nhóm phụ nữ để bảo vệ cô bé khỏi trùm tội phạm Gotham.',
    runtime: 109,
    releaseDate: '2020-02-07',
    ageRating: AgeRating.T16,
    director: 'Cathy Yan',
    cast: ['Margot Robbie', 'Mary Elizabeth Winstead', 'Jurnee Smollett', 'Ewan McGregor'],
    genres: ['Hành động', 'Hài hước', 'Siêu anh hùng'],
  },
  {
    title: 'Zack Snyder\'s Justice League',
    originalTitle: 'Zack Snyder\'s Justice League',
    overview: 'Phiên bản đạo diễn của Justice League với Batman tập hợp đội siêu anh hùng chống Darkseid.',
    runtime: 242,
    releaseDate: '2021-03-18',
    ageRating: AgeRating.T16,
    director: 'Zack Snyder',
    cast: ['Ben Affleck', 'Gal Gadot', 'Jason Momoa', 'Henry Cavill'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Siêu anh hùng'],
  },
  {
    title: 'Joker: Folie à Deux',
    originalTitle: 'Joker: Folie à Deux',
    overview: 'Arthur Fleck gặp Harley Quinn trong bệnh viện Arkham và cùng nhau sống trong thế giới âm nhạc điên loạn.',
    runtime: 138,
    releaseDate: '2024-10-04',
    ageRating: AgeRating.T18,
    director: 'Todd Phillips',
    cast: ['Joaquin Phoenix', 'Lady Gaga', 'Brendan Gleeson', 'Zazie Beetz'],
    genres: ['Tội phạm', 'Chính kịch', 'Nhạc kịch'],
  },

  // === THRILLER/DRAMA 2020-2025 ===
  {
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    overview: 'Câu chuyện về J. Robert Oppenheimer và vai trò của ông trong việc phát triển bom nguyên tử.',
    runtime: 180,
    releaseDate: '2023-07-21',
    ageRating: AgeRating.T16,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.', 'Matt Damon'],
    genres: ['Chính kịch', 'Lịch sử', 'Tiểu sử'],
  },
  {
    title: 'The Banshees of Inisherin',
    originalTitle: 'The Banshees of Inisherin',
    overview: 'Trên đảo Ireland năm 1923, một người đàn ông bị sốc khi bạn thân đột ngột tuyên bố chấm dứt tình bạn.',
    runtime: 114,
    releaseDate: '2022-10-21',
    ageRating: AgeRating.T16,
    director: 'Martin McDonagh',
    cast: ['Colin Farrell', 'Brendan Gleeson', 'Kerry Condon', 'Barry Keoghan'],
    genres: ['Chính kịch', 'Hài hước đen'],
  },
  {
    title: 'Triangle of Sadness - Tam Giác Buồn',
    originalTitle: 'Triangle of Sadness',
    overview: 'Du thuyền hạng sang chở người giàu gặp nạn và những người sống sót phải đối mặt với trật tự xã hội mới.',
    runtime: 147,
    releaseDate: '2022-09-23',
    ageRating: AgeRating.T16,
    director: 'Ruben Östlund',
    cast: ['Harris Dickinson', 'Charlbi Dean', 'Woody Harrelson', 'Dolly de Leon'],
    genres: ['Hài hước đen', 'Chính kịch'],
  },
  {
    title: 'The Father - Người Cha',
    originalTitle: 'The Father',
    overview: 'Người đàn ông 80 tuổi mắc chứng mất trí nhớ phải đối mặt với thực tại đang thay đổi liên tục.',
    runtime: 97,
    releaseDate: '2020-12-11',
    ageRating: AgeRating.T13,
    director: 'Florian Zeller',
    cast: ['Anthony Hopkins', 'Olivia Colman', 'Mark Gatiss', 'Imogen Poots'],
    genres: ['Chính kịch'],
  },
  {
    title: 'Sound of Metal - Âm Thanh Kim Loại',
    originalTitle: 'Sound of Metal',
    overview: 'Tay trống heavy metal đột nhiên mất thính giác và phải thích nghi với cuộc sống mới trong cộng đồng khiếm thính.',
    runtime: 120,
    releaseDate: '2020-11-20',
    ageRating: AgeRating.T16,
    director: 'Darius Marder',
    cast: ['Riz Ahmed', 'Olivia Cooke', 'Paul Raci', 'Lauren Ridloff'],
    genres: ['Chính kịch', 'Âm nhạc'],
  },
  {
    title: 'Judas and the Black Messiah',
    originalTitle: 'Judas and the Black Messiah',
    overview: 'FBI tuyển mộ tội phạm xâm nhập đảng Black Panther để phá hoại từ bên trong.',
    runtime: 126,
    releaseDate: '2021-02-12',
    ageRating: AgeRating.T16,
    director: 'Shaka King',
    cast: ['Daniel Kaluuya', 'LaKeith Stanfield', 'Jesse Plemons', 'Martin Sheen'],
    genres: ['Chính kịch', 'Tiểu sử', 'Lịch sử'],
  },
  {
    title: 'CODA',
    originalTitle: 'CODA',
    overview: 'Con gái duy nhất có thể nghe trong gia đình khiếm thính phải chọn giữa đam mê âm nhạc và nghĩa vụ gia đình.',
    runtime: 111,
    releaseDate: '2021-08-13',
    ageRating: AgeRating.T13,
    director: 'Sian Heder',
    cast: ['Emilia Jones', 'Marlee Matlin', 'Troy Kotsur', 'Daniel Durant'],
    genres: ['Chính kịch', 'Âm nhạc', 'Gia đình'],
  },
  {
    title: 'The Fabelmans',
    originalTitle: 'The Fabelmans',
    overview: 'Câu chuyện bán tự truyện của Steven Spielberg về tuổi thơ và tình yêu điện ảnh.',
    runtime: 151,
    releaseDate: '2022-11-11',
    ageRating: AgeRating.T13,
    director: 'Steven Spielberg',
    cast: ['Gabriel LaBelle', 'Michelle Williams', 'Paul Dano', 'Seth Rogen'],
    genres: ['Chính kịch', 'Tiểu sử'],
  },
  {
    title: 'Women Talking - Phụ Nữ Lên Tiếng',
    originalTitle: 'Women Talking',
    overview: 'Nhóm phụ nữ trong cộng đồng tôn giáo biệt lập họp bàn sau khi phát hiện họ bị những người đàn ông xâm hại.',
    runtime: 104,
    releaseDate: '2022-12-23',
    ageRating: AgeRating.T13,
    director: 'Sarah Polley',
    cast: ['Rooney Mara', 'Claire Foy', 'Jessie Buckley', 'Frances McDormand'],
    genres: ['Chính kịch'],
  },
  {
    title: 'Living',
    originalTitle: 'Living',
    overview: 'Công chức Anh quốc những năm 1950 được chẩn đoán ung thư và quyết định tìm ý nghĩa cuộc sống.',
    runtime: 102,
    releaseDate: '2022-11-04',
    ageRating: AgeRating.T13,
    director: 'Oliver Hermanus',
    cast: ['Bill Nighy', 'Aimee Lou Wood', 'Alex Sharp', 'Tom Burke'],
    genres: ['Chính kịch'],
  },

  // === ACTION SEQUELS 2020-2025 ===
  {
    title: 'Fast X',
    originalTitle: 'Fast X',
    overview: 'Dom Toretto phải đối mặt với con trai của Hernan Reyes đang trả thù cho cha.',
    runtime: 141,
    releaseDate: '2023-05-19',
    ageRating: AgeRating.T13,
    director: 'Louis Leterrier',
    cast: ['Vin Diesel', 'Michelle Rodriguez', 'Jason Momoa', 'John Cena'],
    genres: ['Hành động', 'Tội phạm', 'Giật gân'],
  },
  {
    title: 'F9 - Fast & Furious 9',
    originalTitle: 'F9',
    overview: 'Dom và băng đảng đối đầu với em trai Jakob, một sát thủ và tay đua siêu hạng.',
    runtime: 143,
    releaseDate: '2021-06-25',
    ageRating: AgeRating.T13,
    director: 'Justin Lin',
    cast: ['Vin Diesel', 'Michelle Rodriguez', 'John Cena', 'Charlize Theron'],
    genres: ['Hành động', 'Tội phạm', 'Giật gân'],
  },
  {
    title: 'Bullet Train - Tàu Cao Tốc',
    originalTitle: 'Bullet Train',
    overview: 'Sát thủ xui xẻo trên tàu cao tốc Nhật Bản phát hiện nhiệm vụ đơn giản thực ra là bẫy chết người.',
    runtime: 127,
    releaseDate: '2022-08-05',
    ageRating: AgeRating.T16,
    director: 'David Leitch',
    cast: ['Brad Pitt', 'Joey King', 'Aaron Taylor-Johnson', 'Brian Tyree Henry'],
    genres: ['Hành động', 'Hài hước', 'Giật gân'],
  },
  {
    title: 'Nobody - Tay Không Phải Dạng Vừa',
    originalTitle: 'Nobody',
    overview: 'Người đàn ông bình thường bị cướp và quyết định sử dụng kỹ năng bí mật để trả thù.',
    runtime: 92,
    releaseDate: '2021-03-26',
    ageRating: AgeRating.T18,
    director: 'Ilya Naishuller',
    cast: ['Bob Odenkirk', 'Connie Nielsen', 'Christopher Lloyd', 'Aleksey Serebryakov'],
    genres: ['Hành động', 'Tội phạm', 'Giật gân'],
  },
  {
    title: 'The Equalizer 3 - Thiện Ác Đối Đầu 3',
    originalTitle: 'The Equalizer 3',
    overview: 'Robert McCall nghỉ hưu ở Ý và phải bảo vệ bạn mới khỏi mafia địa phương.',
    runtime: 109,
    releaseDate: '2023-09-01',
    ageRating: AgeRating.T18,
    director: 'Antoine Fuqua',
    cast: ['Denzel Washington', 'Dakota Fanning', 'David Denman', 'Eugenio Mastrandrea'],
    genres: ['Hành động', 'Tội phạm', 'Giật gân'],
  },
  {
    title: 'Transformers: Rise of the Beasts',
    originalTitle: 'Transformers: Rise of the Beasts',
    overview: 'Autobots hợp tác với nhóm robot biến hình mới Maximals để chống lại mối đe dọa vũ trụ.',
    runtime: 127,
    releaseDate: '2023-06-09',
    ageRating: AgeRating.T13,
    director: 'Steven Caple Jr.',
    cast: ['Anthony Ramos', 'Dominique Fishback', 'Pete Davidson', 'Ron Perlman'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
  },
  {
    title: 'Rebel Moon - Phần 1: Đứa Con Của Lửa',
    originalTitle: 'Rebel Moon - Part One: A Child of Fire',
    overview: 'Cô gái hòa bình phải tập hợp chiến binh từ khắp thiên hà để chống lại đế chế tàn bạo.',
    runtime: 134,
    releaseDate: '2023-12-22',
    ageRating: AgeRating.T13,
    director: 'Zack Snyder',
    cast: ['Sofia Boutella', 'Charlie Hunnam', 'Djimon Hounsou', 'Ed Skrein'],
    genres: ['Khoa học viễn tưởng', 'Hành động', 'Phiêu lưu'],
  },
  {
    title: 'Furiosa: A Mad Max Saga',
    originalTitle: 'Furiosa: A Mad Max Saga',
    overview: 'Câu chuyện nguồn gốc của Furiosa trước sự kiện Mad Max: Fury Road.',
    runtime: 148,
    releaseDate: '2024-05-24',
    ageRating: AgeRating.T16,
    director: 'George Miller',
    cast: ['Anya Taylor-Joy', 'Chris Hemsworth', 'Tom Burke', 'Lachy Hulme'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
  },
  {
    title: 'Gladiator II',
    originalTitle: 'Gladiator II',
    overview: 'Lucius, con trai của Lucilla, phải chiến đấu trong đấu trường để chống lại hoàng đế La Mã mới.',
    runtime: 148,
    releaseDate: '2024-11-22',
    ageRating: AgeRating.T16,
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Denzel Washington', 'Pedro Pascal', 'Connie Nielsen'],
    genres: ['Hành động', 'Chính kịch', 'Lịch sử'],
  },
  {
    title: 'Dune: Messiah',
    originalTitle: 'Dune: Messiah',
    overview: 'Paul Atreides đối mặt với hậu quả của cuộc thánh chiến mà ông khởi xướng.',
    runtime: 160,
    releaseDate: '2025-12-19',
    ageRating: AgeRating.T13,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Florence Pugh', 'Austin Butler'],
    genres: ['Khoa học viễn tưởng', 'Chính kịch', 'Phiêu lưu'],
  },

  // === INTERNATIONAL HITS 2020-2025 ===
  {
    title: 'RRR',
    originalTitle: 'RRR',
    overview: 'Hai anh hùng cách mạng Ấn Độ kết nghĩa anh em trong thời kỳ thuộc địa Anh.',
    runtime: 187,
    releaseDate: '2022-03-25',
    ageRating: AgeRating.T13,
    director: 'S.S. Rajamouli',
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'],
    genres: ['Hành động', 'Chính kịch', 'Lịch sử'],
  },
  {
    title: 'Pathaan',
    originalTitle: 'Pathaan',
    overview: 'Đặc vụ RAW bị coi là kẻ phản bội phải ngăn chặn âm mưu khủng bố nhằm vào Ấn Độ.',
    runtime: 146,
    releaseDate: '2023-01-25',
    ageRating: AgeRating.T13,
    director: 'Siddharth Anand',
    cast: ['Shah Rukh Khan', 'Deepika Padukone', 'John Abraham'],
    genres: ['Hành động', 'Giật gân', 'Gián điệp'],
  },
  {
    title: 'Jawan',
    originalTitle: 'Jawan',
    overview: 'Người đàn ông bí ẩn dẫn đầu nhóm phụ nữ thực hiện các vụ trả thù chống lại những người quyền lực tham nhũng.',
    runtime: 169,
    releaseDate: '2023-09-07',
    ageRating: AgeRating.T13,
    director: 'Atlee',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
    genres: ['Hành động', 'Giật gân', 'Chính kịch'],
  },
  {
    title: 'Vikram',
    originalTitle: 'Vikram',
    overview: 'Đặc vụ bí mật điều tra loạt vụ giết người liên quan đến ma túy và cảnh sát tham nhũng.',
    runtime: 174,
    releaseDate: '2022-06-03',
    ageRating: AgeRating.T18,
    director: 'Lokesh Kanagaraj',
    cast: ['Kamal Haasan', 'Vijay Sethupathi', 'Fahadh Faasil', 'Suriya'],
    genres: ['Hành động', 'Tội phạm', 'Giật gân'],
  },
  {
    title: 'The Wandering Earth II',
    originalTitle: '流浪地球2',
    overview: 'Phần tiền truyện về nỗ lực của nhân loại di chuyển Trái Đất khỏi hệ mặt trời.',
    runtime: 173,
    releaseDate: '2023-01-22',
    ageRating: AgeRating.T13,
    director: 'Frant Gwo',
    cast: ['Wu Jing', 'Andy Lau', 'Li Xuejian', 'Sha Yi'],
    genres: ['Khoa học viễn tưởng', 'Thảm họa', 'Hành động'],
  },
  {
    title: 'Troll - Quái Vật Trolls',
    originalTitle: 'Troll',
    overview: 'Troll khổng lồ từ thần thoại thức dậy ở Na Uy và tiến về Oslo.',
    runtime: 101,
    releaseDate: '2022-12-01',
    ageRating: AgeRating.T13,
    director: 'Roar Uthaug',
    cast: ['Ine Marie Wilmann', 'Kim Falck', 'Mads Sjøgård Pettersen'],
    genres: ['Hành động', 'Kỳ ảo', 'Thảm họa'],
  },
  {
    title: 'Athena',
    originalTitle: 'Athena',
    overview: 'Sau cái chết của em trai trong đồn cảnh sát, ba anh em phải đối mặt với bạo loạn ở ngoại ô Paris.',
    runtime: 97,
    releaseDate: '2022-09-23',
    ageRating: AgeRating.T16,
    director: 'Romain Gavras',
    cast: ['Dali Benssalah', 'Sami Slimane', 'Anthony Bajon', 'Ouassini Embarek'],
    genres: ['Hành động', 'Chính kịch', 'Giật gân'],
  },
  {
    title: 'Carter',
    originalTitle: '카터',
    overview: 'Đặc vụ mất trí nhớ thức dậy giữa nhiệm vụ giải cứu con gái của một nhà khoa học Bắc Hàn.',
    runtime: 132,
    releaseDate: '2022-08-05',
    ageRating: AgeRating.T18,
    director: 'Jung Byung-gil',
    cast: ['Joo Won', 'Lee Sung-jae', 'Jeong So-ri', 'Kim Bo-min'],
    genres: ['Hành động', 'Giật gân'],
  },
  {
    title: 'Monkey Man - Người Khỉ',
    originalTitle: 'Monkey Man',
    overview: 'Thanh niên Ấn Độ xâm nhập giới thượng lưu Mumbai để trả thù những kẻ đã hại mẹ.',
    runtime: 121,
    releaseDate: '2024-04-05',
    ageRating: AgeRating.T18,
    director: 'Dev Patel',
    cast: ['Dev Patel', 'Sharlto Copley', 'Sobhita Dhulipala', 'Sikandar Kher'],
    genres: ['Hành động', 'Giật gân'],
  },
  {
    title: 'Civil War',
    originalTitle: 'Civil War',
    overview: 'Các nhà báo chiến trường du hành qua nước Mỹ đang trong nội chiến để phỏng vấn tổng thống.',
    runtime: 109,
    releaseDate: '2024-04-12',
    ageRating: AgeRating.T16,
    director: 'Alex Garland',
    cast: ['Kirsten Dunst', 'Wagner Moura', 'Cailee Spaeny', 'Stephen McKinley Henderson'],
    genres: ['Hành động', 'Chính kịch', 'Giật gân'],
  },
];

async function main() {
  console.log('🌱 Seeding Movie Service database - BATCH 6 (50 trending films)...\n');
  console.log('⚠️ Skipping existing movies by originalTitle...\n');

  const existingGenres = await prisma.genre.findMany();
  const genreMap = new Map(existingGenres.map(g => [g.name, g.id]));

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < movieData.length; i++) {
    const movie = movieData[i];
    try {
      // Check if movie already exists by originalTitle
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

  console.log(`\n🎉 Batch 6 complete: ${successCount} created, ${skippedCount} skipped, ${errorCount} failed`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
