/**
 * Movie Poster URL Updater
 * Uses Wikipedia API to fetch real poster URLs for all movies
 */

const { PrismaClient } = require('../generated/prisma');
const https = require('https');

const prisma = new PrismaClient();

// Wikipedia API endpoint
const WIKI_API = 'https://en.wikipedia.org/w/api.php';

// Mapping of known movies to their Wikipedia article titles
// For movies with Vietnamese titles, we extract the English part for Wikipedia lookup
const TITLE_MAPPINGS = {
  // Nolan Films
  'Inception - Giấc Mơ Trong Mơ': 'Inception_(film)',
  'Interstellar - Hố Đen Tử Thần': 'Interstellar_(film)',
  'The Dark Knight - Kỵ Sĩ Bóng Đêm': 'The_Dark_Knight',
  'TENET': 'Tenet_(film)',
  'Oppenheimer': 'Oppenheimer_(film)',
  'Dunkirk': 'Dunkirk_(2017_film)',
  
  // Avatar & Sci-Fi
  'Avatar': 'Avatar_(2009_film)',
  'Avatar: Dòng Chảy Của Nước': 'Avatar:_The_Way_of_Water',
  'Dune: Hành Tinh Cát': 'Dune_(2021_film)',
  'Dune: Hành Tinh Cát - Phần Hai': 'Dune:_Part_Two',
  'Ma Trận': 'The_Matrix',
  'Blade Runner 2049': 'Blade_Runner_2049',
  'Arrival - Cuộc Chiến Ngoài Hành Tinh': 'Arrival_(film)',
  'The Terminator - Kẻ Hủy Diệt': 'The_Terminator',
  
  // Romance
  'Titanic': 'Titanic_(1997_film)',
  'The Notebook - Nhật Ký Tình Yêu': 'The_Notebook_(film)',
  'La La Land - Những Kẻ Mộng Mơ': 'La_La_Land',
  'Pride and Prejudice - Kiêu Hãnh Và Định Kiến': 'Pride_%26_Prejudice_(2005_film)',
  'A Star Is Born - Một Ngôi Sao Ra Đời': 'A_Star_Is_Born_(2018_film)',
  'Crazy Rich Asians - Con Nhà Siêu Giàu Châu Á': 'Crazy_Rich_Asians_(film)',
  'Romeo + Juliet': 'Romeo_%2B_Juliet',
  'About Time - Yêu Đi, Đừng Sợ': 'About_Time_(2013_film)',
  'Before Sunrise - Trước Bình Minh': 'Before_Sunrise',
  'Me Before You - Trước Ngày Em Đến': 'Me_Before_You_(film)',
  '50 First Dates - 50 Lần Hẹn Đầu Tiên': '50_First_Dates',
  'Notting Hill - Hẹn Hò Ở Notting Hill': 'Notting_Hill_(film)',
  'The Fault in Our Stars - Lỗi Tại Ngôi Sao': 'The_Fault_in_Our_Stars_(film)',
  'P.S. I Love You - Tái Bút: Anh Yêu Em': 'P.S._I_Love_You_(film)',
  'When Harry Met Sally - Khi Harry Gặp Sally': 'When_Harry_Met_Sally...',
  'Sleepless in Seattle - Đêm Không Ngủ Ở Seattle': 'Sleepless_in_Seattle',
  'The Proposal - Lời Cầu Hôn': 'The_Proposal_(2009_film)',
  
  // Horror
  'The Shining - Khách Sạn Ma Quái': 'The_Shining_(film)',
  'The Exorcist - Quỷ Ám': 'The_Exorcist',
  'It - Gã Hề Ma Quái': 'It_(2017_film)',
  'Get Out - Lấy Mạng': 'Get_Out',
  'Insidious - Quỷ Quyệt': 'Insidious_(film)',
  'The Ring - Vòng Tròn Kinh Hoàng': 'The_Ring_(2002_film)',
  'Halloween (2018)': 'Halloween_(2018_film)',
  'M3GAN - Búp Bê Sát Nhân': 'M3GAN',
  'Smile - Cười': 'Smile_(2022_film)',
  'Us - Chúng Ta': 'Us_(2019_film)',
  'The Conjuring - Ám Ảnh Kinh Hoàng': 'The_Conjuring',
  'A Nightmare on Elm Street - Ác Mộng Phố Elm': 'A_Nightmare_on_Elm_Street_(1984_film)',
  'Friday the 13th - Thứ Sáu Ngày 13': 'Friday_the_13th_(1980_film)',
  'The Nun - Ác Quỷ Ma Sơ': 'The_Nun_(2018_film)',
  'Sinister - Điềm Báo Tử Thần': 'Sinister_(film)',
  'A Quiet Place - Vùng Đất Câm Lặng': 'A_Quiet_Place',
  'Midsommar': 'Midsommar_(film)',
  'Barbarian - Kẻ Man Rợ': 'Barbarian_(2022_film)',
  'The Black Phone - Điện Thoại Đen': 'The_Black_Phone',
  'Talk to Me - Nói Chuyện Với Tôi': 'Talk_to_Me_(2022_film)',
  'Pearl': 'Pearl_(2022_film)',
  'X': 'X_(2022_film)',
  'Longlegs - Sát Nhân Giấu Mặt': 'Longlegs_(film)',
  'Late Night with the Devil': 'Late_Night_with_the_Devil',
  'Prey - Con Mồi': 'Prey_(2022_film)',
  '#Alive - Sống Sót': '%23Alive',
  'Train to Busan - Chuyến Tàu Sinh Tử': 'Train_to_Busan',
  'A Tale of Two Sisters - Câu Chuyện Hai Chị Em': 'A_Tale_of_Two_Sisters',
  'Ringu - Vòng Tròn Định Mệnh': 'Ring_(film)',
  'Oldboy - Báo Thù': 'Oldboy_(2003_film)',
  
  // Action/Adventure
  'John Wick: Chapter 4': 'John_Wick:_Chapter_4',
  'Fast X': 'Fast_X',
  'F9 - Fast & Furious 9': 'F9_(film)',
  'Spider-Man: No Way Home': 'Spider-Man:_No_Way_Home',
  'Spider-Man: Far From Home': 'Spider-Man:_Far_From_Home',
  'Avengers: Endgame': 'Avengers:_Endgame',
  'Avengers: Infinity War': 'Avengers:_Infinity_War',
  'The Avengers': 'The_Avengers_(2012_film)',
  'Black Panther': 'Black_Panther_(film)',
  'Black Panther: Wakanda Forever': 'Black_Panther:_Wakanda_Forever',
  'Top Gun: Maverick': 'Top_Gun:_Maverick',
  'Guardians of the Galaxy - Vệ Binh Dải Ngân Hà': 'Guardians_of_the_Galaxy_(film)',
  'Wonder Woman': 'Wonder_Woman_(2017_film)',
  'Deadpool 3 & Wolverine': 'Deadpool_%26_Wolverine',
  'Extraction - Phi Vụ Giải Cứu': 'Extraction_(2020_film)',
  'Bad Boys: Ride or Die': 'Bad_Boys:_Ride_or_Die',
  'Bad Boys: Đường Cùng': 'Bad_Boys:_Ride_or_Die',
  'Ambulance - Cuộc Đào Thoát': 'Ambulance_(2022_film)',
  'Red Notice - Lệnh Truy Nã Đỏ': 'Red_Notice_(film)',
  'Red Notice - Lệnh Truy Nã': 'Red_Notice_(film)',
  'Violent Night - Đêm Bạo Lực': 'Violent_Night',
  'Violent Night - Đêm Bạo Tàn': 'Violent_Night',
  'Road House': 'Road_House_(2024_film)',
  'Road House - Quán Bar Giang Hồ': 'Road_House_(2024_film)',
  'Gladiator - Võ Sĩ Giác Đấu': 'Gladiator_(2000_film)',
  'Godzilla x Kong: Đế Chế Mới': 'Godzilla_x_Kong:_The_New_Empire',
  'Venom: Kèo Cuối': 'Venom:_The_Last_Dance',
  'Venom: The Last Dance': 'Venom:_The_Last_Dance',
  'The Gray Man - Đặc Vụ Vô Hình': 'The_Gray_Man_(2022_film)',
  'Bullet Train - Tàu Cao Tốc': 'Bullet_Train_(film)',
  'Nobody - Tay Không Phải Dạng Vừa': 'Nobody_(2021_film)',
  'The Equalizer 3 - Thiện Ác Đối Đầu 3': 'The_Equalizer_3',
  'The Tomorrow War': 'The_Tomorrow_War',
  'Uncharted - Thợ Săn Kho Báu': 'Uncharted_(film)',
  'Monkey Man': 'Monkey_Man_(film)',
  'The Beekeeper - Thợ Nuôi Ong': 'The_Beekeeper_(2024_film)',
  'The Fall Guy - Người Đóng Thế': 'The_Fall_Guy_(film)',
  'Civil War': 'Civil_War_(film)',
  'Argylle': 'Argylle',
  'Lift - Phi Vụ Trên Mây': 'Lift_(2024_film)',
  'The Batman': 'The_Batman_(film)',
  'Black Adam': 'Black_Adam_(film)',
  'The Flash': 'The_Flash_(film)',
  'Aquaman': 'Aquaman_(film)',
  'Aquaman and the Lost Kingdom': 'Aquaman_and_the_Lost_Kingdom',
  'Shazam! Fury of the Gods': 'Shazam!_Fury_of_the_Gods',
  'Blue Beetle': 'Blue_Beetle_(film)',
  'Black Widow': 'Black_Widow_(2021_film)',
  'Shang-Chi and the Legend of the Ten Rings': 'Shang-Chi_and_the_Legend_of_the_Ten_Rings',
  'Thor: Love and Thunder': 'Thor:_Love_and_Thunder',
  'Thor: Ragnarok': 'Thor:_Ragnarok',
  'Captain Marvel': 'Captain_Marvel_(film)',
  'Ant-Man and the Wasp: Quantumania': 'Ant-Man_and_the_Wasp:_Quantumania',
  'The Marvels': 'The_Marvels',
  'Birds of Prey': 'Birds_of_Prey_(2020_film)',
  'Wonder Woman 1984': 'Wonder_Woman_1984',
  'The Suicide Squad': 'The_Suicide_Squad_(film)',
  'The Suicide Squad (2021)': 'The_Suicide_Squad_(film)',
  
  // Animated
  'Toy Story': 'Toy_Story',
  'Frozen - Nữ Hoàng Băng Giá': 'Frozen_(2013_film)',
  'Coco - Hội Ngộ Diệu Kỳ': 'Coco_(2017_film)',
  'Coco: Hội Ngộ Diệu Kỳ': 'Coco_(2017_film)',
  'Spider-Man: Vũ Trụ Nhện Mới': 'Spider-Man:_Into_the_Spider-Verse',
  'Spider-Man: Into the Spider-Verse': 'Spider-Man:_Into_the_Spider-Verse',
  'Spider-Man: Across the Spider-Verse': 'Spider-Man:_Across_the_Spider-Verse',
  'Your Name - Tên Cậu Là Gì': 'Your_Name',
  'Inside Out 2 - Những Mảnh Ghép Cảm Xúc 2': 'Inside_Out_2',
  'Những Mảnh Ghép Cảm Xúc': 'Inside_Out_(2015_film)',
  'Những Mảnh Ghép Cảm Xúc 2': 'Inside_Out_2',
  'The Little Mermaid - Nàng Tiên Cá': 'The_Little_Mermaid_(2023_film)',
  'The Super Mario Bros. Movie': 'The_Super_Mario_Bros._Movie',
  'Elemental - Xứ Sở Các Nguyên Tố': 'Elemental_(2023_film)',
  'Turning Red - Gấu Đỏ May Mắn': 'Turning_Red',
  'Luca': 'Luca_(2021_film)',
  'Onward - Tiến Lên Phía Trước': 'Onward_(film)',
  'Soul': 'Soul_(2020_film)',
  'Raya and the Last Dragon': 'Raya_and_the_Last_Dragon',
  'Lightyear - Người Trong Truyền Thuyết': 'Lightyear_(film)',
  'Minions: The Rise of Gru': 'Minions:_The_Rise_of_Gru',
  'Puss in Boots: The Last Wish': 'Puss_in_Boots:_The_Last_Wish',
  'Migration - Cuộc Di Cư': 'Migration_(film)',
  'Wish - Ngôi Sao Ước': 'Wish_(film)',
  'Moana 2 - Hành Trình Của Moana 2': 'Moana_2',
  'Trolls Band Together': 'Trolls_Band_Together',
  'Leo': 'Leo_(2023_film)',
  'The Boy and the Heron': 'The_Boy_and_the_Heron',
  'How to Train Your Dragon: The Hidden World': 'How_to_Train_Your_Dragon:_The_Hidden_World',
  'Suzume - Suzume no Tojimari': 'Suzume',
  
  // Classic & Award Winners
  'Forrest Gump': 'Forrest_Gump',
  'The Godfather': 'The_Godfather',
  'The Godfather - Bố Già': 'The_Godfather',
  'Bố Già': 'Bo_Gia',
  'Fight Club': 'Fight_Club',
  'Joker': 'Joker_(2019_film)',
  'The Shape of Water - Hình Dạng Của Nước': 'The_Shape_of_Water',
  'Parasite - Ký Sinh Trùng': 'Parasite_(2019_film)',
  'Ký Sinh Trùng': 'Parasite_(2019_film)',
  'Once Upon a Time in Hollywood': 'Once_Upon_a_Time_in_Hollywood',
  'Everything Everywhere All at Once - Cuộc Chiến Đa Vũ Trụ': 'Everything_Everywhere_All_at_Once',
  'No Time to Die - Không Phải Lúc Chết': 'No_Time_to_Die',
  'Mission: Impossible – Dead Reckoning Part One': 'Mission:_Impossible_–_Dead_Reckoning_Part_One',
  'Wicked - Phù Thủy Xanh': 'Wicked_(2024_film)',
  'Birdman - Người Chim': 'Birdman_(film)',
  'Barbie': 'Barbie_(film)',
  'The Shawshank Redemption - Nhà Tù Shawshank': 'The_Shawshank_Redemption',
  'Nhà Tù Shawshank': 'The_Shawshank_Redemption',
  'Pulp Fiction - Chuyện Tào Lao': 'Pulp_Fiction',
  'Schindler\'s List - Bản Danh Sách Schindler': 'Schindler%27s_List',
  'The Irishman - Người Ireland': 'The_Irishman',
  '1917': '1917_(2019_film)',
  'The Trial of the Chicago 7': 'The_Trial_of_the_Chicago_7',
  'Marriage Story': 'Marriage_Story',
  'The Grand Budapest Hotel': 'The_Grand_Budapest_Hotel',
  'Lady Bird': 'Lady_Bird_(film)',
  'Three Billboards Outside Ebbing, Missouri': 'Three_Billboards_Outside_Ebbing,_Missouri',
  'Moonlight - Ánh Trăng': 'Moonlight_(2016_film)',
  'The Power of the Dog - Sức Mạnh Của Chó': 'The_Power_of_the_Dog_(film)',
  'Triangle of Sadness - Tam Giác Buồn': 'Triangle_of_Sadness',
  'Bohemian Rhapsody': 'Bohemian_Rhapsody_(film)',
  'The Father': 'The_Father_(2020_film)',
  'Nomadland - Miền Đất Du Mục': 'Nomadland',
  'Belfast': 'Belfast_(film)',
  'CODA': 'CODA_(2021_film)',
  'The Banshees of Inisherin': 'The_Banshees_of_Inisherin',
  'Tár': 'Tár',
  'The Whale - Cá Voi': 'The_Whale_(2022_film)',
  'The Holdovers - Những Kẻ Ở Lại': 'The_Holdovers',
  'American Fiction': 'American_Fiction_(film)',
  'Anatomy of a Fall - Giải Mã Tội Ác': 'Anatomy_of_a_Fall',
  'Poor Things - Những Người Khốn Khổ': 'Poor_Things_(film)',
  'The Zone of Interest - Vùng Ảnh Hưởng': 'The_Zone_of_Interest_(film)',
  'Killers of the Flower Moon - Những Kẻ Sát Nhân': 'Killers_of_the_Flower_Moon_(film)',
  'May December': 'May_December_(film)',
  'Maestro': 'Maestro_(2023_film)',
  'The Color Purple (2023)': 'The_Color_Purple_(2023_film)',
  'Saltburn': 'Saltburn_(film)',
  'Napoleon': 'Napoleon_(2023_film)',
  'The Fabelmans': 'The_Fabelmans',
  'Living': 'Living_(2022_film)',
  'Women Talking - Phụ Nữ Lên Tiếng': 'Women_Talking_(film)',
  'The Creator': 'The_Creator_(2023_film)',
  'The Killer - Kẻ Sát Nhân': 'The_Killer_(2023_film)',
  'Priscilla': 'Priscilla_(2023_film)',
  'Past Lives - Những Kiếp Trước': 'Past_Lives_(film)',
  
  // Action Thrillers/Other
  'Knives Out - Kẻ Đâm Lén': 'Knives_Out',
  'The Menu - Thực Đơn Chết Chóc': 'The_Menu_(2022_film)',
  'Leave the World Behind': 'Leave_the_World_Behind_(film)',
  'Wonka': 'Wonka_(film)',
  'Anyone But You': 'Anyone_But_You',
  'Challengers - Tình Địch': 'Challengers_(film)',
  'Mean Girls (2024)': 'Mean_Girls_(2024_film)',
  'The Idea of You': 'The_Idea_of_You_(film)',
  'Bob Marley: One Love': 'Bob_Marley:_One_Love',
  'Beetlejuice Beetlejuice': 'Beetlejuice_Beetlejuice',
  'Twisters': 'Twisters_(film)',
  'Transformers: Rise of the Beasts': 'Transformers:_Rise_of_the_Beasts',
  'The Wild Robot - Robot Hoang Dã': 'The_Wild_Robot',
  'Kinds of Kindness - Ba Tầng Tàn Nhẫn': 'Kinds_of_Kindness',
  'Kingdom of the Planet of the Apes': 'Kingdom_of_the_Planet_of_the_Apes',
  'A Quiet Place: Day One': 'A_Quiet_Place:_Day_One',
  'A Quiet Place Part II': 'A_Quiet_Place_Part_II',
  'Scream (2022)': 'Scream_(2022_film)',
  'Scream VI': 'Scream_VI',
  'Smile 2': 'Smile_2',
  'Borderlands': 'Borderlands_(film)',
  'Trap - Bẫy': 'Trap_(2024_film)',
  'The Crow (2024)': 'The_Crow_(2024_film)',
  'The Watchers': 'The_Watchers_(film)',
  'The First Omen': 'The_First_Omen',
  'Tarot': 'Tarot_(2024_film)',
  'Abigail': 'Abigail_(2024_film)',
  'Immaculate - Vô Nhiễm': 'Immaculate_(film)',
  'Madame Web': 'Madame_Web_(film)',
  'Kraven the Hunter - Thợ Săn': 'Kraven_the_Hunter_(film)',
  'Morbius': 'Morbius_(film)',
  
  // Asian Films
  'Burning - Thiêu Đốt': 'Burning_(2018_film)',
  'Minari': 'Minari',
  'Broker - Người Môi Giới': 'Broker_(2022_film)',
  'Decision to Leave - Chia Tay': 'Decision_to_Leave',
  'Smugglers - Buôn Lậu': 'Smugglers_(2023_film)',
  'Carter': 'Carter_(film)',
  'Peninsula - Bán Đảo': 'Peninsula_(film)',
  'RRR': 'RRR_(film)',
  'Pathaan': 'Pathaan',
  'Vikram': 'Vikram_(2022_film)',
  'The Gangster, the Cop, the Devil': 'The_Gangster,_the_Cop,_the_Devil',
  'Mai': 'Mai_(film)',
  'Nhà Bà Nữ': 'Nhà_Bà_Nữ',
  
  // Netflix/Streaming
  'The Adam Project - Dự Án Adam': 'The_Adam_Project',
  'Rebel Moon - Phần 1: Đứa Con Của Lửa': 'Rebel_Moon',
  'Society of the Snow - Xã Hội Tuyết': 'Society_of_the_Snow',
  'Spaceman - Phi Hành Gia': 'Spaceman_(2024_film)',
  'Atlas': 'Atlas_(2024_film)',
  'Damsel - Công Chúa Trong Hang Rồng': 'Damsel_(2024_film)',
  'Glass Onion: A Knives Out Mystery': 'Glass_Onion:_A_Knives_Out_Mystery',
  'Enola Holmes 2': 'Enola_Holmes_2',
  
  // Misc
  '10 Things I Hate About You - 10 Điều Em Ghét Ở Anh': '10_Things_I_Hate_About_You',
  'Promising Young Woman - Cô Gái Trẻ Đầy Hứa Hẹn': 'Promising_Young_Woman',
  'Room - Căn Phòng': 'Room_(2015_film)',
  'Manchester by the Sea': 'Manchester_by_the_Sea_(film)',
  'Sound of Metal - Âm Thanh Kim Loại': 'Sound_of_Metal',
  'Spotlight - Tiêu Điểm': 'Spotlight_(film)',
  '65 - 65 Triệu Năm': '65_(film)',
  'Amsterdam': 'Amsterdam_(2022_film)',
  'All Quiet on the Western Front - Mặt Trận Phía Tây': 'All_Quiet_on_the_Western_Front_(2022_film)',
  'Reminiscence - Hồi Ức': 'Reminiscence_(film)',
  'Underwater - Mật Mã Biển Sâu': 'Underwater_(2020_film)',
  'Tomorrowland - Thế Giới Bí Ẩn': 'Tomorrowland_(film)',
  'Battle: Los Angeles': 'Battle:_Los_Angeles',
  'The Northman - Chiến Binh Phương Bắc': 'The_Northman',
  'Nope': 'Nope_(film)',
  'Nope (2022)': 'Nope_(film)',
  'Cocaine Bear - Gấu Phê Pha': 'Cocaine_Bear',
  
  // Horror Vietnamese titles
  'Ám Ảnh Kinh Hoàng': 'The_Conjuring',
  'Ám Ảnh Kinh Hoàng 2': 'The_Conjuring_2',
  'M3GAN': 'M3GAN',
  'Alien: Romulus': 'Alien:_Romulus',
  'To All the Boys I\'ve Loved Before - Những Chàng Trai Năm Ấy': 'To_All_the_Boys_I%27ve_Loved_Before_(film)',
  'Extraction 2 - Phi Vụ Giải Cứu 2': 'Extraction_2',
};

