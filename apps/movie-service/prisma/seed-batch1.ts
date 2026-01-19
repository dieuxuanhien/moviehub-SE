import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma';

const prisma = new PrismaClient();

/**
 * BATCH 1: First 50 Real Movies
 * Run this first, then continue with batch 2, 3, 4 to reach 200+ movies
 */

const genreNames = [
  'Hành động', 'Khoa học viễn tưởng', 'Tâm lý', 'Hoạt hình', 'Phiêu lưu',
  'Thảm họa', 'Chính kịch', 'Giật gân', 'Quái vật', 'Kinh dị', 'Lãng mạn',
  'Gia đình', 'Hài', 'Tội phạm', 'Bí ẩn', 'Chiến tranh', 'Lịch sử',
  'Âm nhạc', 'Thể thao', 'Tài liệu', 'Viễn tưởng',
];

// Batch 1: 50 Real Movies with accurate data
const movies = [
  // ==== Christopher Nolan Films ====
  {
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    overview: 'Chân dung J. Robert Oppenheimer - cha đẻ bom nguyên tử, từ hành trình nghiên cứu đến những giằng xé đạo đức về phát minh thay đổi lịch sử nhân loại.',
    runtime: 180,
    releaseDate: '2023-07-21',
    ageRating: AgeRating.T18,
    director: 'Christopher Nolan',
    cast: [
      { name: 'Cillian Murphy', character: 'J. Robert Oppenheimer' },
      { name: 'Emily Blunt', character: 'Katherine Oppenheimer' },
      { name: 'Robert Downey Jr.', character: 'Lewis Strauss' },
    ],
    genres: ['Chính kịch', 'Lịch sử', 'Tâm lý'],
  },
  {
    title: 'Inception - Giấc Mơ Trong Mơ',
    originalTitle: 'Inception',
    overview: 'Dom Cobb là một tên trộm chuyên đột nhập vào giấc mơ để đánh cắp bí mật. Anh được giao nhiệm vụ cuối cùng: gieo một ý tưởng vào tiềm thức của mục tiêu.',
    runtime: 148,
    releaseDate: '2010-07-16',
    ageRating: AgeRating.T13,
    director: 'Christopher Nolan',
    cast: [
      { name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
      { name: 'Joseph Gordon-Levitt', character: 'Arthur' },
      { name: 'Elliot Page', character: 'Ariadne' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Giật gân'],
  },
  {
    title: 'Interstellar - Hố Đen Tử Thần',
    originalTitle: 'Interstellar',
    overview: 'Nhóm phi hành gia vượt qua lỗ giun tìm ngôi nhà mới cho nhân loại khi Trái Đất sắp diệt vong. Cooper phải chọn giữa sứ mệnh và gia đình.',
    runtime: 169,
    releaseDate: '2014-11-07',
    ageRating: AgeRating.T13,
    director: 'Christopher Nolan',
    cast: [
      { name: 'Matthew McConaughey', character: 'Cooper' },
      { name: 'Anne Hathaway', character: 'Brand' },
      { name: 'Jessica Chastain', character: 'Murph trưởng thành' },
    ],
    genres: ['Khoa học viễn tưởng', 'Phiêu lưu', 'Chính kịch'],
  },
  {
    title: 'The Dark Knight - Kỵ Sĩ Bóng Đêm',
    originalTitle: 'The Dark Knight',
    overview: 'Batman đối đầu Joker - kẻ phản diện muốn nhấn chìm Gotham vào hỗn loạn. Cuộc chiến tâm lý giữa thiện và ác đẩy Harvey Dent đến bờ vực.',
    runtime: 152,
    releaseDate: '2008-07-18',
    ageRating: AgeRating.T13,
    director: 'Christopher Nolan',
    cast: [
      { name: 'Christian Bale', character: 'Bruce Wayne / Batman' },
      { name: 'Heath Ledger', character: 'Joker' },
      { name: 'Aaron Eckhart', character: 'Harvey Dent' },
    ],
    genres: ['Hành động', 'Tội phạm', 'Chính kịch'],
  },
  {
    title: 'TENET',
    originalTitle: 'Tenet',
    overview: 'Đặc vụ được trang bị công nghệ đảo ngược thời gian để ngăn chặn Thế chiến III. Anh phải giải mã bí ẩn về nghịch lý thời gian.',
    runtime: 150,
    releaseDate: '2020-08-26',
    ageRating: AgeRating.T13,
    director: 'Christopher Nolan',
    cast: [
      { name: 'John David Washington', character: 'The Protagonist' },
      { name: 'Robert Pattinson', character: 'Neil' },
      { name: 'Elizabeth Debicki', character: 'Kat' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Giật gân'],
  },
  {
    title: 'Dunkirk',
    originalTitle: 'Dunkirk',
    overview: 'Cuộc di tản lịch sử của quân Đồng minh khỏi bãi biển Dunkirk trong Thế chiến II, kể qua ba góc nhìn: đất liền, biển và bầu trời.',
    runtime: 106,
    releaseDate: '2017-07-21',
    ageRating: AgeRating.T13,
    director: 'Christopher Nolan',
    cast: [
      { name: 'Fionn Whitehead', character: 'Tommy' },
      { name: 'Tom Hardy', character: 'Farrier' },
      { name: 'Mark Rylance', character: 'Mr. Dawson' },
    ],
    genres: ['Hành động', 'Chiến tranh', 'Lịch sử'],
  },

  // ==== James Cameron Films ====
  {
    title: 'Titanic',
    originalTitle: 'Titanic',
    overview: 'Chuyện tình giữa chàng họa sĩ nghèo Jack và tiểu thư Rose trên chuyến tàu định mệnh Titanic trong thảm họa năm 1912.',
    runtime: 194,
    releaseDate: '1997-12-19',
    ageRating: AgeRating.T13,
    director: 'James Cameron',
    cast: [
      { name: 'Leonardo DiCaprio', character: 'Jack Dawson' },
      { name: 'Kate Winslet', character: 'Rose DeWitt Bukater' },
      { name: 'Billy Zane', character: 'Cal Hockley' },
    ],
    genres: ['Chính kịch', 'Lãng mạn', 'Thảm họa'],
  },
  {
    title: 'Avatar',
    originalTitle: 'Avatar',
    overview: 'Cựu lính thủy đánh bộ Jake Sully đến Pandora trong hình hài Na\'vi, rồi phải lựa chọn giữa nhiệm vụ và bảo vệ bộ lạc bản địa.',
    runtime: 162,
    releaseDate: '2009-12-18',
    ageRating: AgeRating.T13,
    director: 'James Cameron',
    cast: [
      { name: 'Sam Worthington', character: 'Jake Sully' },
      { name: 'Zoe Saldana', character: 'Neytiri' },
      { name: 'Sigourney Weaver', character: 'Dr. Grace Augustine' },
    ],
    genres: ['Hành động', 'Phiêu lưu', 'Khoa học viễn tưởng'],
  },
  {
    title: 'Avatar: Dòng Chảy Của Nước',
    originalTitle: 'Avatar: The Way of Water',
    overview: 'Jake và Neytiri cùng gia đình phải rời bỏ quê hương, tìm nơi ẩn náu với bộ lạc biển khi con người quay lại Pandora.',
    runtime: 192,
    releaseDate: '2022-12-16',
    ageRating: AgeRating.T13,
    director: 'James Cameron',
    cast: [
      { name: 'Sam Worthington', character: 'Jake Sully' },
      { name: 'Zoe Saldana', character: 'Neytiri' },
      { name: 'Kate Winslet', character: 'Ronal' },
    ],
    genres: ['Hành động', 'Phiêu lưu', 'Khoa học viễn tưởng'],
  },
  {
    title: 'The Terminator - Kẻ Hủy Diệt',
    originalTitle: 'The Terminator',
    overview: 'Robot T-800 từ tương lai được gửi về quá khứ để tiêu diệt Sarah Connor trước khi cô sinh ra lãnh đạo kháng chiến tương lai.',
    runtime: 107,
    releaseDate: '1984-10-26',
    ageRating: AgeRating.T16,
    director: 'James Cameron',
    cast: [
      { name: 'Arnold Schwarzenegger', character: 'The Terminator' },
      { name: 'Linda Hamilton', character: 'Sarah Connor' },
      { name: 'Michael Biehn', character: 'Kyle Reese' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Giật gân'],
  },

  // ==== Denis Villeneuve Films ====
  {
    title: 'Dune: Hành Tinh Cát - Phần Hai',
    originalTitle: 'Dune: Part Two',
    overview: 'Paul Atreides liên minh với người Fremen, chống lại kẻ thù của gia đình trong khi đối mặt với sứ mệnh định mệnh trên Arrakis.',
    runtime: 166,
    releaseDate: '2024-02-28',
    ageRating: AgeRating.T13,
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', character: 'Paul Atreides' },
      { name: 'Zendaya', character: 'Chani' },
      { name: 'Rebecca Ferguson', character: 'Lady Jessica' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
  },
  {
    title: 'Dune: Hành Tinh Cát',
    originalTitle: 'Dune',
    overview: 'Paul Atreides - người thừa kế của gia tộc hùng mạnh, phải đến hành tinh nguy hiểm nhất vũ trụ để đảm bảo tương lai gia đình.',
    runtime: 155,
    releaseDate: '2021-10-22',
    ageRating: AgeRating.T13,
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', character: 'Paul Atreides' },
      { name: 'Rebecca Ferguson', character: 'Lady Jessica' },
      { name: 'Oscar Isaac', character: 'Duke Leto Atreides' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
  },
  {
    title: 'Blade Runner 2049',
    originalTitle: 'Blade Runner 2049',
    overview: 'Sĩ quan LAPD K phát hiện bí mật có thể gây hỗn loạn xã hội, dẫn anh đến việc tìm kiếm Blade Runner mất tích Rick Deckard.',
    runtime: 164,
    releaseDate: '2017-10-06',
    ageRating: AgeRating.T16,
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Ryan Gosling', character: 'K' },
      { name: 'Harrison Ford', character: 'Rick Deckard' },
      { name: 'Ana de Armas', character: 'Joi' },
    ],
    genres: ['Khoa học viễn tưởng', 'Chính kịch', 'Bí ẩn'],
  },
  {
    title: 'Arrival - Cuộc Chiến Ngoài Hành Tinh',
    originalTitle: 'Arrival',
    overview: 'Nhà ngôn ngữ học Louise Banks được quân đội yêu cầu giải mã ngôn ngữ của người ngoài hành tinh để tìm hiểu mục đích của họ.',
    runtime: 116,
    releaseDate: '2016-11-11',
    ageRating: AgeRating.T13,
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Amy Adams', character: 'Louise Banks' },
      { name: 'Jeremy Renner', character: 'Ian Donnelly' },
      { name: 'Forest Whitaker', character: 'Colonel Weber' },
    ],
    genres: ['Khoa học viễn tưởng', 'Chính kịch', 'Bí ẩn'],
  },

  // ==== Pixar/Animation Films ====
  {
    title: 'Những Mảnh Ghép Cảm Xúc 2',
    originalTitle: 'Inside Out 2',
    overview: 'Riley bước vào tuổi thiếu niên với cảm xúc mới như Lo Âu và Xấu Hổ, khiến thế giới nội tâm của cô bé hỗn loạn.',
    runtime: 100,
    releaseDate: '2024-06-14',
    ageRating: AgeRating.P,
    director: 'Kelsey Mann',
    cast: [
      { name: 'Amy Poehler', character: 'Joy (lồng tiếng gốc)' },
      { name: 'Maya Hawke', character: 'Anxiety (lồng tiếng gốc)' },
      { name: 'Phyllis Smith', character: 'Sadness (lồng tiếng gốc)' },
    ],
    genres: ['Hoạt hình', 'Gia đình', 'Hài'],
  },
  {
    title: 'Những Mảnh Ghép Cảm Xúc',
    originalTitle: 'Inside Out',
    overview: 'Câu chuyện về 5 cảm xúc Joy, Sadness, Fear, Anger và Disgust trong tâm trí cô bé Riley khi cô phải thích nghi với cuộc sống mới.',
    runtime: 95,
    releaseDate: '2015-06-19',
    ageRating: AgeRating.P,
    director: 'Pete Docter',
    cast: [
      { name: 'Amy Poehler', character: 'Joy (lồng tiếng gốc)' },
      { name: 'Phyllis Smith', character: 'Sadness (lồng tiếng gốc)' },
      { name: 'Bill Hader', character: 'Fear (lồng tiếng gốc)' },
    ],
    genres: ['Hoạt hình', 'Gia đình', 'Hài'],
  },
  {
    title: 'Coco: Hội Ngộ Diệu Kỳ',
    originalTitle: 'Coco',
    overview: 'Miguel theo đuổi giấc mơ âm nhạc, vô tình lạc vào Thế giới người Chết, khám phá bí mật gia đình và tìm lại cội nguồn.',
    runtime: 105,
    releaseDate: '2017-10-27',
    ageRating: AgeRating.P,
    director: 'Lee Unkrich',
    cast: [
      { name: 'Anthony Gonzalez', character: 'Miguel (lồng tiếng gốc)' },
      { name: 'Gael García Bernal', character: 'Héctor (lồng tiếng gốc)' },
      { name: 'Benjamin Bratt', character: 'Ernesto (lồng tiếng gốc)' },
    ],
    genres: ['Hoạt hình', 'Phiêu lưu', 'Gia đình', 'Âm nhạc'],
  },
  {
    title: 'Soul',
    originalTitle: 'Soul',
    overview: 'Joe Gardner - thầy giáo dạy nhạc gặp tai nạn trước buổi biểu diễn quan trọng, linh hồn anh bị đưa đến thế giới trước khi sinh.',
    runtime: 100,
    releaseDate: '2020-12-25',
    ageRating: AgeRating.P,
    director: 'Pete Docter',
    cast: [
      { name: 'Jamie Foxx', character: 'Joe Gardner (lồng tiếng gốc)' },
      { name: 'Tina Fey', character: '22 (lồng tiếng gốc)' },
      { name: 'Graham Norton', character: 'Moonwind (lồng tiếng gốc)' },
    ],
    genres: ['Hoạt hình', 'Gia đình', 'Hài', 'Âm nhạc'],
  },
  {
    title: 'Toy Story',
    originalTitle: 'Toy Story',
    overview: 'Woody - món đồ chơi yêu thích của Andy phải đối mặt với sự xuất hiện của Buzz Lightyear mới trong phòng.',
    runtime: 81,
    releaseDate: '1995-11-22',
    ageRating: AgeRating.P,
    director: 'John Lasseter',
    cast: [
      { name: 'Tom Hanks', character: 'Woody (lồng tiếng gốc)' },
      { name: 'Tim Allen', character: 'Buzz Lightyear (lồng tiếng gốc)' },
      { name: 'Don Rickles', character: 'Mr. Potato Head (lồng tiếng gốc)' },
    ],
    genres: ['Hoạt hình', 'Gia đình', 'Hài', 'Phiêu lưu'],
  },
  {
    title: 'Đi Tìm Nemo',
    originalTitle: 'Finding Nemo',
    overview: 'Cá hề Marlin băng qua đại dương để tìm con trai Nemo bị bắt, với sự giúp đỡ của Dory - cô cá hay quên.',
    runtime: 100,
    releaseDate: '2003-05-30',
    ageRating: AgeRating.P,
    director: 'Andrew Stanton',
    cast: [
      { name: 'Albert Brooks', character: 'Marlin (lồng tiếng gốc)' },
      { name: 'Ellen DeGeneres', character: 'Dory (lồng tiếng gốc)' },
      { name: 'Alexander Gould', character: 'Nemo (lồng tiếng gốc)' },
    ],
    genres: ['Hoạt hình', 'Gia đình', 'Phiêu lưu'],
  },

  // ==== Horror Films ====
  {
    title: 'Ám Ảnh Kinh Hoàng',
    originalTitle: 'The Conjuring',
    overview: 'Vợ chồng điều tra viên siêu nhiên Warren giúp gia đình Perron chống lại thế lực quỷ ám trong ngôi nhà nông trại.',
    runtime: 112,
    releaseDate: '2013-07-19',
    ageRating: AgeRating.T18,
    director: 'James Wan',
    cast: [
      { name: 'Vera Farmiga', character: 'Lorraine Warren' },
      { name: 'Patrick Wilson', character: 'Ed Warren' },
      { name: 'Lili Taylor', character: 'Carolyn Perron' },
    ],
    genres: ['Kinh dị', 'Bí ẩn', 'Giật gân'],
  },
  {
    title: 'Ám Ảnh Kinh Hoàng 2',
    originalTitle: 'The Conjuring 2',
    overview: 'Vợ chồng Warren đến London điều tra vụ quỷ ám nổi tiếng nhất nước Anh - sự kiện Enfield.',
    runtime: 134,
    releaseDate: '2016-06-10',
    ageRating: AgeRating.T18,
    director: 'James Wan',
    cast: [
      { name: 'Vera Farmiga', character: 'Lorraine Warren' },
      { name: 'Patrick Wilson', character: 'Ed Warren' },
      { name: 'Frances O\'Connor', character: 'Peggy Hodgson' },
    ],
    genres: ['Kinh dị', 'Bí ẩn', 'Giật gân'],
  },
  {
    title: 'Get Out - Lấy Mạng',
    originalTitle: 'Get Out',
    overview: 'Chris - chàng trai da đen đến thăm gia đình bạn gái da trắng, dần phát hiện những bí mật đáng sợ đằng sau vẻ ngoài thân thiện.',
    runtime: 104,
    releaseDate: '2017-02-24',
    ageRating: AgeRating.T18,
    director: 'Jordan Peele',
    cast: [
      { name: 'Daniel Kaluuya', character: 'Chris Washington' },
      { name: 'Allison Williams', character: 'Rose Armitage' },
      { name: 'Catherine Keener', character: 'Missy Armitage' },
    ],
    genres: ['Kinh dị', 'Bí ẩn', 'Giật gân'],
  },
  {
    title: 'Us - Chúng Ta',
    originalTitle: 'Us',
    overview: 'Gia đình Wilson đi nghỉ mát bị tấn công bởi những kẻ đột nhập bí ẩn - những bản sao của chính họ.',
    runtime: 116,
    releaseDate: '2019-03-22',
    ageRating: AgeRating.T18,
    director: 'Jordan Peele',
    cast: [
      { name: 'Lupita Nyong\'o', character: 'Adelaide Wilson / Red' },
      { name: 'Winston Duke', character: 'Gabe Wilson / Abraham' },
      { name: 'Shahadi Wright Joseph', character: 'Zora Wilson / Umbrae' },
    ],
    genres: ['Kinh dị', 'Giật gân', 'Bí ẩn'],
  },
  {
    title: 'Trò Đùa Tử Thần',
    originalTitle: 'Saw',
    overview: 'Hai người đàn ông tỉnh dậy trong phòng tắm bẩn thỉu, bị xích chân với xác chết ở giữa, phải giải đố chết chóc của Jigsaw.',
    runtime: 103,
    releaseDate: '2004-10-29',
    ageRating: AgeRating.T18,
    director: 'James Wan',
    cast: [
      { name: 'Cary Elwes', character: 'Dr. Lawrence Gordon' },
      { name: 'Leigh Whannell', character: 'Adam Stanheight' },
      { name: 'Tobin Bell', character: 'Jigsaw / John Kramer' },
    ],
    genres: ['Kinh dị', 'Giật gân', 'Bí ẩn'],
  },

  // ==== Marvel/Superhero Films ====
  {
    title: 'Avengers: Endgame',
    originalTitle: 'Avengers: Endgame',
    overview: 'Sau thảm họa Thanos, các Avengers còn sót lại cùng đồng minh tập hợp một lần nữa để đảo ngược thiệt hại và khôi phục vũ trụ.',
    runtime: 181,
    releaseDate: '2019-04-26',
    ageRating: AgeRating.T13,
    director: 'Anthony Russo, Joe Russo',
    cast: [
      { name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man' },
      { name: 'Chris Evans', character: 'Steve Rogers / Captain America' },
      { name: 'Scarlett Johansson', character: 'Natasha Romanoff / Black Widow' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
  },
  {
    title: 'Avengers: Infinity War',
    originalTitle: 'Avengers: Infinity War',
    overview: 'Các Avengers và đồng minh phải chấp nhận hy sinh tất cả để ngăn chặn Thanos tiêu diệt một nửa vũ trụ.',
    runtime: 149,
    releaseDate: '2018-04-27',
    ageRating: AgeRating.T13,
    director: 'Anthony Russo, Joe Russo',
    cast: [
      { name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man' },
      { name: 'Chris Hemsworth', character: 'Thor' },
      { name: 'Josh Brolin', character: 'Thanos' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
  },
  {
    title: 'Black Panther',
    originalTitle: 'Black Panther',
    overview: 'T\'Challa trở về Wakanda để kế vị ngai vàng, nhưng phải đối mặt với thách thức từ Killmonger - kẻ muốn thay đổi vận mệnh quốc gia.',
    runtime: 134,
    releaseDate: '2018-02-16',
    ageRating: AgeRating.T13,
    director: 'Ryan Coogler',
    cast: [
      { name: 'Chadwick Boseman', character: 'T\'Challa / Black Panther' },
      { name: 'Michael B. Jordan', character: 'Erik Killmonger' },
      { name: 'Lupita Nyong\'o', character: 'Nakia' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
  },
  {
    title: 'Spider-Man: No Way Home',
    originalTitle: 'Spider-Man: No Way Home',
    overview: 'Peter Parker nhờ Doctor Strange giúp mọi người quên danh tính Spider-Man, nhưng phép thuật thất bại mở ra đa vũ trụ hỗn loạn.',
    runtime: 148,
    releaseDate: '2021-12-17',
    ageRating: AgeRating.T13,
    director: 'Jon Watts',
    cast: [
      { name: 'Tom Holland', character: 'Peter Parker / Spider-Man' },
      { name: 'Zendaya', character: 'MJ' },
      { name: 'Benedict Cumberbatch', character: 'Doctor Strange' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Phiêu lưu'],
  },
  {
    title: 'Guardians of the Galaxy - Vệ Binh Dải Ngân Hà',
    originalTitle: 'Guardians of the Galaxy',
    overview: 'Peter Quill cùng nhóm tội phạm ngoài hành tinh phải hợp tác để ngăn chặn kẻ cuồng tích thu viên đá vô cực.',
    runtime: 121,
    releaseDate: '2014-08-01',
    ageRating: AgeRating.T13,
    director: 'James Gunn',
    cast: [
      { name: 'Chris Pratt', character: 'Peter Quill / Star-Lord' },
      { name: 'Zoe Saldana', character: 'Gamora' },
      { name: 'Dave Bautista', character: 'Drax the Destroyer' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Hài'],
  },

  // ==== Korean Films ====
  {
    title: 'Ký Sinh Trùng',
    originalTitle: 'Parasite',
    overview: 'Gia đình Kim nghèo khó dần xâm nhập vào gia đình Park giàu có, dẫn đến hậu quả bi thảm không lường trước.',
    runtime: 132,
    releaseDate: '2019-05-30',
    ageRating: AgeRating.T18,
    director: 'Bong Joon-ho',
    cast: [
      { name: 'Song Kang-ho', character: 'Kim Ki-taek' },
      { name: 'Lee Sun-kyun', character: 'Park Dong-ik' },
      { name: 'Cho Yeo-jeong', character: 'Park Yeon-gyo' },
    ],
    genres: ['Chính kịch', 'Giật gân', 'Hài'],
  },
  {
    title: 'Squid Game: Trò Chơi Con Mực (Phim)',
    originalTitle: 'Squid Game: The Movie',
    overview: 'Phiên bản điện ảnh của Trò Chơi Con Mực - nơi những người mắc nợ chơi trò chơi trẻ em tử thần để giành 45.6 tỷ won.',
    runtime: 140,
    releaseDate: '2024-11-01',
    ageRating: AgeRating.T18,
    director: 'Hwang Dong-hyuk',
    cast: [
      { name: 'Lee Jung-jae', character: 'Seong Gi-hun' },
      { name: 'Park Hae-soo', character: 'Cho Sang-woo' },
      { name: 'Jung Ho-yeon', character: 'Kang Sae-byeok' },
    ],
    genres: ['Hành động', 'Giật gân', 'Chính kịch'],
  },
  {
    title: 'Train to Busan - Chuyến Tàu Sinh Tử',
    originalTitle: 'Train to Busan',
    overview: 'Hành khách trên chuyến tàu đến Busan phải chiến đấu sinh tồn khi dịch zombie bùng phát trên tàu.',
    runtime: 118,
    releaseDate: '2016-07-20',
    ageRating: AgeRating.T16,
    director: 'Yeon Sang-ho',
    cast: [
      { name: 'Gong Yoo', character: 'Seok-woo' },
      { name: 'Jung Yu-mi', character: 'Seong-kyeong' },
      { name: 'Ma Dong-seok', character: 'Sang-hwa' },
    ],
    genres: ['Hành động', 'Kinh dị', 'Giật gân'],
  },
  {
    title: 'Oldboy - Báo Thù',
    originalTitle: 'Oldboy',
    overview: 'Sau 15 năm bị giam cầm bí ẩn, Oh Dae-su được thả và bắt đầu hành trình trả thù tàn khốc tìm kẻ đứng sau.',
    runtime: 120,
    releaseDate: '2003-11-21',
    ageRating: AgeRating.T18,
    director: 'Park Chan-wook',
    cast: [
      { name: 'Choi Min-sik', character: 'Oh Dae-su' },
      { name: 'Yoo Ji-tae', character: 'Lee Woo-jin' },
      { name: 'Kang Hye-jung', character: 'Mi-do' },
    ],
    genres: ['Hành động', 'Giật gân', 'Bí ẩn'],
  },

  // ==== Vietnamese Films ====
  {
    title: 'Mai',
    originalTitle: 'Mai',
    overview: 'Câu chuyện tình yêu giữa cô gái massage Mai và chàng trai thành thị Dương, phản ánh số phận và định kiến xã hội.',
    runtime: 131,
    releaseDate: '2024-02-10',
    ageRating: AgeRating.T18,
    director: 'Trấn Thành',
    cast: [
      { name: 'Phương Anh Đào', character: 'Mai' },
      { name: 'Tuấn Trần', character: 'Dương' },
      { name: 'Trấn Thành', character: 'Sáu' },
    ],
    genres: ['Chính kịch', 'Lãng mạn'],
  },
  {
    title: 'Bố Già',
    originalTitle: 'Bố Già',
    overview: 'Câu chuyện về tình cha con giữa ông Sang nghèo khó và con trai thành đạt, với những mâu thuẫn thế hệ.',
    runtime: 128,
    releaseDate: '2021-03-05',
    ageRating: AgeRating.T13,
    director: 'Trấn Thành, Vũ Ngọc Đãng',
    cast: [
      { name: 'Trấn Thành', character: 'Sang' },
      { name: 'Tuấn Trần', character: 'Quang' },
      { name: 'Lê Giang', character: 'vợ Sang' },
    ],
    genres: ['Chính kịch', 'Gia đình', 'Hài'],
  },
  {
    title: 'Nhà Bà Nữ',
    originalTitle: 'Nhà Bà Nữ',
    overview: 'Bi kịch gia đình khi bà Nữ phát hiện mình bị ung thư, các con cái mâu thuẫn về tiền bạc và tình cảm.',
    runtime: 139,
    releaseDate: '2023-01-25',
    ageRating: AgeRating.T18,
    director: 'Trấn Thành',
    cast: [
      { name: 'Lê Giang', character: 'Bà Nữ' },
      { name: 'Trấn Thành', character: 'Nghĩa' },
      { name: 'Ngô Kiến Huy', character: 'Nhân' },
    ],
    genres: ['Chính kịch', 'Gia đình'],
  },
  {
    title: 'Godzilla x Kong: Đế Chúa Mới',
    originalTitle: 'Godzilla x Kong: The New Empire',
    overview: 'Godzilla và Kong hợp lực chống lại mối đe dọa cổ xưa từ Lòng Trái Đất, hé lộ nguồn gốc các Titan.',
    runtime: 115,
    releaseDate: '2024-03-29',
    ageRating: AgeRating.T13,
    director: 'Adam Wingard',
    cast: [
      { name: 'Rebecca Hall', character: 'Dr. Ilene Andrews' },
      { name: 'Brian Tyree Henry', character: 'Bernie Hayes' },
      { name: 'Dan Stevens', character: 'Trapper' },
    ],
    genres: ['Hành động', 'Quái vật', 'Khoa học viễn tưởng'],
  },

  // ==== More Classics ====
  {
    title: 'Bố Già',
    originalTitle: 'The Godfather',
    overview: 'Câu chuyện về gia đình mafia Corleone tại New York, từ Don Vito đến con trai Michael kế thừa quyền lực.',
    runtime: 175,
    releaseDate: '1972-03-24',
    ageRating: AgeRating.T18,
    director: 'Francis Ford Coppola',
    cast: [
      { name: 'Marlon Brando', character: 'Don Vito Corleone' },
      { name: 'Al Pacino', character: 'Michael Corleone' },
      { name: 'James Caan', character: 'Sonny Corleone' },
    ],
    genres: ['Tội phạm', 'Chính kịch'],
  },
  {
    title: 'Nhà Tù Shawshank',
    originalTitle: 'The Shawshank Redemption',
    overview: 'Andy Dufresne bị kết án oan tù chung thân, dùng trí tuệ và hy vọng để tồn tại trong nhà tù khắc nghiệt Shawshank.',
    runtime: 142,
    releaseDate: '1994-09-23',
    ageRating: AgeRating.T16,
    director: 'Frank Darabont',
    cast: [
      { name: 'Tim Robbins', character: 'Andy Dufresne' },
      { name: 'Morgan Freeman', character: 'Ellis Boyd "Red" Redding' },
      { name: 'Bob Gunton', character: 'Warden Norton' },
    ],
    genres: ['Chính kịch'],
  },
  {
    title: 'Fight Club',
    originalTitle: 'Fight Club',
    overview: 'Nhân viên văn phòng chán nản gặp Tyler Durden và cùng thành lập Fight Club bí mật, dẫn đến sự kiện chấn động.',
    runtime: 139,
    releaseDate: '1999-10-15',
    ageRating: AgeRating.T18,
    director: 'David Fincher',
    cast: [
      { name: 'Brad Pitt', character: 'Tyler Durden' },
      { name: 'Edward Norton', character: 'The Narrator' },
      { name: 'Helena Bonham Carter', character: 'Marla Singer' },
    ],
    genres: ['Chính kịch', 'Giật gân'],
  },
  {
    title: 'Forrest Gump',
    originalTitle: 'Forrest Gump',
    overview: 'Cuộc đời phi thường của Forrest Gump - người đàn ông IQ thấp nhưng vô tình trở thành chứng nhân lịch sử nước Mỹ.',
    runtime: 142,
    releaseDate: '1994-07-06',
    ageRating: AgeRating.T13,
    director: 'Robert Zemeckis',
    cast: [
      { name: 'Tom Hanks', character: 'Forrest Gump' },
      { name: 'Robin Wright', character: 'Jenny Curran' },
      { name: 'Gary Sinise', character: 'Lt. Dan Taylor' },
    ],
    genres: ['Chính kịch', 'Lãng mạn'],
  },
  {
    title: 'Ma Trận',
    originalTitle: 'The Matrix',
    overview: 'Neo phát hiện thế giới thực chỉ là mô phỏng máy tính, gia nhập cuộc chiến chống lại AI thống trị nhân loại.',
    runtime: 136,
    releaseDate: '1999-03-31',
    ageRating: AgeRating.T16,
    director: 'The Wachowskis',
    cast: [
      { name: 'Keanu Reeves', character: 'Neo' },
      { name: 'Laurence Fishburne', character: 'Morpheus' },
      { name: 'Carrie-Anne Moss', character: 'Trinity' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng'],
  },
  {
    title: 'Kẻ Cắp Giấc Mơ',
    originalTitle: 'Paprika',
    overview: 'Thiết bị cho phép bác sĩ trị liệu xâm nhập giấc mơ bệnh nhân bị đánh cắp, gây ra hỗn loạn giữa thực và mơ.',
    runtime: 90,
    releaseDate: '2006-11-25',
    ageRating: AgeRating.T13,
    director: 'Satoshi Kon',
    cast: [
      { name: 'Megumi Hayashibara', character: 'Dr. Atsuko Chiba/Paprika (lồng tiếng)' },
      { name: 'Tōru Emori', character: 'Dr. Kōsaku Tokita (lồng tiếng)' },
    ],
    genres: ['Hoạt hình', 'Khoa học viễn tưởng', 'Bí ẩn'],
  },
  // ==== 6 More Trending 2024 Movies ====
  {
    title: 'Venom: The Last Dance',
    originalTitle: 'Venom: The Last Dance',
    overview: 'Eddie Brock và Venom phải đối mặt với cuộc săn lùng từ cả Trái Đất và Symbiote trong cuộc phiêu lưu cuối cùng.',
    runtime: 109,
    releaseDate: '2024-10-25',
    ageRating: AgeRating.T13,
    director: 'Kelly Marcel',
    cast: [
      { name: 'Tom Hardy', character: 'Eddie Brock/Venom' },
      { name: 'Chiwetel Ejiofor', character: 'General Strickland' },
      { name: 'Juno Temple', character: 'Dr. Teddy Paine' },
    ],
    genres: ['Hành động', 'Khoa học viễn tưởng'],
  },
  {
    title: 'Wicked - Phù Thủy Xanh',
    originalTitle: 'Wicked',
    overview: 'Câu chuyện về tình bạn giữa Elphaba xanh và Glinda hồng trước khi trở thành phù thủy xấu xa và phù thủy tốt lành ở xứ Oz.',
    runtime: 160,
    releaseDate: '2024-11-22',
    ageRating: AgeRating.P,
    director: 'Jon M. Chu',
    cast: [
      { name: 'Cynthia Erivo', character: 'Elphaba' },
      { name: 'Ariana Grande', character: 'Glinda' },
      { name: 'Jonathan Bailey', character: 'Fiyero' },
    ],
    genres: ['Âm nhạc', 'Viễn tưởng', 'Chính kịch'],
  },
  {
    title: 'Moana 2 - Hành Trình Của Moana 2',
    originalTitle: 'Moana 2',
    overview: 'Moana nhận được lời gọi từ tổ tiên và phải vượt qua đại dương xa xôi cùng đoàn thủy thủ mới.',
    runtime: 100,
    releaseDate: '2024-11-27',
    ageRating: AgeRating.P,
    director: 'David Derrick Jr., Jason Hand, Dana Ledoux Miller',
    cast: [
      { name: 'Auli\'i Cravalho', character: 'Moana (lồng tiếng)' },
      { name: 'Dwayne Johnson', character: 'Maui (lồng tiếng)' },
    ],
    genres: ['Hoạt hình', 'Gia đình', 'Phiêu lưu'],
  },
  {
    title: 'Beetlejuice Beetlejuice',
    originalTitle: 'Beetlejuice Beetlejuice',
    overview: 'Sau bi kịch gia đình, ba thế hệ phụ nữ nhà Deetz trở về Winter River và Lydia vô tình mở cánh cửa đến thế giới người chết.',
    runtime: 104,
    releaseDate: '2024-09-06',
    ageRating: AgeRating.T13,
    director: 'Tim Burton',
    cast: [
      { name: 'Michael Keaton', character: 'Beetlejuice' },
      { name: 'Winona Ryder', character: 'Lydia Deetz' },
      { name: 'Jenna Ortega', character: 'Astrid Deetz' },
    ],
    genres: ['Hài', 'Viễn tưởng', 'Kinh dị'],
  },
  {
    title: 'Deadpool 3 & Wolverine',
    originalTitle: 'Deadpool & Wolverine',
    overview: 'Deadpool bị TVA bắt và phải hợp tác với phiên bản Wolverine từ vũ trụ khác để cứu đa vũ trụ khỏi sụp đổ.',
    runtime: 127,
    releaseDate: '2024-07-26',
    ageRating: AgeRating.T18,
    director: 'Shawn Levy',
    cast: [
      { name: 'Ryan Reynolds', character: 'Wade Wilson/Deadpool' },
      { name: 'Hugh Jackman', character: 'Logan/Wolverine' },
      { name: 'Emma Corrin', character: 'Cassandra Nova' },
    ],
    genres: ['Hành động', 'Hài', 'Khoa học viễn tưởng'],
  },
  {
    title: 'It Ends With Us - Chấm Dứt Ở Đây',
    originalTitle: 'It Ends With Us',
    overview: 'Lily Bloom vượt qua tuổi thơ khó khăn để mở tiệm hoa, nhưng mối quan hệ với bác sĩ quyến rũ khơi lại vết thương cũ.',
    runtime: 130,
    releaseDate: '2024-08-09',
    ageRating: AgeRating.T13,
    director: 'Justin Baldoni',
    cast: [
      { name: 'Blake Lively', character: 'Lily Bloom' },
      { name: 'Justin Baldoni', character: 'Ryle Kincaid' },
      { name: 'Brandon Sklenar', character: 'Atlas Corrigan' },
    ],
    genres: ['Lãng mạn', 'Chính kịch'],
  },
];

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function main() {
  console.log('🌱 Seeding Movie Service database - BATCH 1 (50 movies)...');

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

  // Insert movies
  let successCount = 0;
  const allReviews: any[] = [];

  for (const movieData of movies) {
    try {
      const movieId = generateUUID();
      const releaseId = generateUUID();

      const movie = await prisma.movie.create({
        data: {
          id: movieId,
          title: movieData.title,
          originalTitle: movieData.originalTitle,
          overview: movieData.overview,
          posterUrl: `https://via.placeholder.com/500x750?text=${encodeURIComponent(movieData.title.slice(0, 20))}`,
          trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          backdropUrl: `https://via.placeholder.com/1920x1080?text=${encodeURIComponent(movieData.title.slice(0, 20))}`,
          runtime: movieData.runtime,
          releaseDate: new Date(movieData.releaseDate),
          ageRating: movieData.ageRating,
          originalLanguage: 'en',
          spokenLanguages: ['vi', 'en'],
          productionCountry: 'Hoa Kỳ',
          languageType: LanguageOption.SUBTITLE,
          director: movieData.director,
          cast: movieData.cast,
        },
      });

      await prisma.movieRelease.create({
        data: {
          id: releaseId,
          movieId: movie.id,
          startDate: new Date('2025-12-01'),
          endDate: new Date('2026-03-01'),
          note: 'Lịch chiếu Tết 2026',
        },
      });

      // Create genres
      for (const genreName of movieData.genres) {
        if (genreByName[genreName]) {
          await prisma.movieGenre.create({
            data: {
              movieId: movie.id,
              genreId: genreByName[genreName],
            },
          });
        }
      }

      // Generate 0-3 reviews per movie
      const reviewCount = Math.floor(Math.random() * 4);
      for (let i = 0; i < reviewCount; i++) {
        allReviews.push({
          movieId: movie.id,
          userId: `user-customer-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 rating
          content: ['Phim hay!', 'Đáng xem!', 'Tuyệt vời!', 'Rất ấn tượng!'][Math.floor(Math.random() * 4)],
        });
      }

      successCount++;
      console.log(`✅ [${successCount}/${movies.length}] ${movieData.title}`);
    } catch (error) {
      console.error(`❌ Failed: ${movieData.title}`, error);
    }
  }

  // Insert reviews
  if (allReviews.length > 0) {
    await prisma.review.createMany({ data: allReviews });
  }

  console.log(`\n🎉 BATCH 1 Complete!`);
  console.log(`✅ Movies: ${successCount}/${movies.length}`);
  console.log(`✅ Reviews: ${allReviews.length}`);
  console.log(`\n📝 Next: Run seed-batch2.ts for movies 51-100`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
