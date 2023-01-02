var animations = {
}

function removeSprite(name) {
    let index = sprites.findIndex(f => f.name === name)
    if (index >= 0) {
        sprites[index] = undefined
    }
    sprites = sprites.filter(f => f !== undefined)
}

function getMsSinceMidnight(d) {
    var e = new Date(d);
    return d - e.setHours(0,0,0,0);
  }

function buildSprite(name, x, y, animation) {
    if (!animations[animation]) {
        throw new Error(`Can't build sprite ${name}, missing animation '${animation}'.`)
    }
    let sprite = {
        name: name,
        x: x, y: y,
        frames: [],
        frameDelay: 100,
        framesImage: null,
        currentFrame: 0,
        updateDelta: 0,
        play: true
    }
    sprite.SetAnimation = (animation, pose) => {
        sprite.animStartTime = getMsSinceMidnight(new Date())
        let anim = animations[animation]
        if (anim) {
            let sprPose = anim.default ? anim.default : null
            sprPose = anim[pose] ? anim[pose] : sprPose
            if (sprPose) {
                let img = images.filter(f => f.name === sprPose.imageName)
                if (img.length > 0) {
                    sprite.frames = sprPose.frames
                    sprite.currentFrame = 0
                    sprite.animation = animation
                    sprite.pose = pose
                    sprite.frameDelay = anim.frameDelay
                    sprite.framesImage = sprPose.imageName
                    if (sprPose.sfx) {
                        let sfx = getSfx(sprPose.sfx)
                        console.log('getSfx', sfx)
                        if (sfx) {
                            sfx.play()
                        }
                    }
                } else {
                    throw new Error(`Can't find image ${sprPose.imageName} in ${animation}.`)
                }
            } else {
                sprite.frames = []
                sprite.currentFrame = 0
                sprite.animation = ''
                sprite.pose = ''
                sprite.frameDelay = anim.frameDelay
            }
        }
    }
    sprite.draw = (offsetx, offsety) => {
        offsetx = offsetx ? offsetx : 0
        offsety = offsety ? offsety : 0
        drawImage(sprite.framesImage, sprite.x + offsetx, sprite.y + offsety, sprite.frames[sprite.currentFrame])
    }
    sprite.moveTo = async (x, y, speed) => {
        let ox = sprite.x
        let oy = sprite.y
        let move = (x, y) => new Promise((resolve, reject) => {
            let t = 0
            let handler = () => {
                t += speed
                if (t >= 1) {
                    sprite.x = x
                    sprite.y = y
                    resolve()
                } else {
                    let p = lerp({ x: ox, y: oy }, { x: x, y: y }, t)
                    sprite.x = p.x
                    sprite.y = p.y
                    setTimeout(handler, delta)
                }
            }
            setTimeout(handler, delta)
        })

        await move(x, y)
        
    }
    sprite.onComplete = () => {}
    sprite.update = (delta) => {
        if (sprite.updateDelta > sprite.frameDelay) {
            let sprPose = animations[sprite.animation][sprite.pose]
            if (sprPose && sprite.play) {
                sprite.currentFrame++
                if (sprite.currentFrame > sprite.frames.length - 1) {
                    if (sprPose.repeat) {
                        sprite.currentFrame = 0
                        sprite.animDuration = getMsSinceMidnight(new Date()) - sprite.animStartTime
                    } else {
                        sprite.animDuration = getMsSinceMidnight(new Date()) - sprite.animStartTime
                        //console.log(sprite.name, 'anim duration =', sprite.animDuration)
                        sprite.currentFrame--
                        sprite.play = false
                        sprite.onComplete()
                    }
                }
            }
            sprite.updateDelta = 0
        } else {
            sprite.updateDelta += delta
        }
    }
    sprite.SetAnimation(animation, 'idle')

    return sprite
}