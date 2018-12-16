import Phaser from "phaser"
import _ from "lodash"
import TextDisplay from "../display/text_display"
/**
 * Draws an interactive button in the display
 */
class TextField extends TextDisplay {
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

    // group attributes
    super(
      scene,
      {
        x: x, y: y,
        width: width, height: height,
        initialText: "",
        fontSize: fontSize, fontFamily: fontFamily,
        outline: outline
      }
    )

    // add cursor
    this.cursor = this.scene.add.text(x - this.width / 2, y - this.height / 2, "_", this.defaultStyles)
    this.cursor.setOrigin(0, 0)
    this.add(this.cursor)

    this.scene.add.tween({
      targets: [this.cursor],
      alpha: 0,
      duration: 250,
      yoyo: true,
      repeat: -1
    })

    // set custom word wrapping to account for cursor
    this.content.setWordWrapCallback(
      function(text) {
        let wrappedText = this.content.advancedWordWrap(
          (this.cursor ? text + "_" : text),
          this.content.context,
          this.width - this.content.padding.right * 2
        ).trimRight().slice(0, -1)
        return wrappedText
      }, this
    )

    // calc pixel width of space char, for cursor
    let testNoSpace = this.scene.add.text(0, 0, "II", this.defaultStyles)
    let testSpace = this.scene.add.text(0, 0, "I I", this.defaultStyles)
    this.spacePixelWidth = testSpace.width - testNoSpace.width
    testNoSpace.destroy()
    testSpace.destroy()

    // set up listener for button press event
    this.scene.events.on("domlessButtonPress", function(buttonChar, keyCode) {
      this.addText(buttonChar, keyCode)
    }, this)

    this.addText(initialText)
    
  }

  placeCursor() {
    let wrappedText = this.content.advancedWordWrap(
      this.content.text + "_",
      this.content.context,
      this.width - this.content.padding.right * 2).split("\n")

    let lastLineContent = _.last(wrappedText).trimRight().slice(0, -1)
    let lastLine = this.scene.add.text(0, 0, lastLineContent, this.defaultStyles)
    this.cursor.x = this.content.x + lastLine.width - this.content.padding.right * 2
    lastLine.destroy()

    // calc cursor y pos
    let contentHeight = this.content.height
    if (this.content.height > this.height) {
      contentHeight = this.height
    }
    this.cursor.y = -this.height / 2 + contentHeight - this.cursor.height

    // modify cursor position if we overflowed a line
    if (this.cursor.x + this.cursor.width > this.x + this.width / 2) {
      this.cursor.x = this.content.x - this.content.width / 2
      this.cursor.y = -this.height / 2 + contentHeight
    }

  }

  addText(extraText, keyCode) {

    this.pageDownButton.disableInput(true)

    if (keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
      this.content.setText(this.content.text.slice(0, -1))
    } else if (extraText) {
      this.content.setText(this.content.text + extraText)
    }
    this.content.updateText()
    if (this.content.height > this.height) {
      this.content.y = -(this.height / 2 + (this.content.height - this.height))
    } else {
      this.content.y = -this.height / 2
    }
    this.placeCursor()

    // enable the pageUp button if we have overflow content
    // and it is not already enabled. Otherwise disable.
    if (this.content.y < -this.height / 2) {
      if (!this.pageUpButton.alpha) {
        this.pageUpButton.enableInput(true)
      }
    } else if (this.pageUpButton.alpha) {
      this.pageUpButton.disableInput(true)
    }
  }

  pageUp() {
    // assume we are scrolling up a page
    let scrollY = this.height

    // modify behavior if we are near the top of the content
    let disablePageUp = false
    if (this.content.y >= -this.height - this.height / 2) {
      scrollY = -this.content.y - this.height / 2
      disablePageUp = true
    }

    // tween it by calling the parent method
    super.pageUp(scrollY, null, disablePageUp)
  }

  pageDown() {
    // assume we a scrolling down a page
    let contentBottom = this.content.y + this.content.height
    let scrollY = this.height

    // modify behavior if we are near the bottom of the content
    let disablePageDown = false
    if (contentBottom <= this.height + this.height / 2) {
      scrollY = contentBottom - this.height / 2
      disablePageDown = true
    }

    // tween it by calling the parent method
    super.pageDown(scrollY, null, disablePageDown)
  }
}

export default TextField
