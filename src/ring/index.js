const Ring = {
    end: null,
    start: null,
}
let audio = null
let loop = null

Ring.start = idTag => {
    audio = document.getElementById(idTag)
    audio.play()
    loop = setInterval(() => audio.play(), 2000)
}

Ring.end = idTag => {
    audio = document.getElementById(idTag)
    clearInterval(loop)
    audio.pause()
    audio.addEventListener('pause', function() {
        this.currentTime = 0
    })
}

module.exports = { Ring }