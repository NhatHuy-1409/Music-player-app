/**
 * 1.Render songs
 * 2.Scroll top
 * 3.Play / pause / seek
 * 4.CD rotate
 * 5.Next and prev
 * 6.Random
 * 7.Next / repeat when ended
 * 8.Active song
 * 9.Scroll active song into view
 * 10.Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Lưu số em đi",
            singer: "Jacksan x Vũ Phụng Tiên",
            path: "https://tainhacmienphi.biz/get/song/api/350098",
            image: "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/7/9/7/f/797fe66f5ed44a33e2ceca3fb63464c8.jpg"
        },
        {
            name: "Nơi này có anh",
            singer: "MTP",
            path: "https://tainhacmienphi.biz/get/song/api/171931",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Đế Vương",
            singer: "N Huy",
            path:
                "https://tainhac123.com/listen/de-vuong-dinh-dung-ft-acv.w8lmuII1Yn2G.html",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Muộn màng là từ lúc",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "https://tainhacmienphi.biz/get/song/api/19924",
            image:
                "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "3 1 0 7 - 2",
            singer: "Raftaar",
            path: "https://aredir.nixcdn.com/NhacCuaTui1011/31072-DuonggNauWn-6937818.mp3?st=KeJBltpHPWVlAC5F_XsJmA&e=1644649104",
            image:
                "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
                "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
            image:
                "https://image.thanhnien.vn/w1024/Uploaded/2022/zxaijr/2022_02_07/jisookhonghatnhacphimsnowdrop2-4063.png"
        }

    ],
    renderSongs: function () {
        let content = "";
        this.songs.map((song, index) => {
            content += `
                <div class="song ${index === this.currentIndex ? "active" : ""}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        $(".playlist").innerHTML = content;

    },
    //Định nghĩa các thuộc tính của app t
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    //Xử lí tất cả sự kiện trong app
    handleEvents: function () {
        //Xử lí đĩa quay
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity,
        });
        cdThumbAnimate.pause();
        console.log(cdThumbAnimate)
        //Event scroll
        const cdWidth = cd.offsetWidth;
        document.onscroll = () => {
            const newCdWidth = cdWidth - window.scrollY;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        //Click play
        playBtn.addEventListener("click", () => {
            if (this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        });
        //Khi song được play
        audio.onplay = () => {
            player.classList.add("playing");
            this.isPlaying = true;
            cdThumbAnimate.play();
        }
        //Khi song bị pause
        audio.onpause = () => {
            player.classList.remove("playing");
            this.isPlaying = false;
            cdThumbAnimate.pause();

        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPercent = audio.currentTime * 100 / audio.duration;
                progress.value = progressPercent;
            }
        }
        //Khi user tua audio
        progress.onchange = (e) => {
            audio.currentTime = audio.duration * e.target.value / 100;
        }
        //Khi click next
        nextBtn.onclick = () => {
            if (this.isRandom) {
                this.randomSong();
            } else {
                this.nextSong();
            }
            audio.play();
            this.renderSongs();
            this.scrollToActiveSong();
        }
        //Khi click prev
        prevBtn.onclick = () => {
            if (this.isRandom) {
                this.randomSong();
            } else {
                this.prevSong();
            }
            audio.play();
            this.renderSongs();
            this.scrollToActiveSong();
        }
        //Khi click chế độ random
        randomBtn.onclick = () => {
            this.isRandom = !this.isRandom;
            randomBtn.classList.toggle("active", this.isRandom);
        }

        //Xử lý nextsong khi audio ended
        audio.onended = () => {
            if (this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        //Khi click chế độ repeat
        repeatBtn.onclick = () => {
            this.isRepeat = !this.isRepeat;
            repeatBtn.classList.toggle("active", this.isRepeat);
            console.log(this.isRepeat);
        }

    },
    loadCurrentSong: function () {
        audio.src = this.currentSong.path;
        heading.innerHTML = this.currentSong.name;
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        audio.play();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        audio.play();
    },
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        audio.play();
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior:"smooth",
                block: "nearest",
            })
         },300)
    },
    start: function () {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();
        this.handleEvents();
        this.renderSongs();
        this.loadCurrentSong();
    }
}
app.start();
