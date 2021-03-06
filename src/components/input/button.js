import Phaser from "phaser"

import Element from "../element"
/**
 * Draws an interactive button in the display
 */
class Button extends Element {
  /**
   * @param {object} scene - The container Phaser.Scene
   * @param {number} x - The x position of the Button in the game world
   * @param {number} y - The y position of the Button in the game world
   * @param {function} [callback=null] - Bind a callback function to this Button
   * @param {object} [callbackScope=null] - Scope of your optional bound callback function
   * @param {number} [width=60] - Display width in pixels
   * @param {number} [height=60] - Display height in pixels
   * @param {string} [label="OK"] - Text displayed inside the Button
   * @param {number|null} [keyCode=null] - Bind a JS keyCode to this Button
   */
  constructor(
    scene,
    {
      x, y,
      width=60, height=60,
      styles={
        fontSize: 24,
        fontFamily: "Helvetica",
        padding: {top: 10, left: 10, right: 10, bottom: 10},
      },
      label="OK", keyCode=null, value=label,
      hasFill=true, hasOutline=true, fillAlpha=0, 
      callback=null, callbackArgs=[], callbackScope=null,
      eventName="domlessButtonPress",
      eventArgs=[value, keyCode],
      stopPropagation=true,
      initializeActive=true,
      arcRadius=15,
      responsive=true,
    }
  ) {

    //group attributes
    super(
      scene,
      { 
        x: x,
        y: y, 
        width: width,
        height: height,
        hasOutline: hasOutline,
        hasFill: hasFill,
        arcRadius: arcRadius,
        fillAlpha: fillAlpha,
        responsive: responsive,
        interactive: true
      }
    )

    scene.sys.displayList.add(this)

    this.keyCode = keyCode
    this.eventName = eventName
    this.eventArgs = eventArgs
    this.styles = styles

    //add label
    this.label = scene.add.text(0, 0, label, styles)
    this.label.setOrigin(0.5, 0.5)
    this.label.setPadding(this.styles.padding)
    this.add(this.label)

    //set up callback functionality
    if (callbackScope) {
      this.callbackScope = callbackScope
    } else {
      this.callbackScope = this
    }

    // add Phaser keyboard key if keyCode exists
    // this gives some useful default behavior like enableCapture and emitOnRepeat
    if (keyCode) {
      let emitOnRepeat = true
      if (keyCode === Phaser.Input.Keyboard.KeyCodes.CAPS_LOCK) {
        emitOnRepeat = false
      }
      this.key = this.scene.input.keyboard.addKey(keyCode, true, emitOnRepeat)
      this.key.on("down", this.handleKeyboardInput, this)
    }

    if (callback) {
      this.callback = callback
    }

    this.callbackArgs = callbackArgs
    this.stopPropagation = stopPropagation

    if (initializeActive) {
      this.activate(true)
    }

    this.initElementComponents()

  }

  handleKeyboardInput(key) {
    if (this.active) {
      if (key.repeats == 2) {
        // don't do anything on first repeat
        // this heads off occasional "double tap" bugs
        return
      }
      if (this.eventName) {
        this.scene.events.emit(this.eventName, ...this.eventArgs)
      }
      this.flashFill()

      if (this.callback) {
        this.callback.call(this.callbackScope, ...this.callbackArgs)
      }
    }
  }

  handleGameObjectUpIn(pointer, currentlyOver, event) {
    if (this.active) {
      if (this.eventName) {
        this.scene.events.emit(this.eventName, ...this.eventArgs)
      }
      this.flashFill()

      if (this.callback) {
        this.callback.call(this.callbackScope, ...this.callbackArgs)
      }

      if (event && this.stopPropagation) {
        event.stopPropagation()
      }
    }
  }

  flashFill() {
    //flash the fill sprite with a quick yoyo tween
    if (this.fill) {
      this.scene.tweens.killTweensOf(this.fill)
      this.fill.setAlpha(this.fillAlpha)
      this.fillTween = this.scene.add.tween({
        targets: [this.fill],
        ease: "Linear",
        duration: 100,
        delay: 0,
        alpha: 1,
        yoyo: true,
      })
    }
  }

}

export default Button
