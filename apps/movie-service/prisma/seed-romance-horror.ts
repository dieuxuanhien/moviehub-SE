import { getSeedPosterUrl, getSeedTrailerUrl, getSeedReleaseData } from './seed-helper';
import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * ROMANCE & HORROR BATCH: 35 Movies
 * 20 Romance + 15 Horror movies to improve recommendation accuracy
 */

const movies = [
  // ==== ROMANCE MOVIES (20) ====
  {
    title: 'The Notebook - Nhật Ký Tình Yêu',
    originalTitle: 'The Notebook',
    overview: 'Câu chuyện tình yêu xuyên thập kỷ giữa Noah và Allie - hai trái tim từ hai thế giới khác biệt được kể lại qua những trang nhật ký đẫm nước mắt.',
    runtime: 123,
    releaseDate: '2004-06-25',
    ageRating: AgeRating.T13,
    director: 'Nick Cassavetes',
    cast: [
      { name: 'Ryan Gosling', character: 'Noah' },
      { name: 'Rachel McAdams', character: 'Allie' },
    ],
    genres: ['Lãng mạn', 'Chính kịch'],
  },
  {
    title: 'Pride and Prejudice - Kiêu Hãnh Và Định Kiến',
    originalTitle: 'Pride and Prejudice',
    overview: 'Elizabeth Bennet gặp gỡ và dần thay đổi ấn tượng với Mr. Darcy - người đàn ông kiêu ngạo nhưng đầy bí ẩn trong nước Anh thế kỷ 19.',
    runtime: 129,
    releaseDate: '2005-11-11',
    ageRating: AgeRating.P,
    director: 'Joe Wright',
    cast: [
      { name: 'Keira Knightley', character: 'Elizabeth Bennet' },
      { name: 'Matthew Macfadyen', character: 'Mr. Darcy' },
    ],
    genres: ['Lãng mạn', 'Chính kịch', 'Lịch sử'],
  },
  {
    title: 'Romeo + Juliet',
    originalTitle: 'Romeo + Juliet',
    overview: 'Chuyển thể hiện đại hóa bi kịch tình yêu bất hủ của Shakespeare với hai gia đình thù địch ở Verona Beach.',
    runtime: 120,
    releaseDate: '1996-11-01',
    ageRating: AgeRating.T13,
    director: 'Baz Luhrmann',
    cast: [
      { name: 'Leonardo DiCaprio', character: 'Romeo' },
      { name: 'Claire Danes', character: 'Juliet' },
    ],
    genres: ['Lãng mạn', 'Chính kịch'],
  },
  {
    title: 'Eternal Sunshine of the Spotless Mind - Ký Ức Tỏa Sáng',
    originalTitle: 'Eternal Sunshine of the Spotless Mind',
    overview: 'Joel phát hiện bạn gái cũ đã xóa anh khỏi ký ức. Anh quyết định làm điều tương tự nhưng nhận ra mình không muốn quên cô.',
    runtime: 108,
    releaseDate: '2004-03-19',
    ageRating: AgeRating.T16,
    director: 'Michel Gondry',
    cast: [
      { name: 'Jim Carrey', character: 'Joel' },
      { name: 'Kate Winslet', character: 'Clementine' },
    ],
    genres: ['Lãng mạn', 'Khoa học viễn tưởng', 'Chính kịch'],
  },
  {
    title: 'Before Sunrise - Trước Bình Minh',
    originalTitle: 'Before Sunrise',
    overview: 'Jesse và Céline gặp nhau trên chuyến tàu và quyết định dành một đêm lang thang Vienna, trò chuyện về cuộc sống và tình yêu.',
    runtime: 101,
    releaseDate: '1995-01-27',
    ageRating: AgeRating.T13,
    director: 'Richard Linklater',
    cast: [
      { name: 'Ethan Hawke', character: 'Jesse' },
      { name: 'Julie Delpy', character: 'Céline' },
    ],
    genres: ['Lãng mạn', 'Chính kịch'],
  },
  {
    title: 'When Harry Met Sally - Khi Harry Gặp Sally',
    originalTitle: 'When Harry Met Sally',
    overview: 'Harry và Sally gặp nhau nhiều lần qua năm tháng, tranh luận liệu đàn ông và phụ nữ có thể chỉ là bạn không.',
    runtime: 95,
    releaseDate: '1989-07-14',
    ageRating: AgeRating.T13,
    director: 'Rob Reiner',
    cast: [
      { name: 'Billy Crystal', character: 'Harry' },
      { name: 'Meg Ryan', character: 'Sally' },
    ],
    genres: ['Lãng mạn', 'Hài'],
  },
  {
    title: 'Sleepless in Seattle - Đêm Không Ngủ Ở Seattle',
    originalTitle: 'Sleepless in Seattle',
    overview: 'Sam mất vợ và con trai anh gọi điện đài để tìm mẹ mới. Annie nghe được và bị cuốn hút bởi câu chuyện của họ.',
    runtime: 105,
    releaseDate: '1993-06-25',
    ageRating: AgeRating.P,
    director: 'Nora Ephron',
    cast: [
      { name: 'Tom Hanks', character: 'Sam' },
      { name: 'Meg Ryan', character: 'Annie' },
    ],
    genres: ['Lãng mạn', 'Hài', 'Chính kịch'],
  },
  {
    title: 'Crazy Rich Asians - Con Nhà Siêu Giàu Châu Á',
    originalTitle: 'Crazy Rich Asians',
    overview: 'Rachel đến Singapore cùng bạn trai Nick và phát hiện anh thuộc gia đình giàu có bậc nhất châu Á.',
    runtime: 120,
    releaseDate: '2018-08-15',
    ageRating: AgeRating.T13,
    director: 'Jon M. Chu',
    cast: [
      { name: 'Constance Wu', character: 'Rachel' },
      { name: 'Henry Golding', character: 'Nick' },
    ],
    genres: ['Lãng mạn', 'Hài', 'Chính kịch'],
  },
  {
    title: 'The Proposal - Lời Cầu Hôn',
    originalTitle: 'The Proposal',
    overview: 'Sếp Margaret ép nhân viên Andrew giả vờ đính hôn để tránh bị trục xuất. Họ phải thuyết phục gia đình anh ở Alaska.',
    runtime: 108,
    releaseDate: '2009-06-19',
    ageRating: AgeRating.T13,
    director: 'Anne Fletcher',
    cast: [
      { name: 'Sandra Bullock', character: 'Margaret' },
      { name: 'Ryan Reynolds', character: 'Andrew' },
    ],
    genres: ['Lãng mạn', 'Hài'],
  },
  {
    title: '50 First Dates - 50 Lần Hẹn Đầu Tiên',
    originalTitle: '50 First Dates',
    overview: 'Henry yêu Lucy nhưng cô bị mất trí nhớ ngắn hạn và mỗi ngày thức dậy đều quên mọi thứ. Anh phải khiến cô yêu mình lại mỗi ngày.',
    runtime: 99,
    releaseDate: '2004-02-13',
    ageRating: AgeRating.T13,
    director: 'Peter Segal',
    cast: [
      { name: 'Adam Sandler', character: 'Henry' },
      { name: 'Drew Barrymore', character: 'Lucy' },
    ],
    genres: ['Lãng mạn', 'Hài'],
  },
  {
    title: 'Me Before You - Trước Ngày Em Đến',
    originalTitle: 'Me Before You',
    overview: 'Louisa trở thành người chăm sóc Will - chàng trai bị liệt sau tai nạn. Hai người dần yêu nhau dù biết thời gian không còn nhiều.',
    runtime: 110,
    releaseDate: '2016-06-03',
    ageRating: AgeRating.T13,
    director: 'Thea Sharrock',
    cast: [
      { name: 'Emilia Clarke', character: 'Louisa' },
      { name: 'Sam Claflin', character: 'Will' },
    ],
    genres: ['Lãng mạn', 'Chính kịch'],
  },
  {
    title: 'P.S. I Love You - Tái Bút: Anh Yêu Em',
    originalTitle: 'P.S. I Love You',
    overview: 'Holly nhận được những lá thư từ người chồng đã mất, hướng dẫn cô từng bước vượt qua nỗi đau và tiếp tục sống.',
    runtime: 126,
    releaseDate: '2007-12-21',
    ageRating: AgeRating.T13,
    director: 'Richard LaGravenese',
    cast: [
      { name: 'Hilary Swank', character: 'Holly' },
      { name: 'Gerard Butler', character: 'Gerry' },
    ],
    genres: ['Lãng mạn', 'Chính kịch'],
  },
  {
    title: 'About Time - Yêu Đi, Đừng Sợ',
    originalTitle: 'About Time',
    overview: 'Tim phát hiện anh có thể du hành thời gian và dùng khả năng này để tìm tình yêu đích thực.',
    runtime: 123,
    releaseDate: '2013-11-01',
    ageRating: AgeRating.T13,
    director: 'Richard Curtis',
    cast: [
      { name: 'Domhnall Gleeson', character: 'Tim' },
      { name: 'Rachel McAdams', character: 'Mary' },
    ],
    genres: ['Lãng mạn', 'Hài', 'Viễn tưởng'],
  },
  {
    title: 'Your Name - Tên Cậu Là Gì',
    originalTitle: 'Kimi no Na wa',
    overview: 'Mitsuha và Taki hoán đổi thân xác trong giấc mơ và cố gắng tìm nhau trong thế giới thực.',
    runtime: 106,
    releaseDate: '2016-08-26',
    ageRating: AgeRating.P,
    director: 'Makoto Shinkai',
    cast: [
      { name: 'Ryunosuke Kamiki', character: 'Taki (giọng nói)' },
      { name: 'Mone Kamishiraishi', character: 'Mitsuha (giọng nói)' },
    ],
    genres: ['Lãng mạn', 'Hoạt hình', 'Viễn tưởng'],
  },
  {
    title: '10 Things I Hate About You - 10 Điều Em Ghét Ở Anh',
    originalTitle: '10 Things I Hate About You',
    overview: 'Chuyển thể hiện đại The Taming of the Shrew: Bianca chỉ được hẹn hò khi chị gái khó tính Kat có bạn trai.',
    runtime: 97,
    releaseDate: '1999-03-31',
    ageRating: AgeRating.T13,
    director: 'Gil Junger',
    cast: [
      { name: 'Julia Stiles', character: 'Kat' },
      { name: 'Heath Ledger', character: 'Patrick' },
    ],
    genres: ['Lãng mạn', 'Hài'],
  },
  {
    title: 'How to Lose a Guy in 10 Days - Mất Anh Trong 10 Ngày',
    originalTitle: 'How to Lose a Guy in 10 Days',
    overview: 'Nhà báo Andie viết bài về cách khiến đàn ông chia tay trong 10 ngày. Ben cá cược anh có thể khiến bất kỳ ai yêu mình trong 10 ngày.',
    runtime: 116,
    releaseDate: '2003-02-07',
    ageRating: AgeRating.T13,
    director: 'Donald Petrie',
    cast: [
      { name: 'Kate Hudson', character: 'Andie' },
      { name: 'Matthew McConaughey', character: 'Ben' },
    ],
    genres: ['Lãng mạn', 'Hài'],
  },
  {
    title: 'Notting Hill - Hẹn Hò Ở Notting Hill',
    originalTitle: 'Notting Hill',
    overview: 'Chủ hiệu sách bình thường William tình cờ gặp và yêu ngôi sao Hollywood Anna Scott.',
    runtime: 124,
    releaseDate: '1999-05-28',
    ageRating: AgeRating.T13,
    director: 'Roger Michell',
    cast: [
      { name: 'Hugh Grant', character: 'William' },
      { name: 'Julia Roberts', character: 'Anna' },
    ],
    genres: ['Lãng mạn', 'Hài'],
  },
  {
    title: 'The Fault in Our Stars - Lỗi Tại Ngôi Sao',
    originalTitle: 'The Fault in Our Stars',
    overview: 'Hazel và Augustus - hai bệnh nhân ung thư tuổi teen - yêu nhau và cùng nhau đối mặt với cuộc sống ngắn ngủi.',
    runtime: 126,
    releaseDate: '2014-06-06',
    ageRating: AgeRating.T13,
    director: 'Josh Boone',
    cast: [
      { name: 'Shailene Woodley', character: 'Hazel' },
      { name: 'Ansel Elgort', character: 'Augustus' },
    ],
    genres: ['Lãng mạn', 'Chính kịch'],
  },
  {
    title: 'La La Land - Những Kẻ Mộng Mơ',
    originalTitle: 'La La Land',
    overview: 'Mia - nữ diễn viên chạy bàn và Sebastian - nhạc sĩ jazz yêu nhau trong thành phố Los Angeles, nhưng tham vọng dần kéo họ xa nhau.',
    runtime: 128,
    releaseDate: '2016-12-09',
    ageRating: AgeRating.T13,
    director: 'Damien Chazelle',
    cast: [
      { name: 'Ryan Gosling', character: 'Sebastian' },
      { name: 'Emma Stone', character: 'Mia' },
    ],
    genres: ['Lãng mạn', 'Âm nhạc', 'Chính kịch'],
  },
  {
    title: 'To All the Boys I\'ve Loved Before - Những Chàng Trai Năm Ấy',
    originalTitle: 'To All the Boys I\'ve Loved Before',
    overview: 'Thư tình bí mật của Lara Jean bất ngờ được gửi đến 5 crush cũ, xáo trộn hoàn toàn cuộc sống của cô.',
    runtime: 99,
    releaseDate: '2018-08-17',
    ageRating: AgeRating.T13,
    director: 'Susan Johnson',
    cast: [
      { name: 'Lana Condor', character: 'Lara Jean' },
      { name: 'Noah Centineo', character: 'Peter' },
    ],
    genres: ['Lãng mạn', 'Hài'],
  },

  // ==== HORROR MOVIES (15) ====
  {
    title: 'The Shining - Khách Sạn Ma Quái',
    originalTitle: 'The Shining',
    overview: 'Jack Torrance đưa gia đình đến làm quản lý khách sạn Overlook mùa đông. Nơi đây dần nuốt chửng tâm trí anh vào điên loạn.',
    runtime: 146,
    releaseDate: '1980-05-23',
    ageRating: AgeRating.T18,
    director: 'Stanley Kubrick',
    cast: [
      { name: 'Jack Nicholson', character: 'Jack Torrance' },
      { name: 'Shelley Duvall', character: 'Wendy' },
    ],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'The Exorcist - Quỷ Ám',
    originalTitle: 'The Exorcist',
    overview: 'Regan 12 tuổi bị quỷ ám. Mẹ cô cầu cứu hai cha xứ thực hiện nghi thức trừ tà.',
    runtime: 122,
    releaseDate: '1973-12-26',
    ageRating: AgeRating.T18,
    director: 'William Friedkin',
    cast: [
      { name: 'Linda Blair', character: 'Regan' },
      { name: 'Ellen Burstyn', character: 'Chris' },
    ],
    genres: ['Kinh dị'],
  },
  {
    title: 'A Nightmare on Elm Street - Ác Mộng Phố Elm',
    originalTitle: 'A Nightmare on Elm Street',
    overview: 'Freddy Krueger - kẻ giết người có móng vuốt dao cạo - tấn công các thiếu niên trong giấc mơ. Ngủ là chết.',
    runtime: 91,
    releaseDate: '1984-11-09',
    ageRating: AgeRating.T18,
    director: 'Wes Craven',
    cast: [
      { name: 'Robert Englund', character: 'Freddy Krueger' },
      { name: 'Heather Langenkamp', character: 'Nancy' },
    ],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'Friday the 13th - Thứ Sáu Ngày 13',
    originalTitle: 'Friday the 13th',
    overview: 'Một nhóm cố vấn trại hè bị sát hại lần lượt tại Trại Crystal Lake - nơi có lịch sử chết chóc.',
    runtime: 95,
    releaseDate: '1980-05-09',
    ageRating: AgeRating.T18,
    director: 'Sean S. Cunningham',
    cast: [
      { name: 'Betsy Palmer', character: 'Mrs. Voorhees' },
      { name: 'Adrienne King', character: 'Alice' },
    ],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'Halloween (2018)',
    originalTitle: 'Halloween',
    overview: '40 năm sau đêm kinh hoàng, Michael Myers trốn thoát và trở lại Haddonfield để hoàn thành việc dang dở với Laurie.',
    runtime: 106,
    releaseDate: '2018-10-19',
    ageRating: AgeRating.T18,
    director: 'David Gordon Green',
    cast: [
      { name: 'Jamie Lee Curtis', character: 'Laurie Strode' },
      { name: 'Nick Castle', character: 'Michael Myers' },
    ],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'The Ring - Vòng Tròn Kinh Hoàng',
    originalTitle: 'The Ring',
    overview: 'Sau khi xem một đoạn băng bí ẩn, người xem sẽ chết trong 7 ngày. Nhà báo Rachel phải giải mã bí ẩn trước khi hết thời gian.',
    runtime: 115,
    releaseDate: '2002-10-18',
    ageRating: AgeRating.T16,
    director: 'Gore Verbinski',
    cast: [
      { name: 'Naomi Watts', character: 'Rachel' },
      { name: 'Martin Henderson', character: 'Noah' },
    ],
    genres: ['Kinh dị', 'Bí ẩn'],
  },
  {
    title: 'Sinister - Điềm Báo Tử Thần',
    originalTitle: 'Sinister',
    overview: 'Nhà văn phát hiện hộp phim trong gác xép ghi lại các vụ giết người. Càng xem, anh càng bị cuốn vào thế lực đen tối.',
    runtime: 110,
    releaseDate: '2012-10-12',
    ageRating: AgeRating.T18,
    director: 'Scott Derrickson',
    cast: [
      { name: 'Ethan Hawke', character: 'Ellison' },
      { name: 'Juliet Rylance', character: 'Tracy' },
    ],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'Insidious - Quỷ Quyệt',
    originalTitle: 'Insidious',
    overview: 'Con trai nhà Lambert rơi vào hôn mê bí ẩn và trở thành mục tiêu của các thực thể siêu nhiên.',
    runtime: 103,
    releaseDate: '2010-09-14',
    ageRating: AgeRating.T16,
    director: 'James Wan',
    cast: [
      { name: 'Patrick Wilson', character: 'Josh' },
      { name: 'Rose Byrne', character: 'Renai' },
    ],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'Annabelle',
    originalTitle: 'Annabelle',
    overview: 'Búp bê vintage trở thành vật chứa quỷ dữ sau khi thành viên giáo phái sa-tan bị giết. Nó bắt đầu ám gia đình mới.',
    runtime: 99,
    releaseDate: '2014-10-03',
    ageRating: AgeRating.T16,
    director: 'John R. Leonetti',
    cast: [
      { name: 'Annabelle Wallis', character: 'Mia' },
      { name: 'Ward Horton', character: 'John' },
    ],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'The Nun - Ác Quỷ Ma Sơ',
    originalTitle: 'The Nun',
    overview: 'Một linh mục và nữ tu triệu hồi đến tu viện Romania điều tra cái chết bí ẩn của một ma sơ.',
    runtime: 96,
    releaseDate: '2018-09-07',
    ageRating: AgeRating.T16,
    director: 'Corin Hardy',
    cast: [
      { name: 'Demián Bichir', character: 'Cha Burke' },
      { name: 'Taissa Farmiga', character: 'Irene' },
    ],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'Ringu - Vòng Tròn Định Mệnh',
    originalTitle: 'Ringu',
    overview: 'Phiên bản gốc Nhật Bản: Sau khi xem cuộn băng bị nguyền rủa, người xem có 7 ngày trước khi chết.',
    runtime: 96,
    releaseDate: '1998-01-31',
    ageRating: AgeRating.T16,
    director: 'Hideo Nakata',
    cast: [
      { name: 'Nanako Matsushima', character: 'Reiko' },
      { name: 'Miki Nakatani', character: 'Mai' },
    ],
    genres: ['Kinh dị', 'Bí ẩn'],
  },
  {
    title: 'Ju-On: The Grudge - Lời Nguyền',
    originalTitle: 'Ju-On: The Grudge',
    overview: 'Ngôi nhà nơi xảy ra vụ giết người tàn bạo trở thành nơi ẩn náu của oán hồn, gieo rắc lời nguyền chết chóc.',
    runtime: 92,
    releaseDate: '2002-10-18',
    ageRating: AgeRating.T16,
    director: 'Takashi Shimizu',
    cast: [
      { name: 'Megumi Okina', character: 'Rika' },
      { name: 'Misaki Ito', character: 'Hitomi' },
    ],
    genres: ['Kinh dị'],
  },
  {
    title: 'A Tale of Two Sisters - Câu Chuyện Hai Chị Em',
    originalTitle: 'Janghwa, Hongryeon',
    overview: 'Hai chị em trở về nhà sau thời gian điều trị tâm lý, phải đối mặt với mẹ kế lạnh lùng và bí mật đen tối của gia đình.',
    runtime: 115,
    releaseDate: '2003-06-13',
    ageRating: AgeRating.T16,
    director: 'Kim Jee-woon',
    cast: [
      { name: 'Im Soo-jung', character: 'Su-mi' },
      { name: 'Moon Geun-young', character: 'Su-yeon' },
    ],
    genres: ['Kinh dị', 'Giật gân', 'Bí ẩn'],
  },
  {
    title: 'Smile - Cười',
    originalTitle: 'Smile',
    overview: 'Sau khi chứng kiến bệnh nhân tự sát với nụ cười kỳ dị, bác sĩ tâm lý bắt đầu bị ám ảnh bởi những thực thể mỉm cười.',
    runtime: 115,
    releaseDate: '2022-09-30',
    ageRating: AgeRating.T18,
    director: 'Parker Finn',
    cast: [
      { name: 'Sosie Bacon', character: 'Rose' },
      { name: 'Kyle Gallner', character: 'Joel' },
    ],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'M3GAN - Búp Bê Sát Nhân',
    originalTitle: 'M3GAN',
    overview: 'Robot AI hình búp bê được tạo ra để bảo vệ cô bé mồ côi, nhưng nó trở nên quá bảo vệ và sẵn sàng giết bất kỳ ai đe dọa.',
    runtime: 102,
    releaseDate: '2023-01-06',
    ageRating: AgeRating.T16,
    director: 'Gerard Johnstone',
    cast: [
      { name: 'Allison Williams', character: 'Gemma' },
      { name: 'Violet McGraw', character: 'Cady' },
    ],
    genres: ['Kinh dị', 'Khoa học viễn tưởng', 'Giật gân'],
  },
];