// Known working poster URLs (manually verified from Wikipedia)
const KNOWN_POSTERS = {
  // Christopher Nolan Films
  'Oppenheimer': 'https://en.wikipedia.org/wiki/Special:FilePath/Oppenheimer_%28film%29.jpg',
  'Inception - Giấc Mơ Trong Mơ': 'https://en.wikipedia.org/wiki/Special:FilePath/Inception_%282010%29_theatrical_poster.jpg',
  'Interstellar - Hố Đen Tử Thần': 'https://en.wikipedia.org/wiki/Special:FilePath/Interstellar_film_poster.jpg',
  'The Dark Knight - Kỵ Sĩ Bóng Đêm': 'https://en.wikipedia.org/wiki/Special:FilePath/The_Dark_Knight_%282008_film%29.jpg',
  'TENET': 'https://en.wikipedia.org/wiki/Special:FilePath/Tenet_movie_poster.jpg',
  'Dunkirk': 'https://en.wikipedia.org/wiki/Special:FilePath/Dunkirk_Film_poster.jpg',
  
  // Action/Adventure
  'Avatar': 'https://en.wikipedia.org/wiki/Special:FilePath/Avatar_%282009_film%29_poster.jpg',
  'Avatar: Dòng Chảy Của Nước': 'https://en.wikipedia.org/wiki/Special:FilePath/Avatar_The_Way_of_Water_poster.jpg',
  'Fast X': 'https://en.wikipedia.org/wiki/Special:FilePath/Fast_X_poster.jpg',
  'F9 - Fast & Furious 9': 'https://en.wikipedia.org/wiki/Special:FilePath/F9_poster.jpg',
  'John Wick: Chapter 4': 'https://en.wikipedia.org/wiki/Special:FilePath/John_Wick_-_Chapter_4_promotional_poster.jpg',
  'Spider-Man: No Way Home': 'https://en.wikipedia.org/wiki/Special:FilePath/Spider-Man_No_Way_Home_poster.jpg',
  'Spider-Man: Far From Home': 'https://en.wikipedia.org/wiki/Special:FilePath/Spider-Man_Far_From_Home_poster.jpg',
  'Avengers: Endgame': 'https://en.wikipedia.org/wiki/Special:FilePath/Avengers_Endgame_poster.jpg',
  'Avengers: Infinity War': 'https://en.wikipedia.org/wiki/Special:FilePath/Avengers_Infinity_War_poster.jpg',
  'The Avengers': 'https://en.wikipedia.org/wiki/Special:FilePath/The_Avengers_%282012_film%29_poster.jpg',
  'Black Panther': 'https://en.wikipedia.org/wiki/Special:FilePath/Black_Panther_%28film%29_poster.jpg',
  'Black Panther: Wakanda Forever': 'https://en.wikipedia.org/wiki/Special:FilePath/Black_Panther_Wakanda_Forever_poster.jpg',
  'Top Gun: Maverick': 'https://en.wikipedia.org/wiki/Special:FilePath/Top_Gun_Maverick_Poster.jpg',
  'Guardians of the Galaxy - Vệ Binh Dải Ngân Hà': 'https://en.wikipedia.org/wiki/Special:FilePath/Guardians_of_the_Galaxy_poster.jpg',
  'Wonder Woman': 'https://en.wikipedia.org/wiki/Special:FilePath/Wonder_Woman_%282017_film%29.jpg',
  'Deadpool 3 & Wolverine': 'https://en.wikipedia.org/wiki/Special:FilePath/Deadpool_%26_Wolverine_poster.jpg',
  'Godzilla x Kong: Đế Chế Mới': 'https://en.wikipedia.org/wiki/Special:FilePath/Godzilla_x_kong_the_new_empire_poster.jpg',
  'Venom: Kèo Cuối': 'https://en.wikipedia.org/wiki/Special:FilePath/Venom_The_Last_Dance_Poster.jpg',
  'Extraction - Phi Vụ Giải Cứu': 'https://en.wikipedia.org/wiki/Special:FilePath/Extraction_%282020_film%29.png',
  'Bad Boys: Đường Cùng': 'https://en.wikipedia.org/wiki/Special:FilePath/Bad_Boys_Ride_or_Die_%282024%29_poster.jpg',
  'Ambulance': 'https://en.wikipedia.org/wiki/Special:FilePath/Ambulance_film_poster.jpg',
  'Red Notice - Lệnh Truy Nã Đỏ': 'https://en.wikipedia.org/wiki/Special:FilePath/Red_Notice_-_film_promotional_image.jpg',
  'Violent Night - Đêm Bạo Tàn': 'https://en.wikipedia.org/wiki/Special:FilePath/Violent_Night_poster.jpg',
  'Road House - Quán Bar Giang Hồ': 'https://en.wikipedia.org/wiki/Special:FilePath/Road_House_2024_poster.jpg',
  'Gladiator - Võ Sĩ Giác Đấu': 'https://en.wikipedia.org/wiki/Special:FilePath/Gladiator_%282000_film_poster%29.png',
  
  // Romance
  'Titanic': 'https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png',
  'The Notebook - Nhật Ký Tình Yêu': 'https://upload.wikimedia.org/wikipedia/en/4/49/Posternotebook.jpg',
  'La La Land - Những Kẻ Mộng Mơ': 'https://upload.wikimedia.org/wikipedia/en/a/ab/La_La_Land_%28film%29.png',
  'Pride and Prejudice - Kiêu Hãnh Và Định Kiến': 'https://upload.wikimedia.org/wikipedia/en/8/86/PrideandPrejudicePoster.jpg',
  'Romeo + Juliet': 'https://upload.wikimedia.org/wikipedia/en/b/bc/RomeoandJuliet1996.jpg',
  'A Star Is Born - Một Ngôi Sao Ra Đời': 'https://upload.wikimedia.org/wikipedia/en/8/86/A_Star_Is_Born_%282018_film_poster%29.png',
  'Crazy Rich Asians - Con Nhà Siêu Giàu Châu Á': 'https://upload.wikimedia.org/wikipedia/en/b/ba/Crazy_Rich_Asians_poster.png',
  
  // Horror
  'The Shining - Khách Sạn Ma Quái': 'https://upload.wikimedia.org/wikipedia/en/1/1d/The_Shining_%281980%29_U.K._release_poster_-_The_tide_of_terror_that_swept_America_IS_HERE.jpg',
  'The Exorcist - Quỷ Ám': 'https://upload.wikimedia.org/wikipedia/en/e/e0/The_Exorcist_%281973%29_theatrical_poster.jpg',
  'It - Gã Hề Ma Quái': 'https://upload.wikimedia.org/wikipedia/en/5/5a/It_%282017%29_poster.jpg',
  'Get Out - Lấy Mạng': 'https://upload.wikimedia.org/wikipedia/en/a/a3/Get_Out_poster.png',
  'Insidious - Quỷ Quyệt': 'https://upload.wikimedia.org/wikipedia/en/2/2d/Insidious_poster.jpg',
  'The Ring - Vòng Tròn Kinh Hoàng': 'https://upload.wikimedia.org/wikipedia/en/9/9c/The_Ring_poster.jpg',
  'Halloween (2018)': 'https://upload.wikimedia.org/wikipedia/en/1/1d/Halloween_%282018%29_poster.jpg',
  'M3GAN - Búp Bê Sát Nhân': 'https://upload.wikimedia.org/wikipedia/en/f/f9/M3GAN_poster.jpg',
  'Smile - Cười': 'https://upload.wikimedia.org/wikipedia/en/e/e5/Smile_2022_film_poster.jpg',
  'Us - Chúng Ta': 'https://upload.wikimedia.org/wikipedia/en/1/1c/Us_%282019%29_theatrical_poster.png',
  'Annabelle': 'https://upload.wikimedia.org/wikipedia/en/2/21/Annabelle_poster.jpg',
  'The Conjuring - Ám Ảnh Kinh Hoàng': 'https://upload.wikimedia.org/wikipedia/en/1/1f/Conjuring_poster.jpg',
  'A Nightmare on Elm Street - Ác Mộng Phố Elm': 'https://upload.wikimedia.org/wikipedia/en/f/fa/A_Nightmare_on_Elm_Street_%281984%29_theatrical_poster.jpg',
  'Friday the 13th - Thứ Sáu Ngày 13': 'https://upload.wikimedia.org/wikipedia/en/0/0b/Friday_the_13th_%281980%29_theatrical_poster.jpg',
  'The Nun - Ác Quỷ Ma Sơ': 'https://upload.wikimedia.org/wikipedia/en/6/6f/TheNunPoster.jpg',
  'Sinister - Điềm Báo Tử Thần': 'https://upload.wikimedia.org/wikipedia/en/5/53/Sinister_film_poster.jpg',
  
  // Sci-Fi
  'Dune: Hành Tinh Cát': 'https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg',
  'Dune: Hành Tinh Cát - Phần Hai': 'https://upload.wikimedia.org/wikipedia/en/5/52/Dune_Part_Two_poster.jpeg',
  'Ma Trận': 'https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png',
  'The Matrix - Ma Trận': 'https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png',
  'Blade Runner 2049': 'https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png',
  'Arrival - Cuộc Chiến Ngoài Hành Tinh': 'https://upload.wikimedia.org/wikipedia/en/d/df/Arrival%2C_Movie_Poster.jpg',
  'The Terminator - Kẻ Hủy Diệt': 'https://upload.wikimedia.org/wikipedia/en/7/70/Terminator1984movieposter.jpg',
  
  // Animated
  'Toy Story': 'https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg',
  'Frozen - Nữ Hoàng Băng Giá': 'https://upload.wikimedia.org/wikipedia/en/0/05/Frozen_%282013_film%29_poster.jpg',
  'Coco - Hội Ngộ Diệu Kỳ': 'https://upload.wikimedia.org/wikipedia/en/9/98/Coco_%282017_film%29_poster.jpg',
  'Spider-Man: Vũ Trụ Nhện Mới': 'https://upload.wikimedia.org/wikipedia/en/d/dc/Spider-Man_Into_the_Spider-Verse.png',
  'Your Name - Tên Cậu Là Gì': 'https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png',
  'Inside Out 2 - Những Mảnh Ghép Cảm Xúc 2': 'https://upload.wikimedia.org/wikipedia/en/f/f7/Inside_Out_2_poster.jpg',
  'The Little Mermaid - Nàng Tiên Cá': 'https://upload.wikimedia.org/wikipedia/en/f/f4/The_Little_Mermaid_%282023_film%29.png',
  
  // Classic & Award Winners
  'Forrest Gump': 'https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg',
  'The Godfather': 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg',
  'The Godfather - Bố Già': 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg',
  'Fight Club': 'https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg',
  'Joker': 'https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg',
  'The Shape of Water - Hình Dạng Của Nước': 'https://upload.wikimedia.org/wikipedia/en/5/5b/The_Shape_of_Water_%28film%29.png',
  'Parasite - Ký Sinh Trùng': 'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png',
  'Once Upon a Time in Hollywood': 'https://upload.wikimedia.org/wikipedia/en/a/a5/Once_Upon_a_Time_in_Hollywood_poster.png',
  'Everything Everywhere All at Once - Cuộc Chiến Đa Vũ Trụ': 'https://upload.wikimedia.org/wikipedia/en/1/1e/Everything_Everywhere_All_at_Once.jpg',
  'No Time to Die - Không Phải Lúc Chết': 'https://upload.wikimedia.org/wikipedia/en/f/ff/No_Time_to_Die_poster.jpg',
  'Mission: Impossible – Dead Reckoning Part One': 'https://upload.wikimedia.org/wikipedia/en/e/ed/Mission_Impossible_%E2%80%93_Dead_Reckoning_Part_One_poster.jpg',
  'Wicked - Phù Thủy Xanh': 'https://upload.wikimedia.org/wikipedia/en/3/37/Wicked_%28film%29_poster.jpg',
  'Birdman - Người Chim': 'https://upload.wikimedia.org/wikipedia/en/a/a3/Birdman_poster.jpg',
  'Barbie': 'https://upload.wikimedia.org/wikipedia/en/0/0b/Barbie_2023_poster.jpg',
  'The Shawshank Redemption - Nhà Tù Shawshank': 'https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg',
  'Pulp Fiction - Chuyện Tào Lao': 'https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg',
  'Schindler\'s List - Bản Danh Sách Schindler': 'https://upload.wikimedia.org/wikipedia/en/3/38/Schindler%27s_List_movie.jpg',
  
  // Browser automation batch 2
  'Aquaman': 'https://en.wikipedia.org/wiki/Special:FilePath/Aquaman_%28film%29_poster.jpg',
  'The Batman': 'https://en.wikipedia.org/wiki/Special:FilePath/The_Batman_%28film%29_poster.jpg',
  'Thor: Ragnarok': 'https://en.wikipedia.org/wiki/Special:FilePath/Thor_Ragnarok_poster.jpg',
  'Captain Marvel': 'https://en.wikipedia.org/wiki/Special:FilePath/Captain_Marvel_%28film%29_poster.jpg',
  'Black Widow': 'https://en.wikipedia.org/wiki/Special:FilePath/Black_Widow_%282021_film%29_poster.jpg',
  'Shang-Chi and the Legend of the Ten Rings': 'https://en.wikipedia.org/wiki/Special:FilePath/Shang-Chi_and_the_Legend_of_the_Ten_Rings_poster.jpeg',
  'Doctor Strange in the Multiverse of Madness': 'https://en.wikipedia.org/wiki/Special:FilePath/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg',
  'Ant-Man and the Wasp: Quantumania': 'https://en.wikipedia.org/wiki/Special:FilePath/Ant-Man_and_the_Wasp_Quantumania_poster.jpg',
  'Bohemian Rhapsody': 'https://en.wikipedia.org/wiki/Special:FilePath/Bohemian_Rhapsody_poster.png',
  'Puss in Boots: The Last Wish': 'https://en.wikipedia.org/wiki/Special:FilePath/Puss_in_Boots_The_Last_Wish_poster.jpg',
  'Wonka': 'https://en.wikipedia.org/wiki/Special:FilePath/Wonka_2023_film_poster.jpg',
  'Train to Busan': 'https://en.wikipedia.org/wiki/Special:FilePath/Train_to_Busan.jpg',
  'Train to Busan - Chuyến Tàu Sinh Tử': 'https://en.wikipedia.org/wiki/Special:FilePath/Train_to_Busan.jpg',
  
  // Browser automation batch 3
  'Transformers: Rise of the Beasts': 'https://en.wikipedia.org/wiki/Special:FilePath/Transformers-_Rise_of_the_Beasts.jpg',
  'The Marvels': 'https://en.wikipedia.org/wiki/Special:FilePath/The_Marvels_poster.jpg',
  'The Flash': 'https://en.wikipedia.org/wiki/Special:FilePath/The_Flash_%28film%29_poster.jpg',
  'The Super Mario Bros. Movie': 'https://en.wikipedia.org/wiki/Special:FilePath/The_Super_Mario_Bros._Movie_poster.jpg',
  'Elemental': 'https://en.wikipedia.org/wiki/Special:FilePath/Elemental_final_poster.jpg',
  'Elemental - Những Mảnh Ghép Yêu Thương': 'https://en.wikipedia.org/wiki/Special:FilePath/Elemental_final_poster.jpg',
  'Blue Beetle': 'https://en.wikipedia.org/wiki/Special:FilePath/Blue_Beetle_%28film%29_poster.jpg',

  'A Tale of Two Sisters - Câu Chuyện Hai Chị Em': 'https://th.bing.com/th/id/R.04d17990d36b9efa77a48ded6799d47d?rik=N%2feast1wevdB%2bw&pid=ImgRaw&r=0',    
  'Ju-On: The Grudge - Lời Nguyền': 'https://clbphimxua.com/wp-content/uploads/2023/01/MV5BYjNjMWNhZjctYmQzYS00M2ZmLWEzZTktZTJjZDI0NmM0MmMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_-e1672903893233.jpg',
   'Ringu - Vòng Tròn Định Mệnh': 'https://th.bing.com/th/id/R.06e2790fbbddbc92661a998de11e574b?rik=0eC47YVu3IPwrw&pid=ImgRaw&r=0',
   'Talk to Me - Nói Chuyện Với Tôi': 'https://tse4.mm.bing.net/th/id/OIP.NIIAXEKVbXliMcgJMRJZZwHaLG?rs=1&pid=ImgDetMain&o=7&rm=3',
   'Barbarian - Kẻ Man Rợ': 'https://posterspy.com/wp-content/uploads/2022/11/Barbarian_Poster.jpg',
   'Pearl': 'https://tse3.mm.bing.net/th/id/OIP.VXYq_SW-6c5Efkezq9bfOQHaK-?rs=1&pid=ImgDetMain&o=7&rm=3',
   'The Menu': 'https://th.bing.com/th/id/R.40e55982b5893d3a4771167ee73700c4?rik=FTgc5vsrj2wTgA&riu=http%3a%2f%2fwww.impawards.com%2f2022%2fposters%2fmenu_ver3_xxlg.jpg&ehk=vqkqi2mwhnfvgk0%2beMplFLHrkWclbbRNixcbPoOnRbw%3d&risl=&pid=ImgRaw&r=0',
   'Nope / Nope (2022)': 'https://posterspy.com/wp-content/uploads/2022/10/Nope-Poster-2-FINAL-LOW-RES.jpg',
    'The Black Phone - Điện Thoại Đen': 'https://posterspy.com/wp-content/uploads/2023/03/The-Black-Phone-Poster-Edit.webp'
};

