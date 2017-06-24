/**
 * Draws an interactive button in the display
 */
export class Button extends Phaser.Group {
  /**
   * @param {object} app - The container App
   * @param {object} [parentGroup=null] - Parent Group of this Button
   * @param {function} [callback=null] - Bind a callback function to this Button
   * @param {object} [callbackContext=null] - Context of your optional bound callback function
   * @param {number} [width=60] - Display width in pixels
   * @param {number} [height=60] - Display height in pixels
   * @param {string} [label="OK"] - Text displayed inside the Button
   * @param {number|null} [keyCode=null] - Bind a JS keyCode to this Button
   * @param {string} [outlineKey="squircle"] - Name of a registered outline Sprite
   * @param {string} [fillKey="squircle_fill"] - Name of a registered fill Sprite
   * @param {string} [labelFont="proxima_nova"] - Name of a registered Bitmap Font
   */
  constructor(app, parentGroup=null, callback=null, callbackContext=null,
    width=60, height=60, label="OK", keyCode=null,
    outlineKey="squircle", fillKey="squircle_fill", labelFont="proxima_nova") {

    //group attributes
    super(app, parentGroup);

    this.keyCode = keyCode;
    this.tweens = new Phaser.TweenManager(app);
    this.submitSignal = new Phaser.Signal();

    //add outline sprite
    this.outlineSprite = new Phaser.Sprite(this.app, 0, 0, outlineKey);
    this.outlineSprite.width = width;
    this.outlineSprite.height = height;
    this.addChild(this.outlineSprite);

    //add fill sprite
    this.fillSprite = new Phaser.Sprite(this.app, 0, 0, fillKey);
    this.fillSprite.width = width;
    this.fillSprite.height = height;
    this.fillSprite.alpha = 0;
    this.addChild(this.fillSprite);

    //add label
    if (label instanceof Phaser.Sprite) {
      this.label = label;
    } else if (typeof(label) === "string") {
      this.label = new Phaser.BitmapText(this.app,
        this.outlineSprite.width / 2, this.outlineSprite.height / 2,
        labelFont, label, width / (label.length + 1));
      this.label.anchor.setTo(0.5, 0.5);
    } else {
      throw("Domless Button label must be of type String or type Phaser.Sprite");
    }
    this.addChild(this.label);

    //set up callback functionality
    if (callbackContext) {
      this.callbackContext = callbackContext;
    } else {
      this.callbackContext = this;
    }

    if (callback) {
      this.callback = callback;
    } else {
      console.warn("Created a Domless Button with no callback specified");
    }

    this.app.input.onDown.add(this.handlePointerInput, this);

    if (keyCode) {
      this.inputKey = this.app.input.keyboard.addKey(this.keyCode);
      if (this.callback) {
        this.inputKey.onDown.add(this.callback, this.callbackContext);
      }
      this.inputKey.onDown.add(this.fill, this);
    }
  }

  handlePointerOutput(thisPointer) {
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
      this.fill.call(this);
    }
  }

  fill() {
    //flash the fill sprite with a quick yoyo tween
    if (this.fillSprite) {
      this.fillSprite.alpha = 0;
      this.fillTween = this.app.add.tween(this.fillSprite)
        .to({alpha: 1.0}, 100, "Linear", true, 0, 0, true);
      this.tweens.add(this.fillTween);
    }
  }

  destroy() {
    this.app.input.keyboard.removeKey(this.keyCode);
    super.destroy();
  }

}