// UUID generator (deterministic based on title)
function generateUUID(title: string): string {
  // Simple hash function for deterministic UUID
  let hash = 0;
  const str = title + '-romance-horror-batch';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(32, '0');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

async function main() {
  console.log('🎬 ROMANCE & HORROR BATCH: Adding 35 movies...\n');

  // Get genres
  const genres = await prisma.genre.findMany();
  const genreByName: Record<string, string> = {};
  for (const g of genres) {
    genreByName[g.name] = g.id;
  }

  let successCount = 0;
  const allReviews: any[] = [];

  for (const movieData of movies) {
    try {
      const movieId = generateUUID(movieData.title);

      // Check if movie already exists
      const existing = await prisma.movie.findUnique({ where: { id: movieId } });
      if (existing) {
        console.log(`⏭️  Skipping (exists): ${movieData.title}`);
        continue;
      }

      // Create movie
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
          cast: movieData.cast,
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

      // Generate 2-4 reviews per movie
      const reviewCount = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < reviewCount; i++) {
        allReviews.push({
          movieId: movie.id,
          userId: `user-customer-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
          rating: Math.floor(Math.random() * 2) + 4,
          content: ['Phim hay!', 'Đáng xem!', 'Tuyệt vời!', 'Rất cảm động!', 'Kinh dị thật sự!'][Math.floor(Math.random() * 5)],
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

  console.log(`\n🎉 ROMANCE & HORROR BATCH Complete!`);
  console.log(`✅ Movies: ${successCount}/${movies.length}`);
  console.log(`✅ Reviews: ${allReviews.length}`);
  console.log(`\n📝 Next: Run embedding generation for new movies`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
