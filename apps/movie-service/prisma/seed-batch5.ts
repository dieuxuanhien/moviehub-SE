import { getSeedPosterUrl, getSeedTrailerUrl, getSeedReleaseData } from './seed-helper';
import { PrismaClient, AgeRating, LanguageOption } from '../generated/prisma';

const prisma = new PrismaClient();

/**
 * BATCH 5: 50 More Trending Films (2018-2025)
 * Focus: Netflix hits, Korean cinema, Horror, Animation, Streaming exclusives
 */

const movieData = [
  // === NETFLIX/STREAMING HITS ===
  {
    title: 'Squid Game: Trò Chơi Con Mực (Phim)',
    originalTitle: 'Squid Game: The Movie',
    overview: 'Phiên bản điện ảnh của series viral về những người mắc nợ tham gia trò chơi sinh tử để giành 45.6 tỷ won.',
    runtime: 142,
    releaseDate: '2024-12-26',
    ageRating: AgeRating.T18,
    director: 'Hwang Dong-hyuk',
    cast: ['Lee Jung-jae', 'Park Hae-soo', 'Wi Ha-joon', 'Lee Byung-hun'],
    genres: ['Giật gân', 'Chính kịch', 'Sinh tồn'],
  },
  {
    title: 'Wednesday',
    originalTitle: 'Wednesday',
    overview: 'Wednesday Addams điều tra loạt vụ giết người khi học tại Nevermore Academy.',
    runtime: 115,
    releaseDate: '2022-11-23',
    ageRating: AgeRating.T13,
    director: 'Tim Burton',
    cast: ['Jenna Ortega', 'Gwendoline Christie', 'Riki Lindhome', 'Catherine Zeta-Jones'],
    genres: ['Hài hước đen', 'Bí ẩn', 'Kỳ ảo'],
  },
  {
    title: 'All Quiet on the Western Front - Mặt Trận Phía Tây',
    originalTitle: 'Im Westen nichts Neues',
    overview: 'Thanh niên Đức háo hức nhập ngũ Thế chiến I và sớm đối mặt với sự tàn khốc của chiến tranh.',
    runtime: 148,
    releaseDate: '2022-10-28',
    ageRating: AgeRating.T18,
    director: 'Edward Berger',
    cast: ['Felix Kammerer', 'Albrecht Schuch', 'Aaron Hilmer', 'Daniel Brühl'],
    genres: ['Chiến tranh', 'Chính kịch', 'Hành động'],
  },
  {
    title: 'The Adam Project - Dự Án Adam',
    originalTitle: 'The Adam Project',
    overview: 'Phi công du hành thời gian hạ cánh năm 2022 và phải hợp tác với phiên bản 12 tuổi của mình.',
    runtime: 106,
    releaseDate: '2022-03-11',
    ageRating: AgeRating.T13,
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Walker Scobell', 'Mark Ruffalo', 'Zoe Saldaña'],
    genres: ['Khoa học viễn tưởng', 'Hành động', 'Phiêu lưu'],
  },
  {
    title: 'Red Notice - Lệnh Truy Nã',
    originalTitle: 'Red Notice',
    overview: 'Đặc vụ FBI phải hợp tác với tên trộm nghệ thuật khét tiếng để bắt nữ tội phạm nguy hiểm nhất.',
    runtime: 118,
    releaseDate: '2021-11-12',
    ageRating: AgeRating.T13,
    director: 'Rawson Marshall Thurber',
    cast: ['Dwayne Johnson', 'Gal Gadot', 'Ryan Reynolds'],
    genres: ['Hành động', 'Hài hước', 'Tội phạm'],
  },
  {
    title: 'Extraction - Nhiệm Vụ Giải Cứu',
    originalTitle: 'Extraction',
    overview: 'Lính đánh thuê bị cuốn vào nhiệm vụ giải cứu con trai trùm ma túy Ấn Độ bị bắt cóc.',
    runtime: 116,
    releaseDate: '2020-04-24',
    ageRating: AgeRating.T16,
    director: 'Sam Hargrave',
    cast: ['Chris Hemsworth', 'Rudhraksh Jaiswal', 'Randeep Hooda', 'David Harbour'],
    genres: ['Hành động', 'Giật gân'],
  },
  {
    title: 'Extraction 2 - Nhiệm Vụ Giải Cứu 2',
    originalTitle: 'Extraction 2',
    overview: 'Tyler Rake nhận nhiệm vụ mới giải cứu gia đình một tên gangster khỏi nhà tù Georgia.',
    runtime: 122,
    releaseDate: '2023-06-16',
    ageRating: AgeRating.T18,
    director: 'Sam Hargrave',
    cast: ['Chris Hemsworth', 'Golshifteh Farahani', 'Adam Bessa', 'Idris Elba'],
    genres: ['Hành động', 'Giật gân'],
  },
  {
    title: 'The Gray Man - Đặc Vụ Vô Hình',
    originalTitle: 'The Gray Man',
    overview: 'Đặc vụ CIA bị đồng nghiệp tâm thần săn đuổi khắp thế giới sau khi phát hiện bí mật đen tối.',
    runtime: 122,
    releaseDate: '2022-07-22',
    ageRating: AgeRating.T13,
    director: 'Anthony Russo, Joe Russo',
    cast: ['Ryan Gosling', 'Chris Evans', 'Ana de Armas', 'Regé-Jean Page'],
    genres: ['Hành động', 'Giật gân'],
  },
  {
    title: 'The Trial of the Chicago 7',
    originalTitle: 'The Trial of the Chicago 7',
    overview: 'Câu chuyện thật về phiên tòa xét xử 7 người bị buộc tội âm mưu bạo loạn tại Đại hội Đảng Dân chủ 1968.',
    runtime: 129,
    releaseDate: '2020-10-16',
    ageRating: AgeRating.T16,
    director: 'Aaron Sorkin',
    cast: ['Eddie Redmayne', 'Alex Sharp', 'Sacha Baron Cohen', 'Jeremy Strong'],
    genres: ['Chính kịch', 'Lịch sử', 'Pháp đình'],
  },
  {
    title: 'The Irishman - Người Ireland',
    originalTitle: 'The Irishman',
    overview: 'Hitman Frank Sheeran kể lại cuộc đời tội phạm và vai trò trong vụ mất tích của Jimmy Hoffa.',
    runtime: 209,
    releaseDate: '2019-11-27',
    ageRating: AgeRating.T18,
    director: 'Martin Scorsese',
    cast: ['Robert De Niro', 'Al Pacino', 'Joe Pesci', 'Harvey Keitel'],
    genres: ['Tội phạm', 'Chính kịch', 'Tiểu sử'],
  },

  // === KOREAN CINEMA 2018-2025 ===
  {
    title: 'Exhuma - Quật Mộ',
    originalTitle: '파묘',
    overview: 'Đội pháp sư được thuê để khai quật mộ tổ tiên gia đình giàu có, vô tình giải phóng thế lực đen tối.',
    runtime: 134,
    releaseDate: '2024-02-22',
    ageRating: AgeRating.T16,
    director: 'Jang Jae-hyun',
    cast: ['Choi Min-sik', 'Kim Go-eun', 'Yoo Hae-jin', 'Lee Do-hyun'],
    genres: ['Kinh dị', 'Bí ẩn', 'Giật gân'],
  },
  {
    title: 'Concrete Utopia - Xứ Sở Bê Tông',
    originalTitle: '콘크리트 유토피아',
    overview: 'Sau động đất phá hủy Seoul, cư dân tòa chung cư còn sống thành lập xã hội riêng với luật lệ tàn khốc.',
    runtime: 130,
    releaseDate: '2023-08-09',
    ageRating: AgeRating.T16,
    director: 'Um Tae-hwa',
    cast: ['Lee Byung-hun', 'Park Seo-joon', 'Park Bo-young'],
    genres: ['Chính kịch', 'Giật gân', 'Thảm họa'],
  },
  {
    title: 'Decision to Leave - Quyết Định Ra Đi',
    originalTitle: '헤어질 결심',
    overview: 'Thám tử điều tra vụ chết của người leo núi và bị cuốn hút bởi người vợ Trung Quốc bí ẩn của nạn nhân.',
    runtime: 139,
    releaseDate: '2022-06-29',
    ageRating: AgeRating.T16,
    director: 'Park Chan-wook',
    cast: ['Tang Wei', 'Park Hae-il', 'Lee Jung-hyun', 'Go Kyung-pyo'],
    genres: ['Bí ẩn', 'Lãng mạn', 'Giật gân'],
  },
  {
    title: 'Broker - Người Môi Giới',
    originalTitle: '브로커',
    overview: 'Hai người đàn ông bán trẻ bị bỏ rơi cho gặp mẹ ruột và cùng nhau du hành tìm gia đình nhận nuôi.',
    runtime: 129,
    releaseDate: '2022-06-08',
    ageRating: AgeRating.T13,
    director: 'Hirokazu Kore-eda',
    cast: ['Song Kang-ho', 'Kang Dong-won', 'IU', 'Bae Doona'],
    genres: ['Chính kịch', 'Hài hước'],
  },
  {
    title: 'The Gangster, the Cop, the Devil',
    originalTitle: '악인전',
    overview: 'Ông trùm xã hội đen sống sót sau vụ tấn công của kẻ giết người hàng loạt và hợp tác với thám tử để trả thù.',
    runtime: 109,
    releaseDate: '2019-05-15',
    ageRating: AgeRating.T18,
    director: 'Lee Won-tae',
    cast: ['Ma Dong-seok', 'Kim Mu-yeol', 'Kim Sung-kyu'],
    genres: ['Hành động', 'Tội phạm', 'Giật gân'],
  },
  {
    title: 'Burning - Thiêu Đốt',
    originalTitle: '버닝',
    overview: 'Thanh niên giao hàng yêu cô bạn thời thơ ấu nhưng cô trở về từ châu Phi với người đàn ông giàu có bí ẩn.',
    runtime: 148,
    releaseDate: '2018-05-17',
    ageRating: AgeRating.T16,
    director: 'Lee Chang-dong',
    cast: ['Yoo Ah-in', 'Steven Yeun', 'Jeon Jong-seo'],
    genres: ['Chính kịch', 'Bí ẩn', 'Giật gân'],
  },
  {
    title: 'Escape from Mogadishu - Trốn Khỏi Mogadishu',
    originalTitle: '모가디슈',
    overview: 'Năm 1991, đại sứ quán Bắc và Nam Hàn ở Somalia phải hợp tác để thoát khỏi nội chiến.',
    runtime: 121,
    releaseDate: '2021-07-28',
    ageRating: AgeRating.T16,
    director: 'Ryoo Seung-wan',
    cast: ['Kim Yoon-seok', 'Jo In-sung', 'Heo Joon-ho', 'Koo Kyo-hwan'],
    genres: ['Hành động', 'Chính kịch', 'Lịch sử'],
  },
  {
    title: 'Emergency Declaration - Tuyên Bố Khẩn Cấp',
    originalTitle: '비상선언',
    overview: 'Máy bay chở khách bị khủng bố sinh học và không sân bay nào cho hạ cánh.',
    runtime: 141,
    releaseDate: '2022-08-03',
    ageRating: AgeRating.T13,
    director: 'Han Jae-rim',
    cast: ['Song Kang-ho', 'Lee Byung-hun', 'Jeon Do-yeon', 'Kim Nam-gil'],
    genres: ['Thảm họa', 'Giật gân', 'Hành động'],
  },
  {
    title: '#Alive - Sống Sót',
    originalTitle: '#살아있다',
    overview: 'Game thủ mắc kẹt trong căn hộ khi đại dịch zombie bùng phát ở Seoul và cố gắng sinh tồn.',
    runtime: 98,
    releaseDate: '2020-06-24',
    ageRating: AgeRating.T16,
    director: 'Cho Il-hyung',
    cast: ['Yoo Ah-in', 'Park Shin-hye'],
    genres: ['Kinh dị', 'Giật gân', 'Zombie'],
  },
  {
    title: 'Peninsula - Bán Đảo',
    originalTitle: '반도',
    overview: 'Bốn năm sau Train to Busan, cựu quân nhân trở lại bán đảo Hàn Quốc đầy zombie để tìm kho tiền.',
    runtime: 116,
    releaseDate: '2020-07-15',
    ageRating: AgeRating.T16,
    director: 'Yeon Sang-ho',
    cast: ['Gang Dong-won', 'Lee Jung-hyun', 'Lee Re', 'Kwon Hae-hyo'],
    genres: ['Hành động', 'Kinh dị', 'Zombie'],
  },

  // === RECENT ANIMATION (2018-2025) ===
  {
    title: 'Spider-Man: Across the Spider-Verse',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    overview: 'Miles Morales du hành qua đa vũ trụ và gặp gỡ hàng trăm Spider-People, nhưng xung đột với họ về số phận.',
    runtime: 140,
    releaseDate: '2023-06-02',
    ageRating: AgeRating.P,
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
    genres: ['Hoạt hình', 'Hành động', 'Siêu anh hùng'],
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    originalTitle: 'Spider-Man: Into the Spider-Verse',
    overview: 'Miles Morales trở thành Spider-Man và gặp các phiên bản Spider-Man từ các vũ trụ khác.',
    runtime: 117,
    releaseDate: '2018-12-14',
    ageRating: AgeRating.P,
    director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
    cast: ['Shameik Moore', 'Jake Johnson', 'Hailee Steinfeld', 'Nicolas Cage'],
    genres: ['Hoạt hình', 'Hành động', 'Siêu anh hùng'],
  },
  {
    title: 'Puss in Boots: The Last Wish',
    originalTitle: 'Puss in Boots: The Last Wish',
    overview: 'Puss in Boots phát hiện đã dùng hết 8 mạng và phải tìm ngôi sao ước để lấy lại chúng.',
    runtime: 102,
    releaseDate: '2022-12-21',
    ageRating: AgeRating.P,
    director: 'Joel Crawford',
    cast: ['Antonio Banderas', 'Salma Hayek', 'Harvey Guillén', 'Florence Pugh'],
    genres: ['Hoạt hình', 'Phiêu lưu', 'Gia đình', 'Hài hước'],
  },
  {
    title: 'The Super Mario Bros. Movie',
    originalTitle: 'The Super Mario Bros. Movie',
    overview: 'Mario và Luigi vô tình đến Vương quốc Nấm và phải cứu công chúa Peach khỏi Bowser.',
    runtime: 92,
    releaseDate: '2023-04-05',
    ageRating: AgeRating.P,
    director: 'Aaron Horvath, Michael Jelenic',
    cast: ['Chris Pratt', 'Anya Taylor-Joy', 'Charlie Day', 'Jack Black'],
    genres: ['Hoạt hình', 'Phiêu lưu', 'Gia đình', 'Hài hước'],
  },
  {
    title: 'Wish - Ngôi Sao Ước',
    originalTitle: 'Wish',
    overview: 'Cô gái trẻ Asha ước lên ngôi sao và vô tình triệu hồi ngôi sao rơi xuống giúp cô chống lại vua phù thủy.',
    runtime: 95,
    releaseDate: '2023-11-22',
    ageRating: AgeRating.P,
    director: 'Chris Buck, Fawn Veerasunthorn',
    cast: ['Ariana DeBose', 'Chris Pine', 'Alan Tudyk', 'Angelique Cabral'],
    genres: ['Hoạt hình', 'Gia đình', 'Kỳ ảo', 'Nhạc kịch'],
  },
  {
    title: 'The Little Mermaid - Nàng Tiên Cá',
    originalTitle: 'The Little Mermaid',
    overview: 'Nàng tiên cá Ariel ước được sống trên cạn và đánh đổi giọng hát với phù thủy biển để có đôi chân.',
    runtime: 135,
    releaseDate: '2023-05-26',
    ageRating: AgeRating.P,
    director: 'Rob Marshall',
    cast: ['Halle Bailey', 'Jonah Hauer-King', 'Melissa McCarthy', 'Javier Bardem'],
    genres: ['Gia đình', 'Kỳ ảo', 'Nhạc kịch', 'Lãng mạn'],
  },
  {
    title: 'Lightyear - Người Trong Truyền Thuyết',
    originalTitle: 'Lightyear',
    overview: 'Câu chuyện gốc về nhà du hành vũ trụ Buzz Lightyear, nguồn cảm hứng cho đồ chơi trong Toy Story.',
    runtime: 100,
    releaseDate: '2022-06-17',
    ageRating: AgeRating.P,
    director: 'Angus MacLane',
    cast: ['Chris Evans', 'Keke Palmer', 'Peter Sohn', 'Taika Waititi'],
    genres: ['Hoạt hình', 'Khoa học viễn tưởng', 'Phiêu lưu', 'Gia đình'],
  },
  {
    title: 'Turning Red - Gấu Đỏ May Mắn',
    originalTitle: 'Turning Red',
    overview: 'Cô gái Trung Hoa 13 tuổi ở Toronto phát hiện mình biến thành gấu trúc đỏ khổng lồ khi xúc động.',
    runtime: 100,
    releaseDate: '2022-03-11',
    ageRating: AgeRating.P,
    director: 'Domee Shi',
    cast: ['Rosalie Chiang', 'Sandra Oh', 'Ava Morse', 'Maitreyi Ramakrishnan'],
    genres: ['Hoạt hình', 'Gia đình', 'Kỳ ảo', 'Hài hước'],
  },
  {
    title: 'Luca',
    originalTitle: 'Luca',
    overview: 'Cậu bé quái vật biển trải qua mùa hè khó quên trên đất liền ở thị trấn ven biển Italy.',
    runtime: 95,
    releaseDate: '2021-06-18',
    ageRating: AgeRating.P,
    director: 'Enrico Casarosa',
    cast: ['Jacob Tremblay', 'Jack Dylan Grazer', 'Emma Berman', 'Maya Rudolph'],
    genres: ['Hoạt hình', 'Gia đình', 'Kỳ ảo', 'Hài hước'],
  },
  {
    title: 'Encanto',
    originalTitle: 'Encanto',
    overview: 'Cô gái Colombia là thành viên duy nhất không có phép thuật trong gia đình kỳ diệu, nhưng có thể là người cứu họ.',
    runtime: 102,
    releaseDate: '2021-11-24',
    ageRating: AgeRating.P,
    director: 'Byron Howard, Jared Bush',
    cast: ['Stephanie Beatriz', 'María Cecilia Botero', 'John Leguizamo', 'Jessica Darrow'],
    genres: ['Hoạt hình', 'Gia đình', 'Kỳ ảo', 'Nhạc kịch'],
  },

  // === RECENT HORROR (2018-2025) ===
  {
    title: 'Smile - Cười Đi Rồi Khóc',
    originalTitle: 'Smile',
    overview: 'Bác sĩ tâm thần bị ám ảnh bởi thực thể siêu nhiên lây lan qua những nụ cười rùng rợn.',
    runtime: 115,
    releaseDate: '2022-09-30',
    ageRating: AgeRating.T18,
    director: 'Parker Finn',
    cast: ['Sosie Bacon', 'Jessie T. Usher', 'Kyle Gallner', 'Robin Weigert'],
    genres: ['Kinh dị', 'Siêu nhiên', 'Giật gân'],
  },
  {
    title: 'Smile 2',
    originalTitle: 'Smile 2',
    overview: 'Ngôi sao nhạc pop bị thực thể cười ma quái săn đuổi giữa tour diễn thế giới.',
    runtime: 127,
    releaseDate: '2024-10-18',
    ageRating: AgeRating.T18,
    director: 'Parker Finn',
    cast: ['Naomi Scott', 'Lukas Gage', 'Miles Gutierrez-Riley', 'Peter Jacobson'],
    genres: ['Kinh dị', 'Siêu nhiên', 'Giật gân'],
  },
  {
    title: 'M3GAN',
    originalTitle: 'M3GAN',
    overview: 'Búp bê AI được tạo ra để bảo vệ cô bé mồ côi bắt đầu giết bất kỳ ai đe dọa cô.',
    runtime: 102,
    releaseDate: '2023-01-06',
    ageRating: AgeRating.T13,
    director: 'Gerard Johnstone',
    cast: ['Allison Williams', 'Violet McGraw', 'Ronny Chieng', 'Amie Donald'],
    genres: ['Kinh dị', 'Khoa học viễn tưởng', 'Giật gân'],
  },
  {
    title: 'The Black Phone - Điện Thoại Đen',
    originalTitle: 'The Black Phone',
    overview: 'Cậu bé bị bắt cóc nhận được cuộc gọi từ nạn nhân trước đây qua điện thoại bị ngắt kết nối.',
    runtime: 103,
    releaseDate: '2022-06-24',
    ageRating: AgeRating.T16,
    director: 'Scott Derrickson',
    cast: ['Ethan Hawke', 'Mason Thames', 'Madeleine McGraw', 'Jeremy Davies'],
    genres: ['Kinh dị', 'Siêu nhiên', 'Giật gân'],
  },
  {
    title: 'Nope',
    originalTitle: 'Nope',
    overview: 'Hai anh em chủ trang trại ngựa phát hiện vật thể bay bí ẩn trên bầu trời và cố gắng quay phim nó.',
    runtime: 130,
    releaseDate: '2022-07-22',
    ageRating: AgeRating.T16,
    director: 'Jordan Peele',
    cast: ['Daniel Kaluuya', 'Keke Palmer', 'Steven Yeun', 'Michael Wincott'],
    genres: ['Kinh dị', 'Khoa học viễn tưởng', 'Bí ẩn'],
  },
  {
    title: 'The Menu - Thực Đơn Chết Chóc',
    originalTitle: 'The Menu',
    overview: 'Cặp đôi đến nhà hàng độc quyền trên đảo hoang và phát hiện bữa ăn có những bí mật chết người.',
    runtime: 107,
    releaseDate: '2022-11-18',
    ageRating: AgeRating.T16,
    director: 'Mark Mylod',
    cast: ['Ralph Fiennes', 'Anya Taylor-Joy', 'Nicholas Hoult', 'Hong Chau'],
    genres: ['Kinh dị', 'Hài hước đen', 'Giật gân'],
  },
  {
    title: 'Pearl',
    originalTitle: 'Pearl',
    overview: 'Năm 1918, cô gái trẻ sống ở trang trại với mẹ nghiêm khắc mơ ước thành ngôi sao điện ảnh và dần điên loạn.',
    runtime: 103,
    releaseDate: '2022-09-16',
    ageRating: AgeRating.T18,
    director: 'Ti West',
    cast: ['Mia Goth', 'David Corenswet', 'Tandi Wright', 'Matthew Sunderland'],
    genres: ['Kinh dị', 'Chính kịch'],
  },
  {
    title: 'X',
    originalTitle: 'X',
    overview: 'Đoàn làm phim khiêu dâm thuê trang trại của cặp vợ chồng già ở Texas và bị họ săn đuổi.',
    runtime: 105,
    releaseDate: '2022-03-18',
    ageRating: AgeRating.T18,
    director: 'Ti West',
    cast: ['Mia Goth', 'Jenna Ortega', 'Brittany Snow', 'Kid Cudi'],
    genres: ['Kinh dị', 'Slasher'],
  },
  {
    title: 'Barbarian - Kẻ Man Rợ',
    originalTitle: 'Barbarian',
    overview: 'Cô gái đến Airbnb và phát hiện có người đàn ông đã đặt cùng phòng, nhưng đó chỉ là bắt đầu của ác mộng.',
    runtime: 102,
    releaseDate: '2022-09-09',
    ageRating: AgeRating.T18,
    director: 'Zach Cregger',
    cast: ['Georgina Campbell', 'Bill Skarsgård', 'Justin Long', 'Matthew Patrick Davis'],
    genres: ['Kinh dị', 'Giật gân'],
  },
  {
    title: 'Talk to Me - Nói Chuyện Với Tôi',
    originalTitle: 'Talk to Me',
    overview: 'Nhóm thiếu niên sử dụng bàn tay ướp xác để giao tiếp với người chết, nhưng mở ra cánh cửa cho thế lực đen tối.',
    runtime: 95,
    releaseDate: '2023-07-28',
    ageRating: AgeRating.T18,
    director: 'Danny Philippou, Michael Philippou',
    cast: ['Sophie Wilde', 'Miranda Otto', 'Alexandra Jensen', 'Joe Bird'],
    genres: ['Kinh dị', 'Siêu nhiên', 'Giật gân'],
  },
];

async function main() {
  console.log('🌱 Seeding Movie Service database - BATCH 5 (50 trending films)...\n');
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

  console.log(`\n🎉 Batch 5 complete: ${successCount} created, ${skippedCount} skipped, ${errorCount} failed`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
