import Phaser from "phaser"
import _ from "lodash"

import TextDisplay from "../display/text_display"
import KeyboardDrawer from "./keyboard_drawer"

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
      styles={
        fontSize: 24,
        fontFamily: "Helvetica",
        align: "left",
        padding: {top: 10, left: 10, right: 10, bottom: 10},
        wordWrap: {width: width}
      },
      outline=true,
      helpText="This is the help text",
      editMode="drawer",
      submitOnEnter=false,
    }
  ) {

    // group attributes
    super(
      scene,
      {
        x: x, y: y,
        width: width, height: height,
        initialText: "",
        styles: styles,
        outline: outline,
      }
    )

    // add cursor
    this.cursor = this.scene.add.text(x - this.width / 2, y - this.height / 2, "_", this.styles)
    this.cursor.setOrigin(0, 0)
    this.add(this.cursor)

    // set up help text
    this.helpText = this.scene.add.text(-this.width / 2, -this.height / 2, helpText, this.styles)
    this.helpText.setColor("gray")
    this.add(this.helpText)

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
    let testNoSpace = this.scene.add.text(0, 0, "II", this.styles)
    let testSpace = this.scene.add.text(0, 0, "I I", this.styles)
    this.spacePixelWidth = testSpace.width - testNoSpace.width
    testNoSpace.destroy()
    testSpace.destroy()

    // set up listener for button press event
    this.scene.events.on("domlessButtonPress", function(buttonChar, keyCode) {
      if (this.active) {
        this.addText(buttonChar, keyCode)
      }
    }, this)

    // activate on click inside / deactivate on click outside
    this.scene.input.on("pointerup", this.pointerListener, this)

    this.addText(initialText)

    this.editMode = editMode
    this.submitOnEnter = submitOnEnter
    if (this.editMode === "drawer" && !this.scene.keyboardDrawer) {
      this.scene.keyboardDrawer = new KeyboardDrawer(
        this.scene,
        {
          enterLabel: this.submitOnEnter ? "OK" : "\u23CE"
        }
      )
    }

    //submit on TAB
    if (!this.scene.tabKey) {
      this.scene.tabKey = this.scene.input.keyboard.addKey("TAB")
    }

    if (!this.scene.shiftKey) {
      this.scene.shiftKey = this.scene.input.keyboard.addKey("SHIFT")
    }

    this.scene.input.keyboard.on("keydown-TAB", this.handleTab, this)

    // force deactivation to initialize properly
    this.deactivate(true)
    this.setInteractive()
    
  }

  handleTab(event) {
    event.preventDefault()
    if (this.active) {
      this.submit()
    }
  }

  pointerListener(pointer, currentlyOver) {
    // don't do anything if we were just dragging
    if (pointer.wasDragged) {
      return
    }

    // don't do anything if we are tweening the keyboard drawer
    if (
      this.scene.keyboardDrawer &&
      this.scene.keyboardDrawer.slideTween &&
      this.scene.keyboardDrawer.slideTween.progress > 0 &&
      this.scene.keyboardDrawer.slideTween.progress < 1
    ) {
      return
    }

    // activate on click inside this, deactivate on click outside
    if (_.includes(currentlyOver, this)) {
      this.activate()
    } else {
      // is the cursor over any other TextFields besides this one?
      let deactivateTo = _.find(currentlyOver, o => o.constructor.name === "TextField" && o.id !== this.id)
      this.deactivate(false, deactivateTo)
    }
  }
    

  activate(force=false) {
    if (!this.active || force) {
      console.log("activating textField " + this.id)
      super.activate()
      this.cursor.setAlpha(1)
      this.cursorTween = this.scene.add.tween(
        {
          targets: [this.cursor],
          alpha: 0,
          duration: 250,
          yoyo: true,
          repeat: -1
        }
      )
      this.helpText.setAlpha(0)
      if (this.editMode === "drawer") {
        // if this field is part of a form
        // the drawer should push the whole form up
        let drawerPushElement = this
        if (this.form) {
          drawerPushElement = this.form.submitButton
        }
        // but don't push me above the top of the viewport
        let 
          myTop = this.y - this.height,
          maxPush = myTop - this.scene.cameras.main.scrollY
        this.scene.keyboardDrawer.activate(drawerPushElement, maxPush)
      }
    }
  }  

  deactivate(force=false, to=null) {
    if (this.active || force) {
      console.log("deactivating textField " + this.id)
      // deactivate but don't disable interactive
      super.deactivate(false, false)
      this.cursor.setAlpha(0)
      if (this.cursorTween) {
        this.cursorTween.stop()
      }
      if (!this.content.text) {
        this.helpText.setAlpha(1)
      }
      // Deactivate the keyboard drawer
      // Or move it to the next textField
      if (this.editMode === "drawer") {
        if (to) {
          this.scene.keyboardDrawer.reFocus(to)
        } else {
          this.scene.keyboardDrawer.deactivate(this)
        }
      }
    }
  }

  submit() {
    let nextField = null
    if (this.scene.shiftKey.isDown && this.scene.tabKey.isDown && this.form.previousField(this)) {
      nextField = this.form.previousField(this)
    } else if (!this.scene.shiftKey.isDown && this.form && this.form.nextField(this)) {
      nextField = this.form.nextField(this)
    }
    this.deactivate(false, nextField)
  }

  placeCursor() {
    let wrappedText = this.content.advancedWordWrap(
      this.content.text + "_",
      this.content.context,
      this.width - this.content.padding.right * 2).split("\n")

    let lastLineContent = _.last(wrappedText).trimRight().slice(0, -1)
    let lastLine = this.scene.add.text(0, 0, lastLineContent, this.styles)
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

    this.pageDownButton.deactivate(true)

    if (keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
      this.content.setText(this.content.text.slice(0, -1))
    } else if (keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER && this.submitOnEnter) {
      this.submit()
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
        this.pageUpButton.activate(true)
      }
    } else if (this.pageUpButton.alpha) {
      this.pageUpButton.deactivate(true)
    }
  }

  clearText() {
    this.pageDownButton.deactivate(true)
    this.pageUpButton.deactivate(true)
    this.content.setText("")
    this.content.updateText()
    this.content.y = -this.height / 2
    this.placeCursor()
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
