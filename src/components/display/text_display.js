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
      outline=true,
      styles={
        fontSize: 24,
        fontFamily: "Helvetica",
        align: "left",
        padding: {top: 10, left: 10, right: 10, bottom: 10},
        wordWrap: {width: width}
      }
    }
  ) {

    // set up basic attributes
    super(
      scene,
      {
        x: x,
        y: y,
        width: width,
        height: height,
        outline: outline
      }
    )

    scene.sys.displayList.add(this)

    this.width = width
    this.height = height
    this.initialText = initialText
    this.styles = styles

    if (!this.scene.domlessGraphics) {
      this.scene.domlessGraphics = this.scene.add.graphics()
    }

    // calc height of one text row
    let testlineHeight = this.scene.add.text(0, 0, "foobar", this.styles)
    this.lineHeight = testlineHeight.height
    testlineHeight.destroy()

    this.initComponents()

  }

  /**
   * Initialize all the stuff that makes this object work
   * If you change anything about the parent object: position, size, styles etc
   * You should re-run this method
   */
  initComponents() {

    // reset the wordWrap width
    this.styles.wordWrap.width = this.width

    // add the content Text object
    let contentText = this.initialText
    if (this.content) {
      contentText = this.content.text
      this.content.destroy()
    }

    this.content = this.scene.add.text(-this.width / 2, -this.height / 2, "", this.styles)
    this.content.setOrigin(0, 0)
    this.content.setText(contentText)
    this.add(this.content)

    // set up a mask on the content
    // this will hide overflow text when we scroll
    if (this.contentMask) {
      this.contentMask.destroy()
    }
    let maskShape = this.scene.add.graphics(0, 0)
    this.add(maskShape)

    maskShape
      .clear()
      .fillStyle(0x000000, 0)
      .fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
    this.contentMask = this.createGeometryMask(maskShape)
    this.content.setMask(this.contentMask)

    // add pagination buttons
    let buttonShift = 0
    if (this.form && this.form.drawer) {
      buttonShift = -8
    } 
    let pageUpPosition = [this.width / 2 + 2 + buttonShift, -this.height / 2 + 8]
    let pageUpLabel = "\u2BAD"
    let pageDownPosition = [this.width / 2 + 2 + buttonShift, this.height / 2 - 7]
    let pageDownLabel = "\u2BAF"

    // add pageUp button
    if (this.pageUpButton) {
      this.pageUpButton.destroy()
    }
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
    this.pageUpButton.setAlpha(0)

    // add pageDown button
    if (this.pageDownButton) {
      this.pageDownButton.destroy()
    }
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
    this.pageDownButton.setAlpha(0)

    this.content.setText(this.initialText)
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
