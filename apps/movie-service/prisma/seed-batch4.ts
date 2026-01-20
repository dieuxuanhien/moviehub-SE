import { getSeedPosterUrl, getSeedTrailerUrl, getSeedReleaseData } from './seed-helper';
import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma';

const prisma = new PrismaClient();

/**
 * BATCH 4: 50 Trending/Popular Films (2015-2025)
 * Focus: Recent blockbusters, award winners, and viral hits
 */

const movieData = [
  // === RECENT BLOCKBUSTERS 2022-2025 ===
  {
    title: 'Everything Everywhere All at Once - Cuộc Chiến Đa Vũ Trụ',
    originalTitle: 'Everything Everywhere All at Once',
    overview: 'Một phụ nữ nhập cư gốc Hoa bị cuốn vào cuộc phiêu lưu điên rồ khi cô phải kết nối các phiên bản của mình từ các vũ trụ song song để cứu thế giới.',
    runtime: 139,
    releaseDate: '2022-03-25',
    ageRating: AgeRating.T16,
    director: 'Daniel Kwan, Daniel Scheinert',
    cast: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan', 'Jamie Lee Curtis'],
    genres: ['Hành động', 'Kỳ ảo', 'Khoa học viễn tưởng', 'Hài hước'],
  },
  {
    title: 'Barbie',
    originalTitle: 'Barbie',
    overview: 'Barbie sống ở vùng đất Barbie hoàn hảo bị trục xuất vì không hoàn hảo. Cô phải du hành đến thế giới thực để tìm lại chính mình.',
    runtime: 114,
    releaseDate: '2023-07-21',
    ageRating: AgeRating.T13,
    director: 'Greta Gerwig',
    cast: ['Margot Robbie', 'Ryan Gosling', 'Will Ferrell', 'America Ferrera'],
    genres: ['Hài hước', 'Kỳ ảo', 'Phiêu lưu'],
  },
  {
    title: 'Poor Things - Những Người Khốn Khổ',
    originalTitle: 'Poor Things',
    overview: 'Bella Baxter được hồi sinh bởi một nhà khoa học lập dị và bắt đầu khám phá thế giới với tâm hồn ngây thơ của trẻ nhỏ.',
    runtime: 141,
    releaseDate: '2023-12-08',
    ageRating: AgeRating.T18,
    director: 'Yorgos Lanthimos',
    cast: ['Emma Stone', 'Mark Ruffalo', 'Willem Dafoe', 'Ramy Youssef'],
    genres: ['Khoa học viễn tưởng', 'Lãng mạn', 'Hài hước'],
  },
  {
    title: 'Killers of the Flower Moon - Những Kẻ Sát Nhân',
    originalTitle: 'Killers of the Flower Moon',
    overview: 'Những năm 1920, những vụ giết người bí ẩn xảy ra với người Osage giàu có ở Oklahoma dẫn đến cuộc điều tra FBI quan trọng.',
    runtime: 206,
    releaseDate: '2023-10-20',
    ageRating: AgeRating.T16,
    director: 'Martin Scorsese',
    cast: ['Leonardo DiCaprio', 'Robert De Niro', 'Lily Gladstone', 'Jesse Plemons'],
    genres: ['Tội phạm', 'Chính kịch', 'Lịch sử'],
  },
  {
    title: 'Saltburn',
    originalTitle: 'Saltburn',
    overview: 'Sinh viên Oxford được mời đến dinh thự xa hoa của bạn giàu có và bị cuốn vào thế giới quyến rũ đầy bí ẩn.',
    runtime: 131,
    releaseDate: '2023-11-17',
    ageRating: AgeRating.T18,
    director: 'Emerald Fennell',
    cast: ['Barry Keoghan', 'Jacob Elordi', 'Rosamund Pike', 'Richard E. Grant'],
    genres: ['Giật gân', 'Chính kịch', 'Hài hước đen'],
  },
  {
    title: 'Past Lives - Những Kiếp Trước',
    originalTitle: 'Past Lives',
    overview: 'Hai người bạn thời thơ ấu Hàn Quốc gặp lại nhau 24 năm sau ở New York và đối mặt với ký ức, tình yêu và số phận.',
    runtime: 106,
    releaseDate: '2023-06-02',
    ageRating: AgeRating.T13,
    director: 'Celine Song',
    cast: ['Greta Lee', 'Teo Yoo', 'John Magaro'],
    genres: ['Chính kịch', 'Lãng mạn'],
  },
  {
    title: 'The Holdovers - Những Kẻ Ở Lại',
    originalTitle: 'The Holdovers',
    overview: 'Thầy giáo khó tính phải ở lại trường nội trú trong kỳ nghỉ Giáng sinh cùng học sinh bị bỏ rơi và đầu bếp đang đau buồn.',
    runtime: 133,
    releaseDate: '2023-10-27',
    ageRating: AgeRating.T13,
    director: 'Alexander Payne',
    cast: ['Paul Giamatti', 'Da\'Vine Joy Randolph', 'Dominic Sessa'],
    genres: ['Chính kịch', 'Hài hước'],
  },
  {
    title: 'Anatomy of a Fall - Giải Mã Tội Ác',
    originalTitle: 'Anatomie d\'une chute',
    overview: 'Một nhà văn bị buộc tội giết chồng, và con trai mù phải quyết định tin ai trong phiên tòa.',
    runtime: 151,
    releaseDate: '2023-08-23',
    ageRating: AgeRating.T16,
    director: 'Justine Triet',
    cast: ['Sandra Hüller', 'Swann Arlaud', 'Milo Machado Graner'],
    genres: ['Chính kịch', 'Giật gân', 'Pháp đình'],
  },
  {
    title: 'The Zone of Interest - Vùng Ảnh Hưởng',
    originalTitle: 'The Zone of Interest',
    overview: 'Cuộc sống bình thường của gia đình chỉ huy trại Auschwitz ngay bên cạnh tường rào trại tập trung.',
    runtime: 105,
    releaseDate: '2023-12-15',
    ageRating: AgeRating.T16,
    director: 'Jonathan Glazer',
    cast: ['Christian Friedel', 'Sandra Hüller', 'Medusa Knopf'],
    genres: ['Chính kịch', 'Lịch sử', 'Chiến tranh'],
  },
  {
    title: 'Elemental - Những Mảnh Ghép Yêu Thương',
    originalTitle: 'Elemental',
    overview: 'Trong thành phố nơi cư dân là lửa, nước, đất và không khí, cô gái lửa và chàng trai nước khám phá tình bạn bất chấp sự khác biệt.',
    runtime: 93,
    releaseDate: '2023-06-16',
    ageRating: AgeRating.P,
    director: 'Peter Sohn',
    cast: ['Leah Lewis', 'Mamoudou Athie', 'Ronnie del Carmen'],
    genres: ['Hoạt hình', 'Gia đình', 'Kỳ ảo', 'Lãng mạn'],
  },

  // === TRENDING 2020-2022 ===
  {
    title: 'Dune: Hành Tinh Cát - Phần Một',
    originalTitle: 'Dune',
    overview: 'Paul Atreides, chàng trai trẻ tài năng, phải đến hành tinh nguy hiểm nhất vũ trụ để đảm bảo tương lai của gia đình và dân tộc.',
    runtime: 155,
    releaseDate: '2021-10-22',
    ageRating: AgeRating.T13,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac', 'Zendaya'],
    genres: ['Khoa học viễn tưởng', 'Phiêu lưu', 'Chính kịch'],
  },
  {
    title: 'No Time to Die - Không Phải Lúc Chết',
    originalTitle: 'No Time to Die',
    overview: 'James Bond đã nghỉ hưu nhưng bị kéo vào nhiệm vụ cuối cùng chống lại kẻ thù sở hữu công nghệ nguy hiểm.',
    runtime: 163,
    releaseDate: '2021-09-30',
    ageRating: AgeRating.T13,
    director: 'Cary Joji Fukunaga',
    cast: ['Daniel Craig', 'Rami Malek', 'Léa Seydoux', 'Ana de Armas'],
    genres: ['Hành động', 'Phiêu lưu', 'Giật gân'],
  },
  {
    title: 'The Batman',
    originalTitle: 'The Batman',
    overview: 'Batman điều tra loạt vụ giết người bí ẩn ở Gotham, phơi bày sự tham nhũng đe dọa thành phố và gia đình Wayne.',
    runtime: 176,
    releaseDate: '2022-03-04',
    ageRating: AgeRating.T13,
    director: 'Matt Reeves',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Colin Farrell'],
    genres: ['Hành động', 'Tội phạm', 'Chính kịch'],
  },
  {
    title: 'Glass Onion: A Knives Out Mystery',
    originalTitle: 'Glass Onion: A Knives Out Mystery',
    overview: 'Thám tử Benoit Blanc được mời đến hòn đảo tư nhân của tỷ phú công nghệ và điều tra vụ án mạng trong nhóm bạn bè.',
    runtime: 139,
    releaseDate: '2022-11-23',
    ageRating: AgeRating.T13,
    director: 'Rian Johnson',
    cast: ['Daniel Craig', 'Janelle Monáe', 'Edward Norton', 'Kate Hudson'],
    genres: ['Bí ẩn', 'Hài hước', 'Tội phạm'],
  },
  {
    title: 'The Whale - Cá Voi',
    originalTitle: 'The Whale',
    overview: 'Giáo viên tiếng Anh mắc chứng béo phì nghiêm trọng cố gắng kết nối lại với con gái tuổi teen đã xa cách.',
    runtime: 117,
    releaseDate: '2022-12-09',
    ageRating: AgeRating.T16,
    director: 'Darren Aronofsky',
    cast: ['Brendan Fraser', 'Sadie Sink', 'Hong Chau', 'Ty Simpkins'],
    genres: ['Chính kịch'],
  },
  {
    title: 'Tár',
    originalTitle: 'Tár',
    overview: 'Lydia Tár, một trong những nhạc trưởng vĩ đại nhất thế giới, đối mặt với sự sụp đổ danh tiếng.',
    runtime: 158,
    releaseDate: '2022-10-07',
    ageRating: AgeRating.T16,
    director: 'Todd Field',
    cast: ['Cate Blanchett', 'Noémie Merlant', 'Nina Hoss', 'Mark Strong'],
    genres: ['Chính kịch', 'Âm nhạc'],
  },
  {
    title: 'Elvis',
    originalTitle: 'Elvis',
    overview: 'Câu chuyện về cuộc đời và sự nghiệp của Elvis Presley qua mối quan hệ phức tạp với quản lý Colonel Tom Parker.',
    runtime: 159,
    releaseDate: '2022-06-24',
    ageRating: AgeRating.T13,
    director: 'Baz Luhrmann',
    cast: ['Austin Butler', 'Tom Hanks', 'Olivia DeJonge', 'Kelvin Harrison Jr.'],
    genres: ['Tiểu sử', 'Âm nhạc', 'Chính kịch'],
  },
  {
    title: 'Belfast',
    originalTitle: 'Belfast',
    overview: 'Câu chuyện về cậu bé 9 tuổi lớn lên ở Belfast những năm 1960 giữa xung đột tôn giáo và chính trị.',
    runtime: 98,
    releaseDate: '2021-11-12',
    ageRating: AgeRating.T13,
    director: 'Kenneth Branagh',
    cast: ['Jude Hill', 'Caitríona Balfe', 'Jamie Dornan', 'Judi Dench'],
    genres: ['Chính kịch', 'Tiểu sử'],
  },
  {
    title: 'The Power of the Dog - Sức Mạnh Của Chó',
    originalTitle: 'The Power of the Dog',
    overview: 'Chủ trang trại Montana tàn nhẫn khiến gia đình em trai sống trong sợ hãi cho đến khi người con riêng bí ẩn xuất hiện.',
    runtime: 126,
    releaseDate: '2021-11-17',
    ageRating: AgeRating.T16,
    director: 'Jane Campion',
    cast: ['Benedict Cumberbatch', 'Kirsten Dunst', 'Jesse Plemons', 'Kodi Smit-McPhee'],
    genres: ['Chính kịch', 'Western'],
  },
  {
    title: 'Don\'t Look Up - Đừng Nhìn Lên',
    originalTitle: 'Don\'t Look Up',
    overview: 'Hai nhà thiên văn học cố gắng cảnh báo nhân loại về sao chổi sắp hủy diệt Trái Đất.',
    runtime: 138,
    releaseDate: '2021-12-24',
    ageRating: AgeRating.T16,
    director: 'Adam McKay',
    cast: ['Leonardo DiCaprio', 'Jennifer Lawrence', 'Meryl Streep', 'Cate Blanchett'],
    genres: ['Hài hước', 'Khoa học viễn tưởng', 'Chính kịch'],
  },

  // === TRENDING 2018-2020 ===
  {
    title: 'Joker',
    originalTitle: 'Joker',
    overview: 'Ở Gotham những năm 1980, diễn viên hài thất bại Arthur Fleck bị xã hội ruồng bỏ và từ từ biến thành tên tội phạm điên loạn.',
    runtime: 122,
    releaseDate: '2019-10-04',
    ageRating: AgeRating.T18,
    director: 'Todd Phillips',
    cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz', 'Frances Conroy'],
    genres: ['Tội phạm', 'Chính kịch', 'Giật gân'],
  },
  {
    title: '1917',
    originalTitle: '1917',
    overview: 'Hai lính Anh trong Thế chiến I được giao nhiệm vụ vượt qua lãnh thổ địch để truyền thông điệp cứu 1.600 đồng đội.',
    runtime: 119,
    releaseDate: '2019-12-25',
    ageRating: AgeRating.T16,
    director: 'Sam Mendes',
    cast: ['George MacKay', 'Dean-Charles Chapman', 'Mark Strong', 'Colin Firth'],
    genres: ['Chiến tranh', 'Chính kịch'],
  },
  {
    title: 'Once Upon a Time in Hollywood',
    originalTitle: 'Once Upon a Time in Hollywood',
    overview: 'Năm 1969 Los Angeles, diễn viên đang tàn phai và người đóng thế của anh điều hướng ngành công nghiệp đang thay đổi.',
    runtime: 161,
    releaseDate: '2019-07-26',
    ageRating: AgeRating.T18,
    director: 'Quentin Tarantino',
    cast: ['Leonardo DiCaprio', 'Brad Pitt', 'Margot Robbie', 'Emile Hirsch'],
    genres: ['Hài hước', 'Chính kịch'],
  },
  {
    title: 'A Star Is Born - Một Ngôi Sao Ra Đời',
    originalTitle: 'A Star Is Born',
    overview: 'Nhạc sĩ nổi tiếng phát hiện và yêu ca sĩ trẻ tài năng, nhưng sự nghiệp cô bay cao trong khi anh chìm vào nghiện ngập.',
    runtime: 136,
    releaseDate: '2018-10-05',
    ageRating: AgeRating.T16,
    director: 'Bradley Cooper',
    cast: ['Lady Gaga', 'Bradley Cooper', 'Sam Elliott', 'Andrew Dice Clay'],
    genres: ['Chính kịch', 'Lãng mạn', 'Âm nhạc'],
  },
  {
    title: 'Bohemian Rhapsody',
    originalTitle: 'Bohemian Rhapsody',
    overview: 'Câu chuyện về Freddie Mercury và sự trỗi dậy của Queen, dẫn đến buổi biểu diễn huyền thoại tại Live Aid 1985.',
    runtime: 134,
    releaseDate: '2018-11-02',
    ageRating: AgeRating.T13,
    director: 'Bryan Singer',
    cast: ['Rami Malek', 'Lucy Boynton', 'Gwilym Lee', 'Ben Hardy'],
    genres: ['Tiểu sử', 'Âm nhạc', 'Chính kịch'],
  },
  {
    title: 'The Shape of Water - Hình Dạng Của Nước',
    originalTitle: 'The Shape of Water',
    overview: 'Người dọn vệ sinh câm yêu sinh vật sông Amazon bị giam giữ trong phòng thí nghiệm bí mật thời Chiến tranh Lạnh.',
    runtime: 123,
    releaseDate: '2017-12-01',
    ageRating: AgeRating.T16,
    director: 'Guillermo del Toro',
    cast: ['Sally Hawkins', 'Doug Jones', 'Michael Shannon', 'Octavia Spencer'],
    genres: ['Kỳ ảo', 'Lãng mạn', 'Chính kịch'],
  },
  {
    title: 'Three Billboards Outside Ebbing, Missouri',
    originalTitle: 'Three Billboards Outside Ebbing, Missouri',
    overview: 'Người mẹ thuê ba biển quảng cáo để gây áp lực lên cảnh sát điều tra vụ giết con gái mình.',
    runtime: 115,
    releaseDate: '2017-11-10',
    ageRating: AgeRating.T16,
    director: 'Martin McDonagh',
    cast: ['Frances McDormand', 'Woody Harrelson', 'Sam Rockwell', 'Abbie Cornish'],
    genres: ['Chính kịch', 'Tội phạm', 'Hài hước đen'],
  },
  {
    title: 'Minari',
    originalTitle: 'Minari',
    overview: 'Gia đình Hàn Quốc chuyển đến Arkansas để theo đuổi giấc mơ Mỹ và bắt đầu trang trại trong những năm 1980.',
    runtime: 115,
    releaseDate: '2020-12-11',
    ageRating: AgeRating.T13,
    director: 'Lee Isaac Chung',
    cast: ['Steven Yeun', 'Yeri Han', 'Alan Kim', 'Youn Yuh-jung'],
    genres: ['Chính kịch', 'Gia đình'],
  },
  {
    title: 'Nomadland - Miền Đất Du Mục',
    originalTitle: 'Nomadland',
    overview: 'Sau khi mất việc và nhà, người phụ nữ sống trong xe van và du hành khắp miền Tây nước Mỹ.',
    runtime: 107,
    releaseDate: '2020-12-04',
    ageRating: AgeRating.T16,
    director: 'Chloé Zhao',
    cast: ['Frances McDormand', 'David Strathairn', 'Linda May', 'Charlene Swankie'],
    genres: ['Chính kịch'],
  },
  {
    title: 'Promising Young Woman - Cô Gái Trẻ Đầy Hứa Hẹn',
    originalTitle: 'Promising Young Woman',
    overview: 'Cô gái trẻ bỏ học y và có cuộc sống bí ẩn, hóa ra đang thực hiện kế hoạch trả thù những kẻ đã hại bạn thân cô.',
    runtime: 113,
    releaseDate: '2020-12-25',
    ageRating: AgeRating.T18,
    director: 'Emerald Fennell',
    cast: ['Carey Mulligan', 'Bo Burnham', 'Alison Brie', 'Clancy Brown'],
    genres: ['Giật gân', 'Tội phạm', 'Chính kịch'],
  },

  // === FRANCHISE HITS 2015-2020 ===
  {
    title: 'Avengers: Hồi Kết',
    originalTitle: 'Avengers: Endgame',
    overview: 'Sau thảm họa Thanos, các Avengers còn sống tập hợp lại để đảo ngược cái búng tay và cứu vũ trụ.',
    runtime: 181,
    releaseDate: '2019-04-26',
    ageRating: AgeRating.T13,
    director: 'Anthony Russo, Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Scarlett Johansson'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Siêu anh hùng'],
  },
  {
    title: 'Avengers: Cuộc Chiến Vô Cực',
    originalTitle: 'Avengers: Infinity War',
    overview: 'Các Avengers phải ngăn chặn Thanos thu thập đủ sáu Viên Đá Vô Cực để hủy diệt nửa vũ trụ.',
    runtime: 149,
    releaseDate: '2018-04-27',
    ageRating: AgeRating.T13,
    director: 'Anthony Russo, Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo', 'Chris Evans'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Siêu anh hùng'],
  },
  {
    title: 'Thor: Ragnarok',
    originalTitle: 'Thor: Ragnarok',
    overview: 'Thor bị mắc kẹt ở hành tinh xa xôi và phải chiến đấu với Hulk để trở về Asgard ngăn chặn Ragnarok.',
    runtime: 130,
    releaseDate: '2017-11-03',
    ageRating: AgeRating.T13,
    director: 'Taika Waititi',
    cast: ['Chris Hemsworth', 'Tom Hiddleston', 'Cate Blanchett', 'Mark Ruffalo'],
    genres: ['Hành động', 'Hài hước', 'Siêu anh hùng'],
  },
  {
    title: 'Thor: Love and Thunder',
    originalTitle: 'Thor: Love and Thunder',
    overview: 'Thor phải đối mặt với Gorr kẻ tàn sát thần và bất ngờ gặp lại Jane Foster đã trở thành Mighty Thor.',
    runtime: 118,
    releaseDate: '2022-07-08',
    ageRating: AgeRating.T13,
    director: 'Taika Waititi',
    cast: ['Chris Hemsworth', 'Natalie Portman', 'Christian Bale', 'Tessa Thompson'],
    genres: ['Hành động', 'Hài hước', 'Siêu anh hùng'],
  },
  {
    title: 'Doctor Strange in the Multiverse of Madness',
    originalTitle: 'Doctor Strange in the Multiverse of Madness',
    overview: 'Doctor Strange du hành qua đa vũ trụ để bảo vệ cô gái có khả năng mở cổng giữa các thực tại.',
    runtime: 126,
    releaseDate: '2022-05-06',
    ageRating: AgeRating.T13,
    director: 'Sam Raimi',
    cast: ['Benedict Cumberbatch', 'Elizabeth Olsen', 'Xochitl Gomez', 'Benedict Wong'],
    genres: ['Hành động', 'Kỳ ảo', 'Siêu anh hùng'],
  },
  {
    title: 'Black Panther: Wakanda Forever',
    originalTitle: 'Black Panther: Wakanda Forever',
    overview: 'Wakanda đau buồn trước sự ra đi của T\'Challa và phải đối mặt với mối đe dọa mới từ vương quốc Talokan dưới nước.',
    runtime: 161,
    releaseDate: '2022-11-11',
    ageRating: AgeRating.T13,
    director: 'Ryan Coogler',
    cast: ['Letitia Wright', 'Lupita Nyong\'o', 'Tenoch Huerta', 'Angela Bassett'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Siêu anh hùng'],
  },
  {
    title: 'Guardians of the Galaxy Vol. 3',
    originalTitle: 'Guardians of the Galaxy Vol. 3',
    overview: 'Peter Quill và các Vệ Binh phải bảo vệ Rocket khỏi kẻ thù từ quá khứ của hắn trong cuộc phiêu lưu cuối cùng.',
    runtime: 150,
    releaseDate: '2023-05-05',
    ageRating: AgeRating.T13,
    director: 'James Gunn',
    cast: ['Chris Pratt', 'Zoe Saldaña', 'Dave Bautista', 'Bradley Cooper'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Hài hước'],
  },
  {
    title: 'Shang-Chi and the Legend of the Ten Rings',
    originalTitle: 'Shang-Chi and the Legend of the Ten Rings',
    overview: 'Shang-Chi phải đối mặt với quá khứ khi cha anh, trùm tội phạm bất tử, lôi kéo anh vào tổ chức Ten Rings.',
    runtime: 132,
    releaseDate: '2021-09-03',
    ageRating: AgeRating.T13,
    director: 'Destin Daniel Cretton',
    cast: ['Simu Liu', 'Tony Leung Chiu-wai', 'Awkwafina', 'Michelle Yeoh'],
    genres: ['Hành động', 'Kỳ ảo', 'Siêu anh hùng'],
  },
  {
    title: 'Eternals',
    originalTitle: 'Eternals',
    overview: 'Nhóm siêu anh hùng bất tử phải tái xuất sau hàng nghìn năm để chống lại kẻ thù cổ đại nhất của họ, Deviants.',
    runtime: 156,
    releaseDate: '2021-11-05',
    ageRating: AgeRating.T13,
    director: 'Chloé Zhao',
    cast: ['Gemma Chan', 'Richard Madden', 'Angelina Jolie', 'Salma Hayek'],
    genres: ['Hành động', 'Kỳ ảo', 'Siêu anh hùng'],
  },
  {
    title: 'Ant-Man and the Wasp: Quantumania',
    originalTitle: 'Ant-Man and the Wasp: Quantumania',
    overview: 'Scott Lang và Hope van Dyne bị đẩy vào Lượng Tử Giới và đối mặt với Kang, kẻ chinh phục.',
    runtime: 125,
    releaseDate: '2023-02-17',
    ageRating: AgeRating.T13,
    director: 'Peyton Reed',
    cast: ['Paul Rudd', 'Evangeline Lilly', 'Jonathan Majors', 'Michelle Pfeiffer'],
    genres: ['Hành động', 'Khoa học viễn tưởng', 'Hài hước'],
  },

  // === VIRAL HITS 2015-2020 ===
  {
    title: 'A Quiet Place - Vùng Đất Câm Lặng',
    originalTitle: 'A Quiet Place',
    overview: 'Gia đình phải sống trong im lặng tuyệt đối để tránh bị sinh vật mù săn mồi bằng âm thanh phát hiện.',
    runtime: 90,
    releaseDate: '2018-04-06',
    ageRating: AgeRating.T13,
    director: 'John Krasinski',
    cast: ['Emily Blunt', 'John Krasinski', 'Millicent Simmonds', 'Noah Jupe'],
    genres: ['Kinh dị', 'Khoa học viễn tưởng', 'Chính kịch'],
  },
  {
    title: 'A Quiet Place Part II',
    originalTitle: 'A Quiet Place Part II',
    overview: 'Gia đình Abbott phải đối mặt với nguy hiểm bên ngoài nơi trú ẩn và khám phá thế giới bên ngoài.',
    runtime: 97,
    releaseDate: '2021-05-28',
    ageRating: AgeRating.T13,
    director: 'John Krasinski',
    cast: ['Emily Blunt', 'Millicent Simmonds', 'Cillian Murphy', 'Noah Jupe'],
    genres: ['Kinh dị', 'Khoa học viễn tưởng'],
  },
  {
    title: 'Hereditary - Di Truyền',
    originalTitle: 'Hereditary',
    overview: 'Sau cái chết của bà ngoại, gia đình Graham khám phá những bí mật đen tối và lời nguyền kinh hoàng.',
    runtime: 127,
    releaseDate: '2018-06-08',
    ageRating: AgeRating.T18,
    director: 'Ari Aster',
    cast: ['Toni Collette', 'Alex Wolff', 'Milly Shapiro', 'Gabriel Byrne'],
    genres: ['Kinh dị', 'Bí ẩn', 'Chính kịch'],
  },
  {
    title: 'Midsommar',
    originalTitle: 'Midsommar',
    overview: 'Cặp đôi đang rạn nứt du lịch đến Thụy Điển dự lễ hội giữa hè và bị cuốn vào giáo phái ngoại giáo.',
    runtime: 148,
    releaseDate: '2019-07-03',
    ageRating: AgeRating.T18,
    director: 'Ari Aster',
    cast: ['Florence Pugh', 'Jack Reynor', 'Will Poulter', 'William Jackson Harper'],
    genres: ['Kinh dị', 'Chính kịch', 'Bí ẩn'],
  },
  {
    title: 'It - Gã Hề Ma Quái',
    originalTitle: 'It',
    overview: 'Nhóm trẻ em ở Derry, Maine đối mặt với thực thể siêu nhiên hình thù gã hề, chuyên săn mồi nỗi sợ.',
    runtime: 135,
    releaseDate: '2017-09-08',
    ageRating: AgeRating.T16,
    director: 'Andy Muschietti',
    cast: ['Bill Skarsgård', 'Jaeden Martell', 'Finn Wolfhard', 'Sophia Lillis'],
    genres: ['Kinh dị', 'Siêu nhiên'],
  },
];

async function main() {
  console.log('🌱 Seeding Movie Service database - BATCH 4 (50 trending films 2015-2025)...\n');
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

  console.log(`\n🎉 Batch 4 complete: ${successCount} created, ${skippedCount} skipped, ${errorCount} failed`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
