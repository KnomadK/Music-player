//Bind
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
//Stored
const PLAYER_STORAGE_KEY = 'KV-MUSIC-PLAYER'

// Bien
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progressBar = $('.progress-bar')
const cdThumb = $('.cd-thumb')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const timeCurrent = $(".current-time")
const timeDuration = $(".duration-time")
const volumeBar = $(".volume-input")
const volumeOn = $(".volume-on")
const volumeMute = $(".volume-mute")

//View 
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Trái Tim Bên Lề',
            singer: 'Bằng Kiều',
            path: './assets/music/Trai-Tim-Ben-Le-Bang-Kieu.mp3',
            image: './assets/img/bang_kieu.jpg'
        },
        {
            name: 'Cơn Mơ Băng Giá',
            singer: 'Bằng Kiều',
            path: './assets/music/Con-Mo-Bang-Gia-Bang-Kieu.mp3',
            image: './assets/img/bang_kieu.jpg'
        },
        {
            name: 'Cho Em Và Cũng Là Cho Anh',
            singer: 'Hà Anh Tuấn ',
            path: './assets/music/Cho-Em-Va-Cung-La-Cho-Anh-Ha-Anh-Tuan-Ngoc-Anh.mp3',
            image: './assets/img/ha-anh-tuan.jpg'
        },
        {
            name: 'Đừng Hút Thuốc',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/Dung-Hut-Thuoc-Ha-Anh-Tuan.mp3',
            image: './assets/img/ha-anh-tuan.jpg'
        },
        {
            name: 'Em Của Ngày Hôm Qua',
            singer: 'Sếp',
            path: './assets/music/Em-Cua-Ngay-Hom-Qua-Ho-Quang-Version-Ngo-Duy-Khiem.mp3',
            image: './assets/img/Son_Tung_M-TP_1_(2017).png'
        },
        {
            name: 'Người Con Gái Ta Thương',
            singer: 'Hà Anh Tuấn',
            path: './assets/music/Nguoi-Con-Gai-Ta-Thuong-Ha-Anh-Tuan.mp3',
            image: './assets/img/ha-anh-tuan.jpg'
        },
        {
            name: 'Nỗi Đau Xót Xa',
            singer: 'Khánh Phương',
            path: './assets/music/Noi-Dau-Xot-Xa-Khanh-Phuong.mp3',
            image: './assets/img/khanh-phuong-quynh-nga-van-tre-trung-xinh-xan-khong-khac-xua-la-may-1.jpg'
        },
        {
            name: 'Nối Vòng Tay Lớn',
            singer: 'Khánh Phương',
            path: './assets/music/Noi-Vong-Tay-Lon-Remix-Khanh-Phuong.mp3',
            image: './assets/img/khanh-phuong-quynh-nga-van-tre-trung-xinh-xan-khong-khac-xua-la-may-1.jpg'
        },
        {
            name: 'Nước Mắt Nàng Kiều',
            singer: 'Khánh Phương',
            path: './assets/music/Nuoc-Mat-Nang-Kieu-Khanh-Phuong.mp3',
            image: './assets/img/khanh-phuong-quynh-nga-van-tre-trung-xinh-xan-khong-khac-xua-la-may-1.jpg'
        },
        {
            name: 'Xin Em Đừng Khóc',
            singer: 'Khánh Phương',
            path: './assets/music/Xin-Em-Dung-Khoc-Khanh-Phuong.mp3',
            image: './assets/img/khanh-phuong-quynh-nga-van-tre-trung-xinh-xan-khong-khac-xua-la-may-1.jpg'
        }
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div  class="thumb"
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
        })
        playlist.innerHTML = htmls.join('')
    },
    //
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function () {
        const _this = this
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
        //Zoom Cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        // xu ly cd quay 
        const cdThumbRotate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbRotate.pause()
        //Song Button
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }

            audio.play()
            _this.render()
            _this.srcollToActive()
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }

            audio.play()
            _this.render()
            _this.srcollToActive()
        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // xu ly button song
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbRotate.play()

        }
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbRotate.pause()
        }
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // song active when click 
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    _this.srcollToActive()
                    audio.play()
                }
                if (e.target.closest('.option')) {

                }
            }
        }
        // tien do bai hat thay doi 
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progressBar.value = progressPercent
            }
            // seeking song
            progressBar.oninput = function (e) {
                const seekTime = (audio.duration / 100) * e.target.value
                audio.currentTime = seekTime
            }
            // Hien thi thoi gian hien tai cua bai hat 
            let currentMinutes = Math.floor(audio.currentTime / 60)
            let currentSeconds = Math.floor(audio.currentTime % 60)
            if (currentMinutes < 10) {
                currentMinutes = `0${currentMinutes}`
            }
            if (currentSeconds < 10) {
                currentSeconds = `0${currentSeconds}`
            }
            timeCurrent.textContent = `${currentMinutes}:${currentSeconds}`
        }
        audio.onloadedmetadata = () => {
            let durationMinutes = Math.floor(audio.duration / 60)
            let durationSeconds = Math.floor(audio.duration % 60)
            if (durationMinutes < 10) {
                durationMinutes = `0${durationMinutes}`
            }
            if (durationSeconds < 10) {
                durationSeconds = `0${durationSeconds}`
            }
            timeDuration.textContent = `${durationMinutes}:${durationSeconds}`
        }
        // Chinh am luong button volume 
        volumeBar.oninput = (e) => {
            audio.volume = e.target.value / 100
            if (audio.volume === 0) {
                volumeMute.classList.remove("hide")
                volumeOn.classList.add("hide")
            } else {
                volumeMute.classList.add("hide")
                volumeOn.classList.remove("hide")
            }
        }
        // Xu ly bat/tat volume 
        volumeOn.onclick = () => {
            volumeOn.classList.add("hide")
            volumeMute.classList.remove("hide")
            audio.volume = 0
            volumeBar.value = 0
        }
        volumeMute.onclick = () => {
            volumeMute.classList.add("hide")
            volumeOn.classList.remove("hide")
            audio.volume = 1
            volumeBar.value = 100
        }

    },
    loadCurrentSong: function () {
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    srcollToActive: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },
    start: function () {
        this.defineProperties()
        this.handleEvent()
        this.loadCurrentSong()
        this.render()
    }
}
app.start()
