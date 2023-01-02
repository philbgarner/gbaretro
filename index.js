function delay(miliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, miliseconds)
    })
}

function drawFrame(timestamp) {
    if (document.hidden) {
        return
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    imu.Draw()

    let pointerImage = 'pointer'
    drawImage(pointerImage, pointer.x, pointer.y)
}

var canvas
var ctx
var ratio
var delta = 16
var imu = null
var pointer = { x: 0, y: 0 }

async function Start() {
    canvas = document.getElementById('maincanvas')
    ctx = canvas.getContext('2d')
    bfontjs.LoadDefaultFonts()

    await loadAllImages()
    await loadAllSfx()
    await loadMusic()

    ratio = canvas.width / canvas.height
    canvas.style.height = window.innerHeight + 'px'
    canvas.style.width = window.innerHeight * ratio + 'px'
    window.addEventListener('resize', () => {
        canvas.style.height = window.innerHeight + 'px'
        canvas.style.width = window.innerHeight * ratio + 'px'
      })

    canvas.addEventListener('mousemove', (e) => {
        pointer.x = parseInt((e.clientX - canvas.offsetLeft) * (canvas.width / parseInt(canvas.style.width))) - 2
        pointer.y = parseInt((e.clientY - canvas.offsetTop) * (canvas.height / parseInt(canvas.style.height)))
    })

    canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        return false
    })

    StartIndex()
}

async function StartIndex() {
    return new Promise((resolve, reject) => {
        canvas = document.getElementById('maincanvas')
        ctx = canvas.getContext('2d')
    
        indexUpdating = true
        
        if (imu === null) {
            imu = new imui.ImUI(canvas)
            imu.font = font
        } else {
            imu.Enable()
        }
    
        imu.onUpdate = async (ui) => {
            ui.Element({ id: 'test', text: 'text', x: 25, y: 25 })
        }

        function IndexUpdate() {
            if (indexUpdating) {
                window.requestAnimationFrame(drawFrame)
                setTimeout(() => IndexUpdate(), delta)
            }
        }
        IndexUpdate()
    })
}