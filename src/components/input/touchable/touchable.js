/**
 * Creates a touchable object in the display
 */
export class Touchable extends Phaser.Group {
  /**
   * @param {object} app - The container Domless app
   * @param {object} [parent=null] - Parent Group of this Touchable
   * @param {function} [callback=null] - Callback function called after this object is touched
   * @param {object} [callbackContext=null] - Context of your optional bound callback function
   * @param {number} [width=60] - Display width in pixels
   * @param {number} [height=60] - Display height in pixels
   * @param {string} [bodyKey="defaultTouchableBody"] - Key of a registered body Sprite
   */
  constructor(app, parent=app.world, callback=null, callbackContext=null,
    width=60, height=60, bodyKey="defaultTouchableBody") {

    // pass Group attributes to Phaser.Group class
    super(app, parent);

    // define custom Touchable objects and Group behavior
    this.tweens = new Phaser.TweenManager(app);
    this.submitSignal = new Phaser.Signal();
    app.input.onDown.add(this.handlePointerInput, this);

    // add body sprite
    this.bodySprite = new Phaser.Sprite(app, 0, 0, bodyKey);
    this.bodySprite.width = width;
    this.bodySprite.height = height;
    this.addChild(this.bodySprite);

    // set up callback
    if (callbackContext) {
      this.callbackContext = callbackContext;
    } else {
      this.callbackContext = this;
    }

    if(callback) {
      this.callback = callback;
    } else {
      this.callback = function() {
        console.log("Touchable Touched!");
      };
      console.warn("Created a Domless Touchable with no callback specified");
    }
  }

  /**
   * @param {object} thisPointer - The Phaser.Pointer object that touched me
   */
  handlePointerInput(thisPointer) {
    let inXBounds= (
      thisPointer.x >= this.worldPosition.x &&
      thisPointer.x <= this.worldPosition.x + this.width);
    let inYBounds = (
      thisPointer.y >= this.worldPosition.y &&
      thisPointer.y <= this.worldPosition.y + this.height);
    if (inXBounds && inYBounds) {
      if (this.callback) {
        this.callback.call(this.callbackContext);
      }
      // this.fill.call(this);
    }
  }

}

export default Touchable;
