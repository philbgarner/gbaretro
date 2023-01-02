var tracks = [
    // { name: 'battle_theme', track: null, filename: './music/BattleTheme.ogg' },
]

var musicVolume = 0.15

function setMusicVolume(v) {
    v = v < 0 ? 0 : v
    v = v > 1 ? 1 : v
    for (let t in tracks) {
        tracks[t].track.volume = v
    }
}

function getTrack(name) {
    let img = tracks.filter(f => f.name === name)
    return img.length > 0 ? img[0].track : null
}

function playTrack(name) {
    let sf = tracks.filter(f => f.name === name)
    if (sf.length > 0) {
        sf[0].track.volume = musicVolume
        sf[0].track.play()
    }
}

function isTrackPlaying(name) {
    let sf = tracks.filter(f => f.name === name)
    if (sf.length > 0) {
        return !sf[0].track.paused
    }
}

function loadTrack(filename) {
    return new Promise((resolve, reject) => {
        let sf = new Audio(filename)
        sf.oncanplaythrough = (e) => {
            sf.loop = true
            resolve(sf)
        }
        sf.onerror = (e) => {
            console.error(`Failed to load file ${filename}:`, e)
            reject(null)
        }
    })
}

function loadMusic() {
    let promises = []
    for (let i in tracks) {
        let track = tracks[i]
        promises.push(new Promise((resolve, reject) => loadTrack(track.filename).then(r => {
            console.log(r)
            track.track = r
            resolve(r)
        }).catch(e => console.error('Failed to load', track.filename, e))))
    }
    return Promise.allSettled(promises)
}