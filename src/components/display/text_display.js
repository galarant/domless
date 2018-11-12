import Phaser from "phaser"
import _ from "lodash"
/**
 * Draws an interactive button in the display
 */
class TextDisplay extends Phaser.GameObjects.Container {
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
    x, y,
    width=400,
    height=200,
    initialText="",
    fontSize=24,
    fontFamily="Helvetica",
    outline=true,
    cursor=true,
    progressive=false,
    progressiveDelay=75
  ) {

    // group attributes
    super(scene, x, y)
    scene.sys.displayList.add(this)

    this.width = width
    this.height = height
    this.defaultStyles = {
      fontSize: fontSize,
      fontFamily: fontFamily,
      align: "left",
      padding: {top: 10, left: 10, right: 10, bottom: 10},
      wordWrap: {width: this.width, useAdvancedWrap: true}
    }

    if (outline) {
      // draw the outline sprite if it doesn't exist already
      let outlineSpriteKey = `outlineSquircle${width}${height}`
      if (!this.scene.textures.exists(outlineSpriteKey)) {
        if (!this.scene.domlessGraphics) {
          this.scene.domlessGraphics = this.scene.add.graphics()
        }
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
    this.content = this.scene.add.text(-this.width / 2, -this.height / 2, "", this.defaultStyles)
    this.content.setOrigin(0, 0)
    this.add(this.content)

    // add cursor
    this.cursor = this.scene.add.text(0, 0, "_", this.defaultStyles)
    this.cursor.setOrigin(0, 0)
    this.add(this.cursor)

    if (!cursor) {
      this.cursor.setAlpha(0)
    } else {
      this.scene.add.tween({
        targets: [this.cursor],
        alpha: 0,
        duration: 250,
        yoyo: true,
        repeat: -1
      })
    }

    // set custom word wrapping to account for cursor
    this.content.setWordWrapCallback(
      function(text) {
        let wrappedText = this.content.basicWordWrap(
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
    
    // populate initial text, or timer if progressive
    if (progressive) {
      if (progressive === "words") {
        this.progressiveText = initialText.split(" ")
        this.progressiveText.forEach(function(currentVal, index, theArray) {
          theArray[index] += " "
        })
      } else if (progressive === "letters") {
        this.progressiveText = initialText.split("")
      }
      this.progressiveTimer = this.scene.time.addEvent(
        {
          delay: progressiveDelay,
          repeat: this.progressiveText.length - 1,
          callback: function() {
            this.addText(this.progressiveText.shift())
          },
          callbackScope: this
        }
      )
    } else {
      this.addText(initialText)
    }

  }

  placeCursor() {
    let wrappedText = this.content.basicWordWrap(
      this.content.text + "_",
      this.content.context,
      this.width - this.content.padding.right * 2).split("\n")

    let lastLineContent = _.last(wrappedText).trimRight().slice(0, -1)
    let lastLine = this.scene.add.text(0, 0, lastLineContent, this.defaultStyles)
    let lastLineCleaned = lastLineContent.replace(/(^ +| +$)/g, "").replace(/ {2,}\b/g, " ")
    let lastLineSpaces = lastLineContent.length - lastLineCleaned.length
    let lastLineWidth = lastLine.width + lastLineSpaces * this.spacePixelWidth
    this.cursor.x = -this.width / 2 + lastLineWidth - this.content.padding.right * 2
    lastLine.destroy()

    // calc cursor y pos
    let contentHeight = this.content.height
    if (this.content.height > this.height) {
      contentHeight = this.height
    }
    this.cursor.y = -this.height / 2 + contentHeight - this.cursor.height

    // modify cursor position if we overflowed a line
    if (this.cursor.x + this.cursor.width > this.width / 2) {
      this.cursor.x = -this.width / 2
      this.cursor.y = -this.height / 2 + contentHeight
    }

  }

  addText(extraText, keyCode) {
    if (keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
      this.content.setText(this.content.text.slice(0, -1))
    } else {
      this.content.setText(this.content.text + extraText)
    }
    this.content.updateText()
    if (this.content.height > this.height) {
      this.content.y = -(this.height / 2 + (this.content.height - this.height))
      this.content.setCrop(0, this.content.height - this.height, this.width, this.height)
    } else {
      this.content.y = -this.height / 2
      this.content.setCrop()
    }
    this.placeCursor()
  }

}

export default TextDisplay
