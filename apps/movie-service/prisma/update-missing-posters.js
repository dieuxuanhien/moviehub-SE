const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Manual poster mappings - with correct titles from database
const posterMappings = {
  // User-specified URLs
  'Smile - Cười Đi Rồi Khóc': 'https://static.toiimg.com/photo/msid-95524977/95524977.jpg?8268',
  'Smile - Cười': 'https://th.bing.com/th/id/R.9eda4fdfb227604b3b3354f74c65a155?rik=%2fXGIU0ZIvFluHQ&pid=ImgRaw&r=0',
  'Jujutsu Kaisen 0': 'https://cdn.myanimelist.net/images/anime/1813/115732l.jpg',
  'Borderlands': 'https://static1.srcdn.com/wordpress/wp-content/uploads/2024/02/borderlands-2024-movie-poster.jpg',
  'The Fall Guy - Người Đóng Thế': 'https://tse1.mm.bing.net/th/id/OIP.S2nQ0LgrCt0EIPzyJ-5mewHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Wonder Woman': 'https://image.tmdb.org/t/p/original/4M3u41doa2tgd3MQFxs6NTqE6IW.jpg',
  'Kẻ Cắp Giấc Mơ': 'https://i.pinimg.com/originals/10/f9/9c/10f99c92e6b25daaad1fed3c09d16574.jpg',
  'Guardians of the Galaxy - Vệ Binh Dải Ngân Hà': 'https://kenh14cdn.com/QuickNewsK14/4113626/2014/07/img_201407081734101636.jpg',
  'Lift - Phi Vụ Trên Mây': 'https://www.artofvfx.com/wp-content/uploads/2023/11/lift_xxlg-jpg.webp',
  'Immaculate - Vô Nhiễm': 'https://www.universalmovies.it/wp-content/uploads/2024/06/poster_IMMACULATE-1000x1428.jpg',
  'Tarot': 'https://tse2.mm.bing.net/th/id/OIP.lxzy38hJl-O_sbGdGm3DnQHaKl?rs=1&pid=ImgDetMain&o=7&rm=3',
  'The Notebook - Nhật Ký Tình Yêu': 'https://www.elle.vn/app/uploads/2015/10/10/101669/phim-tinh-yeu-lang-man-The-Notebook.jpg',
  "To All the Boys I've Loved Before - Những Chàng Trai Năm Ấy": 'https://i.pinimg.com/originals/c9/84/e3/c984e36de0f700d862134699798f6ea6.jpg',
  'It Ends With Us - Chấm Dứt Ở Đây': 'https://tse3.mm.bing.net/th/id/OIP.VtnmNpBpSlR1vf55mL4fGQHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Anyone But You': 'https://th.bing.com/th/id/R.402753db2a06dd63a16ca71b45c941ec?rik=%2bHzhqq3Qox8ffQ&riu=http%3a%2f%2fwww.impawards.com%2f2023%2fposters%2fanyone_but_you_ver3_xlg.jpg&ehk=5StL5Zj2dti%2fy0Ltz4KA%2fcqVx6MbKs%2bXkNQsA8h%2bihw%3d&risl=&pid=ImgRaw&r=0',
  'Reminiscence - Hồi Ức': 'https://image.tmdb.org/t/p/original/vS2ivwixOdQqgLsOi5Ik78dxZ2W.jpg',
  'Underwater - Mật Mã Biển Sâu': 'https://www.themoviedb.org/t/p/original/gzlbb3yeVISpQ3REd3Ga1scWGTU.jpg',
  'F9 - Fast & Furious 9': 'https://th.bing.com/th/id/R.b2ca94d30db9bb06b4afcaac0d58d288?rik=lb5OvnWmmFdGSQ&riu=http%3a%2f%2fwww.impawards.com%2f2021%2fposters%2ffast_and_furious_nine_ver16.jpg&ehk=ipWXTwxTM3pBrC1NW%2fujG6ZoDvbp%2fP0NCVJxJ7G7Yjo%3d&risl=&pid=ImgRaw&r=0',
  'Migration - Cuộc Di Cư': 'https://dx35vtwkllhj9.cloudfront.net/universalstudios/migration/images/regions/us/onesheet.jpg',
  'The Shining - Khách Sạn Ma Quái': 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/65e8a0152157859.6318da663a952.jpg',
  'A Nightmare on Elm Street - Ác Mộng Phố Elm': 'https://tse4.mm.bing.net/th/id/OIP.oEq73w-_FWjxS-f_Le6SUAHaK-?rs=1&pid=ImgDetMain&o=7&rm=3',
  'M3GAN - Búp Bê Sát Nhân': 'https://m.media-amazon.com/images/I/61kPaHrl71L.__AC_SX300_SY300_QL70_ML2_.jpg',
  'The Terminator - Kẻ Hủy Diệt': 'https://th.bing.com/th/id/R.d05928185b1e1e5440052c180db9d56e?rik=d%2b1tw4NdbzJTAw&pid=ImgRaw&r=0',
  'Mission: Impossible – Dead Reckoning Part One': 'https://tse4.mm.bing.net/th/id/OIP.0Bhu8phHd0ty5UN6aw1XJgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
  'No Time to Die - Không Phải Lúc Chết': 'https://tse3.mm.bing.net/th/id/OIP.6h2R_Lln4gCEQHvHl-YG2gHaK-?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Deja Vu - Không Gian Ảo': 'https://tse3.mm.bing.net/th/id/OIP.i9iubpsTzfJTp9xR9pD3KgHaKN?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Oldboy - Báo Thù': 'https://th.bing.com/th/id/R.61c805ac50c2519092b023579c947a8a?rik=V2D26Ub%2b8HFvJQ&riu=http%3a%2f%2fnickyarborough.com%2fwp-content%2fuploads%2f2015%2f06%2foldboy.jpg&ehk=5jYb9HlbwVPz4Z7I7MauYw%2fqIsLqIZwV4i2pIpY02hY%3d&risl=&pid=ImgRaw&r=0',
  'Squid Game: Trò Chơi Con Mực (Phim)': 'https://bazaarvietnam.vn/wp-content/uploads/2021/09/phim-tro-choi-con-muc-squid-game-poster-netflixkr.jpg',
  'Train to Busan - Chuyến Tàu Sinh Tử': 'https://tse4.mm.bing.net/th/id/OIP.jgYBoLzXH8BMxU2WVVYnSwAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Trò Đùa Tử Thần': 'https://media.themoviedb.org/t/p/w500/fS4i7HHi1NNksTdAT8Vrvz9O161.jpg',
  'Us - Chúng Ta': 'https://th.bing.com/th/id/R.36fe8f77da0db16e8229d1636a08fd8e?rik=ENwQb7QnU4DIvQ&riu=http%3a%2f%2fwww.impawards.com%2f2019%2fposters%2fus_ver3.jpg&ehk=q6aw0o4qT%2fHPDMiPd7XOMntJUFpnkstn3kVH449ajMY%3d&risl=&pid=ImgRaw&r=0',
  'Nope (2022)': 'https://th.bing.com/th/id/R.63ff9b0d3080bd50e5d72e4dbe1b9665?rik=cRZAbaTS2JC9iA&pid=ImgRaw&r=0',
  'The Ring - Vòng Tròn Kinh Hoàng': 'https://th.bing.com/th/id/R.6cbc912cfe929d0499535359ab5c18bd?rik=jcmt2zMYb0eeIA&pid=ImgRaw&r=0',
  'Hereditary - Di Truyền': 'https://tse1.mm.bing.net/th/id/OIP.4uhabUz3m7mzsqVvcSL9MgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Wicked - Phù Thủy Xanh': 'https://tse4.mm.bing.net/th/id/OIP.VwfnAZ3IgG2ZDh8WKTSsHAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Nhà Bà Nữ': 'https://tse1.mm.bing.net/th/id/OIP.uRS6ZaAV15vFEUwloGEwcgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Bố Già': 'https://th.bing.com/th/id/R.36e2bb62fd18a7fe9fa081080ed757c2?rik=0%2bSeRAeY%2fZxZ2g&riu=http%3a%2f%2fwww.impawards.com%2fintl%2fvietnam%2f2021%2fposters%2fbo_gia_xlg.jpg&ehk=IduIKKUyFfIDmjL1XDQgZUllkNuMtIfjLraIQ5iaXEs%3d&risl=&pid=ImgRaw&r=0',
  'Mai': 'https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2023/12/mai-poster-dau-tien-he-lo-tinh-chi-em-chenh-lech-7-tuoi-giua-phuong-anh-dao-va-tuan-tran_6577e1433d186.jpeg',
  'Bố Già (The Godfather)': 'https://tse2.mm.bing.net/th/id/OIP.BV6gCt1rwqEmjRnWZ-sdPAHaLK?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Ferrari': 'https://tse3.mm.bing.net/th/id/OIP.1A9_oEkMw9gVQCpcTR1frAHaK4?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Alive - Sống Sót': 'https://www.themoviedb.org/t/p/original/g7hWnjMdqTYYI78yeCD3moObbRK.jpg',
  'Once Upon a Time in Hollywood': 'https://th.bing.com/th/id/R.271a60be7adbf6117bcb6600b4d19e57?rik=%2f4WbQSbDNGnVoA&riu=http%3a%2f%2fwww.impawards.com%2f2019%2fposters%2fonce_upon_a_time_in_hollywood_ver30_xlg.jpg&ehk=5R5UH80%2fiBgOBZzRHrQzTQh1JhO7fVwFyLJvXbu3lVo%3d&risl=&pid=ImgRaw&r=0',
  'A Star Is Born - Một Ngôi Sao Ra Đời': 'https://th.bing.com/th/id/R.2e839582fa157de38445f0d79e64011d?rik=swIQsfXvaoVwOg&riu=http%3a%2f%2fwww.impawards.com%2f2018%2fposters%2fstar_is_born_ver4.jpg&ehk=eB8hKFypFnKmvYMOaVOQ18EqiLrLM3G8X2%2fsaP%2fkhXY%3d&risl=&pid=ImgRaw&r=0',
  'Priscilla': 'https://image.tmdb.org/t/p/original/nmYB2z1M83IrxeNI4etrs3YGSxO.jpg',
  'Romeo + Juliet': 'https://www.themoviedb.org/t/p/original/8vEve8D0hJN6IzbiRMOUtnJokfO.jpg',
  'Pride and Prejudice - Kiêu Hãnh Và Định Kiến': 'https://media.themoviedb.org/t/p/w500/sGjIvtVvTlWnia2zfJfHz81pZ9Q.jpg',
  'The Favorite - Cuộc Đấu Yêu': 'https://tse1.explicit.bing.net/th/id/OIP.RRg5qBI0JmW6Jay2ha50NwHaJL?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Birdman - Người Chim': 'https://i.pinimg.com/736x/85/dd/a5/85dda5993e65f4bddd73cf9f28d91670.jpg',
  'The Shape of Water - Hình Dạng Của Nước': 'https://th.bing.com/th/id/R.8cb15deb725f9344fa46c68182063774?rik=aN0ehvSf%2bcs8nA&riu=http%3a%2f%2fartofthemovies.co.uk%2fcdn%2fshop%2fproducts%2fshape_of_water_intl_styleB_WC24320_B_2_framed1-739939.jpg%3fv%3d1611688511&ehk=naJ3o9UDBo8quM%2bzrPYTlsG9L%2b2MQlFMaie21cO54FU%3d&risl=&pid=ImgRaw&r=0',
  'The Nun - Ác Quỷ Ma Sơ': 'https://images.saymedia-content.com/.image/t_share/MTgwMjIxNDQyNDE0MDkzNjU2/the-nun-horror-movie-review.jpg',
  'Sinister - Điềm Báo Tử Thần': 'https://tse1.mm.bing.net/th/id/OIP.bUhbcvvCcTg0xcxCavVA_QHaK-?w=599&h=888&rs=1&pid=ImgDetMain&o=7&rm=3',
  'Halloween (2018)': 'https://tse2.mm.bing.net/th/id/OIP.u-YztmdEIENyBgpxDOjGgAHaLm?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Friday the 13th - Thứ Sáu Ngày 13': 'https://th.bing.com/th/id/R.117c907a56540157d8abcdf999712fdc?rik=tuweZvqtqvneuw&riu=http%3a%2f%2fwww.impawards.com%2f2009%2fposters%2ffriday_the_thirteenth_ver4.jpg&ehk=dUHIK4rT9MSrJ7QTlnjKzU7DyYVFakjBJfOouZBgzNA%3d&risl=&pid=ImgRaw&r=0',
  'Annabelle': 'https://tse2.mm.bing.net/th/id/OIP.9Rs4x9IDtcsCrVdQOkTJagHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Longlegs - Sát Nhân Giấu Mặt': 'https://www.goreculture.com/wp-content/uploads/2024/01/Longlegs-poster-3-scaled-1.webp',
  'The Exorcist - Quỷ Ám': 'https://tse2.mm.bing.net/th/id/OIP.7A2vPiTW_-RSC76-Si_UxAHaKl?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Beetlejuice Beetlejuice': 'https://static1.srcdn.com/wordpress/wp-content/uploads/2024/08/beetlejuice-beetlejuice-film-poster.jpg',
  'Athena': 'https://tse4.mm.bing.net/th/id/OIP.fSxjh5-6PXpO1-j-HL8eWAHaK7?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Extraction - Nhiệm Vụ Giải Cứu': 'https://tse4.mm.bing.net/th/id/OIP.xoKexe1J4RgVp9EM7mtNdgHaK9?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Leo': 'https://mir-s3-cdn-cf.behance.net/project_modules/fs/d23f41184733377.65571621a3846.jpg',
  'Godzilla x Kong: Đế Chúa Mới': 'https://tse1.explicit.bing.net/th/id/OIP.TG4jU-cnXZyUhMWgl6ROJAHaK-?rs=1&pid=ImgDetMain&o=7&rm=3',
  'Venom': 'https://tse3.mm.bing.net/th/id/OIP.9hhBN_9pGVP5fHJm5tQ0xwHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
  
  // Wikipedia URLs
  'Đi Tìm Nemo': 'https://upload.wikimedia.org/wikipedia/en/2/29/Finding_Nemo.jpg',
};

async function updatePosters() {
  console.log('📸 Updating missing movie posters...\n');

  let successCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  for (const [title, url] of Object.entries(posterMappings)) {
    try {
      const movie = await prisma.movie.findFirst({
        where: { title: title }
      });

      if (!movie) {
        console.log(`⏭️  Skipped: ${title} (not found)`);
        skippedCount++;
        continue;
      }

      await prisma.movie.update({
        where: { id: movie.id },
        data: { posterUrl: url }
      });

      successCount++;
      console.log(`✅ [${successCount}/${Object.keys(posterMappings).length}] ${title}`);
    } catch (error) {
      failedCount++;
      console.error(`❌ Failed: ${title}`, error.message);
    }
  }

  console.log(`\n🎉 Complete! Updated ${successCount} posters, ${skippedCount} skipped, ${failedCount} failed.`);
}

updatePosters()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