// Helper for HTTP GET
async function httpGet(url) {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'MovieHub/1.0 (https://github.com/giang-mov); giang@example.com'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(null));
  });
}

// Fetch poster URL from Wikipedia using Search + REST Summary API
async function fetchWikiPoster(query) {
  try {
    // 1. Search for the most relevant article title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`;
    const searchData = await httpGet(searchUrl);
    if (!searchData) return null;
    
    const searchJson = JSON.parse(searchData);
    const articleTitle = searchJson[1]?.[0];
    if (!articleTitle) return null;

    // 2. Get the summary which contains the "originalimage"
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleTitle.replace(/ /g, '_'))}`;
    const summaryData = await httpGet(summaryUrl);
    if (!summaryData) return null;

    const summaryJson = JSON.parse(summaryData);
    const sourceUrl = summaryJson.originalimage?.source;
    
    if (sourceUrl) {
      // 3. Convert to stable Special:FilePath if it's a Wikipedia upload URL
      // Example: https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_(2010)_theatrical_poster.jpg
      const parts = sourceUrl.split('/');
      const fileName = parts[parts.length - 1];
      if (sourceUrl.includes('wikimedia.org')) {
        return `https://en.wikipedia.org/wiki/Special:FilePath/${fileName}`;
      }
      return sourceUrl;
    }
    
    return null;
  } catch (e) {
    console.error(`Error fetching poster for ${query}:`, e.message);
    return null;
  }
}

