import Phaser from "phaser"
/**
 * Draws an interactive button in the display
 */
class Button extends Phaser.GameObjects.Container {
  /**
   * @param {object} scene - The container Phaser.Scene
   * @param {number} x - The x position of the Button in the game world
   * @param {number} y - The y position of the Button in the game world
   * @param {function} [callback=null] - Bind a callback function to this Button
   * @param {object} [callbackScope=null] - Scope of your optional bound callback function
   * @param {number} [width=60] - Display width in pixels
   * @param {number} [height=60] - Display height in pixels
   * @param {string} [label="OK"] - Text displayed inside the Button
   * @param {number|null} [keyCode=null] - Bind a JS keyCode to this Button
   */
  constructor(
    scene,
    x, y,
    width=60,
    height=60,
    label="OK",
    keyCode=null,
    value=label,
    fill=true,
    callback=null,
    callbackScope=null,
    eventName="domlessButtonPress",
    eventArgs=[value, keyCode]
  ) {

    //group attributes
    super(scene, x, y)
    scene.sys.displayList.add(this)

    // set up domless graphics engine if it doesn't already exist
    if (!scene.domlessGraphics) {
      scene.domlessGraphics = scene.add.graphics()
    }

    this.width = width
    this.height = height
    this.keyCode = keyCode
    this.eventName = eventName
    this.eventArgs = eventArgs

    // draw the outline sprite if it doesn't exist already
    let outlineSpriteKey = `outlineSquircle${width}${height}`
    if (!scene.textures.exists(outlineSpriteKey)) {
      scene.domlessGraphics
        .clear()
        .lineStyle(1.2, 0xffffff)
        .strokeRoundedRect(2, 2, width, height, 15)
        .generateTexture(outlineSpriteKey, width + 4, height + 4)
        .clear()
    }

    // add the outlineSprite to the container
    this.outlineSprite = scene.add.sprite(0, 0, outlineSpriteKey)
    this.add(this.outlineSprite)

    // draw the fill sprite if it doesn't exist already
    if (fill) {
      let fillSpriteKey = `fillSquircle${width}${height}`
      if (!scene.textures.exists(fillSpriteKey)) {
        scene.domlessGraphics
          .clear()
          .fillStyle(0xffffff)
          .fillRoundedRect(2, 2, width, height, 15)
          .generateTexture(fillSpriteKey, width + 4, height + 4)
          .clear()
      }

      // add the fillSprite to the container
      this.fillSprite = scene.add.sprite(0, 0, fillSpriteKey)
      this.fillSprite.alpha = 0
      this.add(this.fillSprite)
    }

    //add label
    this.label = scene.add.text(0, 0, label)
    this.label.setOrigin(0.5, 0.5)
    this.label.setFontSize(this.width * this.height / 200)
    this.label.setFontFamily("Helvetica")
    this.add(this.label)

    //set up callback functionality
    if (callbackScope) {
      this.callbackScope = callbackScope
    } else {
      this.callbackScope = this
    }

    this.on("pointerdown", this.handleInput)

    if (callback) {
      this.callback = callback
    }

    this.enableInput()

  }

  enableInput(unhide=false) {
    if (unhide) {
      this.setAlpha(1)
    }

    // accept pointer input
    this.setInteractive()
      
    // accept keyboard input
    if (this.keyCode) {
      this.scene.input.keyboard.on("keydown", this.handleInput, this)
    }
  }

  disableInput(hide=false) {
    if (hide) {
      this.setAlpha(0)
    }

    // stop accepting pointer input
    this.disableInteractive()
      
    // stop accepting keyboard input
    if (this.keyCode) {
      this.scene.input.keyboard.removeListener("keydown", this.handleInput, this)
    }
  }

  handleInput(event) {
    if (event.type === "keydown" && event.keyCode !== this.keyCode) {
      return
    }
    if (this.callback) {
      this.callback.call(this.callbackScope)
    }
    if (this.eventName) {
      this.scene.events.emit(this.eventName, ...this.eventArgs)
    }
    this.fill.call(this)
  }

  fill() {
    //flash the fill sprite with a quick yoyo tween
    if (this.fillSprite) {
      this.scene.tweens.killTweensOf(this.fillSprite)
      this.fillSprite.alpha = 0
      this.fillTween = this.scene.add.tween({
        targets: [this.fillSprite],
        ease: "Linear",
        duration: 100,
        delay: 0,
        alpha: 1,
        yoyo: true,
      })
    }
  }

}

export default Button
