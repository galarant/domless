import Phaser from "phaser"
import _ from "lodash"
import Button from "../input/button"
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
    progressiveDelay=75,
    pagination="vertical"
  ) {

    // group attributes
    super(scene, x, y)
    scene.sys.displayList.add(this)

    this.width = width
    this.height = height
    this.pagination = pagination
    this.initialText = initialText
    this.progressive = progressive
    this.progressiveDelay = progressiveDelay
    this.defaultStyles = {
      fontSize: fontSize,
      fontFamily: fontFamily,
      align: "left",
      padding: {top: 10, left: 10, right: 10, bottom: 10},
      wordWrap: {width: this.width, useAdvancedWrap: true}
    }

    if (!this.scene.domlessGraphics) {
      this.scene.domlessGraphics = this.scene.add.graphics()
    }

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
     * we cannot add the content directly as a child of the container.
     * Thus if the container mutates, we will need to manually mutate the content, cursor and mask along with it.
     * For more info refer to: https://github.com/photonstorm/phaser/issues/3673
     */ 
    this.content = this.scene.add.text(x - this.width / 2, y - this.height / 2, "", this.defaultStyles)
    this.content.setOrigin(0, 0)
    //this.content.setBackgroundColor("purple")

    // set up a mask on the content
    // this will hide overflow text when we scroll
    let maskShape = scene.add.graphics(x, y)

    maskShape
      .clear()
      .fillStyle(0x000000, 0)
      //.fillRect(0, 0, this.height, this.width)
      .fillRect(x - this.width / 2, y - this.height / 2, this.width, this.height)
    let mask = this.createGeometryMask(maskShape)
    this.content.setMask(mask)

    // add cursor
    this.cursor = this.scene.add.text(x - this.width / 2, y - this.height / 2, "_", this.defaultStyles)
    this.cursor.setOrigin(0, 0)
    this.cursor.setMask(mask)

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

    // add pagination buttons
    let pageUpPosition = [this.width / 2, -this.height / 2]
    let pageUpLabel = "\u2BAD"
    let pageDownPosition = [this.width / 2, this.height / 2]
    let pageDownLabel = "\u2BAF"
    if (this.pagination === "horizontal") {
      pageUpPosition = [-this.width / 2, this.height / 2]
      pageUpLabel = "\u2BA8"
      pageDownPosition = [this.width / 2, this.height / 2]
      pageDownLabel = "\u2BA9"
    }

    // add pageUp button
    this.pageUpButton = new Button(
      this.scene,
      pageUpPosition[0], pageUpPosition[1],
      30, 30,
      pageUpLabel, Phaser.Input.Keyboard.KeyCodes.UP, null, 
      false, this.pageUp, this, "domlessTextDisplayPageUp",
      [], 24, false
    )
    this.add(this.pageUpButton)
    this.pageUpButton.disableInput(true)

    // add pageDown button
    this.pageDownButton = new Button(
      this.scene,
      pageDownPosition[0], pageDownPosition[1],
      30, 30,
      pageDownLabel, Phaser.Input.Keyboard.KeyCodes.DOWN, null, 
      false, this.pageDown, this, "domlessTextDisplayPageDown",
      [], 24, false
    )
    this.add(this.pageDownButton)
    this.promptNextPageTween = this.scene.add.tween({
      targets: [this.pageDownButton],
      alpha: 0,
      duration: 250,
      yoyo: true,
      repeat: -1
    })
    this.promptNextPageTween.pause()
    this.pageDownButton.disableInput(true)
    this.pageBreaks = []

    // set up listener for button press event
    this.scene.events.on("domlessButtonPress", function(buttonChar, keyCode) {
      this.addText(buttonChar, keyCode)
    }, this)

    if (typeof(this.initialText) === "string") {
      this.initialText = [this.initialText]
    }

    this.addPage()
    
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
    this.cursor.x = this.x - this.width / 2 + lastLineWidth - this.content.padding.right * 2
    lastLine.destroy()

    // calc cursor y pos
    let contentHeight = this.content.height
    if (this.content.height > this.height) {
      contentHeight = this.height
    }
    this.cursor.y = this.y - this.height / 2 + contentHeight - this.cursor.height

    // modify cursor position if we overflowed a line
    if (this.cursor.x + this.cursor.width > this.x + this.width / 2) {
      this.cursor.x = this.x - this.width / 2
      this.cursor.y = this.y - this.height / 2 + contentHeight
    }

  }

  addPage() {
    let thisPageText = this.initialText.shift()

    // if this is not the last page, add line breaks to fill the page
    if (this.initialText.length) {
      let testText = this.scene.add.text(0, 0, thisPageText, this.defaultStyles)
      let extraHeight = this.height - testText.height
      if (extraHeight > 0) {
        thisPageText += "\n".repeat(Math.ceil(extraHeight / this.cursor.height) + 4)
      }
      testText.destroy()
    }
    
    // populate initial text, or timer if progressive
    if (this.progressive) {
      if (this.progressive === "words") {
        this.progressiveText = thisPageText.split(" ")
        this.progressiveText.forEach(function(currentVal, index, theArray) {
          theArray[index] += " "
        })
      } else if (this.progressive === "letters") {
        this.progressiveText = thisPageText.split("")
      }
      this.progressiveTimer = this.scene.time.addEvent(
        {
          delay: this.progressiveDelay,
          repeat: this.progressiveText.length - 1,
          callback: function() {
            if (!this.progressiveText.length) {
              this.promptNextPage()
            }
          },
          callbackScope: this
        }
      )
    } else {
      this.content.setText(this.content.text + thisPageText)
      this.content.updateText()
      this.pageBreaks.push(this.content.height - this.cursor.height)
      if (this.initialText.length) {
        this.promptNextPage()
      } else {
        this.scrollTween.stop()
        this.pageDownButton.disableInput(true)
      }
    }
  }

  promptNextPage() {
    // disable page up
    if (this.pageUpButton.alpha) {
      this.pageUpButton.disableInput(true)
    }

    // enable page down and blink it
    this.pageDownButton.enableInput(true)
    this.promptNextPageTween.restart()
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
      this.content.y = this.y - (this.height / 2 + (this.content.height - this.height))
    } else {
      this.content.y = this.y - this.height / 2
    }
    this.placeCursor()

    // enable the pageUp button if we have overflow content
    // and it is not already enabled
    if (this.content.y < this.y && !this.pageUpButton.alpha) {
      this.pageUpButton.enableInput(true)
    }
  }

  pageUp() {
    if (this.pagination === "vertical") {
      // assume we are scrolling up a page
      let scrollY = this.height
      let currentY = this.y - this.height / 2 - this.content.y

      // get max page break less than current Y position
      let pageBreak = _.max(_.filter(this.pageBreaks, function(o) { return o < currentY }))

      // modify scroll distance if necessary
      if (pageBreak) {
        scrollY = currentY - pageBreak
      } else if (this.content.y >= this.y - this.height) {
        // if content is less than a page above the container
        // scroll so the top meets the container
        scrollY = this.y - this.content.y - this.height / 2
      }

      // tween it
      if (!this.scrollTween || this.scrollTween.progress === 1) {
        this.scrollTween = this.scene.add.tween({
          targets: [this.content, this.cursor],
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: 500,
          y: `+=${scrollY}`
        })
        this.scrollTween.setCallback(
          "onComplete", function() {
            if (this.content.y === this.y - this.height / 2) {
              this.pageUpButton.disableInput(true)
            }
          }, 
          [], this
        )
      }

      // enable the pageDown button if it is disabled
      if (!this.pageDownButton.alpha) {
        this.pageDownButton.enableInput(true)
      }
    }

  }

  pageDown() {
    if (this.promptNextPageTween.isPlaying) {
      this.promptNextPageTween.stop()
    }

    if (this.pagination === "vertical") {
      // assume we a scrolling down a page
      let contentBottom = this.content.y + this.content.height
      let currentY = this.y - this.height / 2 - this.content.y
      let scrollY = this.height

      // get min page break greater than current Y position
      let pageBreak = _.min(_.filter(this.pageBreaks, function(o) { return o > currentY }))

      // modify scroll distance if necessary
      if (pageBreak) {
        scrollY = pageBreak - currentY
      } else if (contentBottom <= this.y + this.height) {
        // content is less than a page down
        // scroll it so the bottom meets the container
        scrollY = contentBottom - this.y - this.height / 2
      }

      this.pageDownDistance = 0

      // tween it
      if (!this.scrollTween || this.scrollTween.progress === 1) {
        this.scrollTween = this.scene.add.tween({
          targets: [this.content, this.cursor],
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: 500,
          y: `-=${scrollY}`
        })
        this.scrollTween.setCallback(
          "onComplete", function() {
            if (this.content.y + this.content.height === this.y + this.height / 2) {
              this.pageDownButton.disableInput(true)
            }
            if (this.initialText.length) {
              this.addPage()
            }
          }, [], this
        )
      }

      // enable the pageUp button if it is disabled
      if (!this.pageUpButton.alpha) {
        this.pageUpButton.enableInput(true)
      }
    }

  }
}

export default TextDisplay
