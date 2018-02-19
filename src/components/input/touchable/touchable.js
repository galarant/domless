/**
 * Creates a touchable object in the display
 */
export class Touchable extends Phaser.Group {
  /**
   * Constructor for the class
   *
   * @param {object} app - The container Domless app
   * @param {object} [parent=null] - Parent Group of this Touchable
   * @param {number} [width=60] - Display width in pixels
   * @param {number} [height=60] - Display height in pixels
   * @param {string} [bodyKey="defaultTouchableBody"] - Key of a registered body Sprite
   * @param {string} [fillKey="defaultTouchablefill"] - Key of a registered body Sprite
   */
  constructor(app, parent=app.world, width=60, height=60,
    bodyKey="defaultTouchableBody", fillKey="defaultTouchableFill") {

    // pass Group attributes to Phaser.Group class
    super(app, parent)

    // define custom Touchable objects and Group behavior
    this.runFlashFill = true
    this.submitSignal = new Phaser.Signal()
    this.callback = null
    this.callbackContext = this
    app.input.onDown.add(this.handlePointerInput, this)

    // add body sprite
    this.bodySprite = new Phaser.Sprite(app, 0, 0, bodyKey)
    this.bodySprite.width = width
    this.bodySprite.height = height
    this.addChild(this.bodySprite)

    // add fill sprite
    this.fillSprite = new Phaser.Sprite(app, 0, 0, fillKey)
    this.fillSprite.width = width
    this.fillSprite.height = height
    this.fillSprite.alpha = 0
    this.addChild(this.fillSprite)
  }

  /**
   * Flash the fill sprite with a quick yoyo tween
   */
  flashFill() {
    if (this.fillSprite) {
      this.fillSprite.alpha = 0
      this.game.add.tween(this.fillSprite)
        .to({alpha: 1}, 100, Phaser.Easing.Default, true, 0, 0, true)
    }
  }

  /**
   * Handles Pointer input occurring within the object boundaries
   *
   * @param {object} thisPointer - The Phaser.Pointer object that touched me
   */
  handlePointerInput(thisPointer) {
    let inXBounds= (
      thisPointer.x >= this.worldPosition.x &&
      thisPointer.x <= this.worldPosition.x + this.width)
    let inYBounds = (
      thisPointer.y >= this.worldPosition.y &&
      thisPointer.y <= this.worldPosition.y + this.height)
    if (inXBounds && inYBounds) {
      if (this.callback) {
        this.callback.call(this.callbackContext)
      }
      if (this.runFlashFill) {
        this.flashFill.call(this)
      }
    }
  }

}

export default Touchable
