import Phaser from "phaser"
import Button from "../input/button"
import Element from "../element"
/**
 * Draws an interactive button in the display
 */
class TextDisplay extends Element {
  /**
   * @param {object} scene - The container Phaser.Scene
   * @param {number} x - The x position of the TextDisplay in the game world
   * @param {number} y - The y position of the TextDisplay in the game world
   * @param {number} [width=200] - Display width in pixels
   * @param {number} [height=400] - Display height in pixels
   * @param {string} [content=""] - The text displayed
   */
  constructor(
    scene,
    {
      x, y,
      width=400, height=200,
      initialText="",
      fontSize=24, fontFamily="Helvetica",
      outline=true
    }
  ) {

    // set up basic attributes
    super(scene, x, y)
    scene.sys.displayList.add(this)

    this.width = width
    this.height = height
    this.initialText = initialText
    this.defaultStyles = {
      fontSize: fontSize,
      fontFamily: fontFamily,
      align: "left",
      padding: {top: 10, left: 10, right: 10, bottom: 10},
      wordWrap: {width: this.width}
    }

    if (!this.scene.domlessGraphics) {
      this.scene.domlessGraphics = this.scene.add.graphics()
    }

    // calc height of one text row
    let testlineHeight = this.scene.add.text(0, 0, "foobar", this.defaultStyles)
    this.lineHeight = testlineHeight.height
    testlineHeight.destroy()

    // set up outline sprite if we need one
    if (outline) {
      // draw the outline sprite if it doesn't exist already
      let outlineSpriteKey = `outlineSquircle${width}${height}`
      if (!this.scene.textures.exists(outlineSpriteKey)) {
        this.scene.domlessGraphics
          .clear()
          .lineStyle(1.2, 0xffffff)
          .strokeRoundedRect(2, 2, width, height, 15)
          .generateTexture(outlineSpriteKey, width + 4, height + 4)
          .clear()
      }
      // add the outlineSprite to the container
      this.outlineSprite = this.scene.add.sprite(0, 0, outlineSpriteKey)
      this.add(this.outlineSprite)
    }

    // add content
    /**
     * TODO: Unfortunately because of the container child masking issue in Phaser 3,
     * we have to constrain the entire container with the same mask
     * For more info refer to: https://github.com/photonstorm/phaser/issues/3673
     */ 
    this.content = this.scene.add.text(-this.width / 2, -this.height / 2, "", this.defaultStyles)
    this.content.setOrigin(0, 0)
    //this.content.setBackgroundColor("purple")

    // set up a mask on the content
    // this will hide overflow text when we scroll
    let maskShape = scene.add.graphics(x, y)

    maskShape
      .clear()
      .fillStyle(0x000000, 0)
      .fillRect(x - this.width / 2 - 1, y - this.height / 2 - 1, this.width + 10, this.height + 2)
    this.contentMask = this.createGeometryMask(maskShape)
    this.setMask(this.contentMask)
    this.add(this.content)

    // add pagination buttons
    let pageUpPosition = [this.width / 2 + 2, -this.height / 2 + 8]
    let pageUpLabel = "\u2BAD"
    let pageDownPosition = [this.width / 2 + 2, this.height / 2 - 7]
    let pageDownLabel = "\u2BAF"

    // add pageUp button
    this.pageUpButton = new Button(
      this.scene,
      {
        x: pageUpPosition[0], y: pageUpPosition[1],
        width: 30, height: 30,
        label: pageUpLabel, keyCode: Phaser.Input.Keyboard.KeyCodes.UP, value: null, 
        fill: false, outline: false,
        callback: this.pageUp, callbackScope: this,
        eventName: "domlessTextDisplayPageUp", eventArgs: []
      }
    )
    this.add(this.pageUpButton)
    this.pageUpButton.clearMask()
    this.pageUpButton.deactivate(true)

    // add pageDown button
    this.pageDownButton = new Button(
      this.scene,
      {
        x: pageDownPosition[0], y: pageDownPosition[1],
        width: 30, height: 30,
        label: pageDownLabel, keyCode: Phaser.Input.Keyboard.KeyCodes.DOWN, value: null, 
        fill: false, outline: false,
        callback: this.pageDown, callbackScope: this,
        eventName: "domlessTextDisplayPageDown", eventArgs: []
      }
    )
    this.add(this.pageDownButton)

    this.content.setText(initialText)
    this.content.updateText()
    
  }

  pageUp(scrollY, scrollTweenCallback=null, disablePageUp=false) {
    // tween the page up
    if (!this.scrollTween || this.scrollTween.progress === 1) {
      this.scrollTween = this.scene.add.tween({
        targets: [this.content, this.cursor],
        ease: Phaser.Math.Easing.Cubic.InOut,
        duration: 500,
        y: `+=${scrollY}`
      })
      this.scrollTween.setCallback(
        "onComplete", function() {
          // possibly disable the pageUp button
          // and call the custom callback if one was supplied
          if (disablePageUp) {
            this.pageUpButton.deactivate(true)
          }
          // enable the pageDown button if it is disabled
          if (!this.pageDownButton.alpha) {
            this.pageDownButton.activate(true)
          }
          if (scrollTweenCallback) {
            scrollTweenCallback.call(this)
          }
        }, 
        [], this
      )
    }
  }

  pageDown(scrollY, scrollTweenCallback=null, disablePageDown=false) {
    // tween the page down
    if (!this.scrollTween || this.scrollTween.progress === 1) {
      this.scrollTween = this.scene.add.tween({
        targets: [this.content, this.cursor],
        ease: Phaser.Math.Easing.Cubic.InOut,
        duration: 500,
        y: `-=${scrollY}`
      })
      this.scrollTween.setCallback(
        "onComplete", function() {
          // possibly disable the pageDown button
          // and call the custom callback if one was supplied
          if (disablePageDown) {
            this.pageDownButton.deactivate(true)
          }
          // enable the pageUp button if it is disabled
          if (!this.pageUpButton.alpha) {
            this.pageUpButton.activate(true)
          }
          if (scrollTweenCallback) {
            scrollTweenCallback.call(this)
          }
        }, [], this
      )
    }
  }

}

export default TextDisplay
