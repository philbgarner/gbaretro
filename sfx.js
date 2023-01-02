var sfxs = [
]

var sfxVolume = 0.4

function getSfx(name) {
    let img = sfxs.filter(f => f.name === name)
    return img.length > 0 ? img[0].sfx : null
}

function playSfx(name) {
    let sf = sfxs.filter(f => f.name === name)
    if (sf.length > 0) {
        sf[0].track.volume = musicVolume
        sf[0].sfx.play()
    }
}

function loadSfx(filename) {
    return new Promise((resolve, reject) => {
        let sf = new Audio(filename)
        sf.oncanplaythrough = (e) => {
            resolve(sf)
        }
        sf.onerror = (e) => {
            console.error(`Failed to load file ${filename}:`, e)
            reject(null)
        }
    })
}

function loadAllSfx() {
    let promises = []
    for (let i in sfxs) {
        let sfx = sfxs[i]
        promises.push(new Promise((resolve, reject) => loadSfx(sfx.filename).then(r => {
            console.log(r)
            sfx.sfx = r
            resolve(r)
        }).catch(e => console.error('Failed to load', sfx.filename, e))))
    }
    return Promise.allSettled(promises)
}