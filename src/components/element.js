import Phaser from "phaser"

/**
 * Base class for a domless element
 * Most display elements except modals should ultimately inherit from this class
 */
class Element extends Phaser.GameObjects.Container {
  /**
   * @param {object} scene - The container Phaser.Scene
   * @param {number} x - The x position of the Element in the game world
   * @param {number} y - The y position of the Element in the game world
   */
  constructor(scene,
    { 
      x, y,
      width=60,
      height=60,
      outline=true,
      fill=false,
      arcRadius=15,
    } = {}
  ) {

    super(scene, x, y)
    scene.sys.displayList.add(this)

    // set up domless graphics engine in the scene if it doesn't already exist
    if (!scene.domlessGraphics) {
      scene.domlessGraphics = scene.add.graphics()
    }

    this.id = "_" + Math.random().toString(36).substr(2, 9) + "_"
    this.width = width
    this.height = height
    this.arcRadius = arcRadius

    // add the outline sprite if needed
    if (outline) {
      this.generateOutline()
    }

    // add the fill sprite if needed
    if (fill) {
      this.generateFill()
    }

    // all elements start out inactive on initialization
    this.setActive(false)

  }

  // provides common activation behavior for all elements
  activate(force=false) {
    if (!this.active || force) {

      // show the element
      this.setAlpha(1)

      // activate within Phaser
      this.setActive(true)

      // accept pointer input
      this.setInteractive()

      // accept keyboard input
      if (this.key && this.handleKeyboardInput) {
        this.key.on("down", this.handleKeyboardInput, this)
      }
    }
  }

  // provides common deactivation behavior for all elements
  deactivate(hide=false, disableInteractive=true, force=false) {
    if (this.active || force) {
      // hide the element if desired
      if (hide) {
        this.setAlpha(0)
      }

      // deactivate within Phaser
      this.setActive(false)

      // disable pointer input
      if (disableInteractive) {
        this.disableInteractive()
      }

      // disable keyboard input
      if (this.key && this.handleKeyboardInput) {
        this.key.removeListener("down", this.handleKeyboardInput, this)
      }

    }
  }

  /**
   * generate an outline
   * destroy and replace the current outline if it exists
   */
  generateOutline() {
    if (this.outline) {
      this.outline.destroy()
    }
    let outlineKey = `outlineSquircle${this.width}${this.height}`

    // draw the outline texture if it doesn't exist already
    if (!this.scene.textures.exists(outlineKey)) {
      this.scene.domlessGraphics
        .clear()
        .lineStyle(1.2, 0xffffff)
        .strokeRoundedRect(2, 2, this.width, this.height, this.arcRadius)
        .generateTexture(outlineKey, this.width + 4, this.height + 4)
        .clear()
    }

    // add the outline sprite to the container
    this.outline = this.scene.add.sprite(0, 0, outlineKey)
    this.add(this.outline)
  }

  /**
   * generate a fill
   * destroy and replace the current fill if it exists
   */
  generateFill() {
    if (this.fill) {
      this.fill.destroy()
    }
    let fillKey = `fillSquircle${this.width}${this.height}`
    
    // draw the fill texture if it doesn't exist already
    if (!this.scene.textures.exists(fillKey)) {
      this.scene.domlessGraphics
        .clear()
        .fillStyle(0xffffff)
        .fillRoundedRect(2, 2, this.width, this.height, this.arcRadius)
        .generateTexture(fillKey, this.width + 4, this.height + 4)
        .clear()
    }

    // add the fill sprite to the container
    this.fill = this.scene.add.sprite(0, 0, fillKey)
    this.add(this.fill)

    // set the fill invisible if we are flashing it
    if (this.flashFill) {
      this.fill.setAlpha(0)
    }
  }

