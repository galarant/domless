import _ from "lodash"
import TextDisplay from "./text_display"
/**
 * Draws an interactive button in the display
 */
class Dialogue extends TextDisplay {
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
    pages=[],
    fontSize=24,
    fontFamily="Helvetica",
    outline=true,
    progressive=false,
    progressiveDelay=75
  ) {

    // group attributes
    super(scene, x, y, width, height, "", fontSize, fontFamily, outline)

    this.pages = pages
    this.progressive = progressive
    this.progressiveDelay = progressiveDelay

    if (!this.scene.domlessGraphics) {
      this.scene.domlessGraphics = this.scene.add.graphics()
    }

    this.promptNextPageTween = this.scene.add.tween({
      targets: [this.pageDownButton],
      alpha: 0,
      duration: 250,
      yoyo: true,
      repeat: -1
    })
    this.promptNextPageTween.pause()
    this.pageDownButton.disableInput(true)
    this.pageBreaks = [0]

    // set up listener for button press event
    this.scene.events.on("domlessButtonPress", function(buttonChar, keyCode) {
      this.addText(buttonChar, keyCode)
    }, this)

    this.addPage()
    
  }

  addPage() {
    let thisPageText = this.pages.shift()

    // if this is not the last page, add line breaks to fill the page
    if (this.pages.length) {
      let testText = this.scene.add.text(0, 0, thisPageText, this.defaultStyles)
      let extraHeight = this.height - testText.height
      if (extraHeight > 0) {
        thisPageText += "\n".repeat(Math.ceil(extraHeight / this.lineHeight) + 4)
      }
      testText.destroy()
    }
    
    // populate page, or set up timers if progressive
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
      this.promptNextPage()
    }
  }

  promptNextPage() {
    this.pageBreaks.push(this.content.height - this.lineHeight)
    if (this.pages.length) {
      // disable page up
      if (this.pageUpButton.alpha) {
        this.pageUpButton.disableInput(true)
      }
      // enable page down and blink it
      this.pageDownButton.enableInput(true)
      this.promptNextPageTween.restart()
    } else {
      // we are at the bottom
      this.promptNextPageTween.stop()
      this.pageDownButton.disableInput(true)
    }
  }

  // extend parent pageUp function to use page breaks
  pageUp() {
    // get max page break less than current Y position
    let disablePageUp = false
    let currentY = this.y - this.height / 2 - this.content.y
    let pageBreak = _.max(_.filter(this.pageBreaks, function(o) { return o < currentY }))

    // disable the pageUp button if we are at the first page break
    if (pageBreak === _.min(this.pageBreaks)) {
      disablePageUp = true
    }

    if (pageBreak !== undefined) {
      let scrollY = currentY - pageBreak

      // tween it with parent method
      super.pageUp(scrollY, null, disablePageUp)
    }
  }

  pageDown() {
    // get min page break greater than current Y position
    let disablePageDown = false
    let currentY = this.y - this.height / 2 - this.content.y
    let pageBreak = _.min(_.filter(this.pageBreaks, function(o) { return o > currentY }))

    // disable the pageDown button if we are at the last page break
    if (pageBreak === _.max(this.pageBreaks)) {
      disablePageDown = true
    }

    if (pageBreak !== undefined) {
      let scrollY = pageBreak - currentY

      // add the next page after tweening, if there is one
      let scrollTweenCallback = function() {
        if (this.pages.length) {
          this.addPage()
        }
      }
      // tween it with the parent method
      super.pageDown(scrollY, scrollTweenCallback, disablePageDown)
    } 
  }
}

export default Dialogue
