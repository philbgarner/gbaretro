var images = [
    { name: 'pointer', image: null, filename: './images/pointer.png' },
]

function getImage(name) {
    let img = images.filter(f => f.name === name)
    return img.length > 0 ? img[0].image : null
}

function drawImage(name, x, y, srcRect) {
    let img = images.filter(f => f.name === name)
    if (img.length > 0) {
        if (srcRect) {
            ctx.drawImage(img[0].image, srcRect.x, srcRect.y, srcRect.w, srcRect.h, x, y, srcRect.w, srcRect.h)
        } else {
            ctx.drawImage(img[0].image, x, y)
        }
    }
}

function loadImage(filename) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = (e) => {
            resolve(img)
        }
        img.onerror = (e) => {
            console.error(`Failed to load file ${filename}:`, e)
            reject(null)
        }
        let image = images.filter(f => f.filename === filename)
        if (image.length > 0) {
            img.src = filename
        } else {
            console.error(`Image definition matching filename ${filename} not found.`)
            reject(null)
        }
    })
}

function loadAllImages() {
    let promises = []
    for (let i in images) {
        let image = images[i]
        promises.push(new Promise((resolve, reject) => loadImage(image.filename).then(r => {
            image.image = r
            resolve(r)
        }).catch(e => console.error('Failed to load', image.filename, e))))
    }
    return Promise.allSettled(promises)
}