  /**
   * Runs an animation to stretch the outline.
   * Element itself will be resized after the animation finishes
   * dimensions = {x: targetWidth, y: targetHeight}
   * Animation is targeted to 15 frames at Phaser's max framerate (60?)
   */
  stretch({targetWidth=this.width, targetHeight=this.height}) {
    // exit out if this Element doesn't have an outline
    if (!this.outline) {
      console.warn("Cannot stretch Element with no outline.")
      return
    }

    // also exit if target width and height are the same
    if (targetWidth == this.width && targetHeight == this.height) {
      console.warn("Cannot stretch Element to same width and height.")
      return
    }

    let animKey = `${this.id}stretchAnimX${targetWidth}Y${targetHeight}`

    let anim = this.scene.anims.get(animKey)
    if (!anim) {
      anim = this.generateStretchAnim({targetWidth: targetWidth, targetHeight: targetHeight})
    }

    // register a callback for when the animation is complete
    // refresh Element size and hit area, regenerate outline and fill sprite
    this.outline.once(
      "animationcomplete",
      function(animation) {
        if (animation.key === animKey) {
          this.setSize(targetWidth, targetHeight)
          this.input.hitArea.setSize(targetWidth, targetHeight)
          this.generateOutline()
          if (this.fill) {
            this.generateFill()
          }
        }
      },
      this
    )

    console.log(anim)

    // play the animation
    this.outline.play(animKey, true)

  }

  /**
   * Generate the animation for a stretch operation
   * This may be costly, so it pays to run this ahead of time
   * If you know you may want to stretch an Element
  */
  generateStretchAnim({targetWidth=this.width, targetHeight=this.height}) {

    // exit out if this Element doesn't have an outline
    if (!this.outline) {
      console.warn("Cannot stretch Element with no outline.")
      return
    }

    let animKey = `${this.id}stretchAnimX${targetWidth}Y${targetHeight}`

    // init vars for animation
    let
      graphics = this.scene.domlessGraphics,
      frameTotal = 15,
      frameSpacing = 3,
      x = 0,
      y = 0,
      width = this.width,
      height = this.height,
      widthInc = (targetWidth - width) / frameTotal,
      heightInc = (targetHeight - height) / frameTotal,
      maxHeight = height,
      animTextureCount = 0,
      animTextureKey = `${this.id}stretchAnimTexture${animTextureCount}`,
      frameNumber = 0


    for (let frameCounter = 0; frameCounter < frameTotal; frameCounter++) {

      // if we reached the max height of the canvas, start a new texture
      if (y + height >= this.scene.game.config.height) {
        y = 0
        animTextureCount += 1
        frameNumber = 0
      }

      // draw the graphic then flush it to the current texture
      animTextureKey = `${this.id}stretchAnimTexture${animTextureCount}`
      graphics
        .clear()
        .lineStyle(1.2, 0xffffff)
        .strokeRoundedRect(x + 1, y + 1, Math.max(width), Math.max(height))
        .generateTexture(animTextureKey)
        .clear()

      // add a frame for the new graphic we just added
      this.scene.textures.get(animTextureKey).add(frameNumber, 0, x, y, width + 2, height + 2)

      // increment x, width and height
      x += width + frameSpacing
      width += widthInc
      height += heightInc

      // if we reached the max width of the canvas, start a new row
      if (x + width >= this.scene.game.config.width) {
        x = 0
        y += maxHeight + frameSpacing
      }

      // keep track of maxHeight and frameNumber
      if (height > maxHeight) {
        maxHeight = height
      }
      frameNumber += 1
    }

    // create the animation object
    let anim = this.scene.anims.create({
      key: animKey,
      frameRate: 60
    })

    // add frames to the animation
    for (let textureCounter = 0; textureCounter <= animTextureCount; textureCounter += 1) {
      let animTexture = this.scene.textures.get(`${this.id}stretchAnimTexture${textureCounter}`)
      anim.addFrame(this.scene.anims.generateFrameNumbers(animTexture.key, animTexture.getFrameNames()))
    }

    return anim

  }

}

export default Element