// Validate URL returns 200 OK
// Wikipedia blocks HEAD requests, so we use GET with User-Agent
async function validateUrl(url) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      };
      
      const req = https.request(options, (res) => {
        // Consume response data to free up memory
        res.resume();
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

async function main() {
  console.log('🎬 Starting poster URL update with validation...\n');

  // Get all movies
  const movies = await prisma.movie.findMany({
    select: { id: true, title: true, posterUrl: true },
    orderBy: { title: 'asc' },
  });

  console.log(`Found ${movies.length} movies\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;
  let invalidUrls = 0;

  for (const movie of movies) {
    // Check if already has a valid real poster
    if (movie.posterUrl && !movie.posterUrl.includes('placeholder')) {
      const isValid = await validateUrl(movie.posterUrl);
      if (isValid) {
        skipped++;
        continue;
      }
      console.log(`♻️  ${movie.title} has invalid URL, re-fetching...`);
    }

    let posterUrl = null;
    let source = '';

    // Check known posters first
    if (KNOWN_POSTERS[movie.title]) {
      posterUrl = KNOWN_POSTERS[movie.title];
      source = 'Known poster';
    } else {
      // Try Wikipedia API
      let wikiTitle = TITLE_MAPPINGS[movie.title];
      
      if (!wikiTitle) {
        // Try to extract English part if title has "English - Vietnamese" pattern
        const englishPart = movie.title.split(' - ')[0].trim();
        wikiTitle = englishPart.replace(/ /g, '_');
      }
      
      posterUrl = await fetchWikiPoster(wikiTitle);
      
      // If still not found, try adding "(film)" or "(20xx_film)"
      if (!posterUrl) {
         posterUrl = await fetchWikiPoster(wikiTitle + '_(film)');
      }

      source = posterUrl ? 'Wiki API' : 'Not found';
    }
    
    if (posterUrl) {
      // Validate URL before saving
      const isValid = await validateUrl(posterUrl);
      
      if (isValid) {
        await prisma.movie.update({
          where: { id: movie.id },
          data: { posterUrl },
        });
        console.log(`✅ ${movie.title} → ${source}`);
        updated++;
      } else {
        console.log(`⚠️  ${movie.title} → Invalid URL (${source})`);
        invalidUrls++;
      }
    } else {
      console.log(`❌ ${movie.title} → Not found`);
      failed++;
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n🎉 Done!`);
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped (already has real URL): ${skipped}`);
  console.log(`⚠️  Invalid URLs: ${invalidUrls}`);
  console.log(`❌ Failed: ${failed}`);
}

main()
  .catch(e => console.error('Error:', e))
  .finally(() => prisma.$disconnect());

