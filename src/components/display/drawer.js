import _ from "lodash"
import Phaser from "phaser"
import Element from "src/components/element"
import Button from "src/components/input/button"

/**
 * Creates a drawer component with variable content
 */
class Drawer extends Element {
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
      edge="bottom",
      size=300,
      content=scene.add.text(0, 0, "DRAWER CONTENT"),
      cancelButton=true,
    } = {} 
  ) {
    let
      x, y, width, height,
      activateTweenData, deactivateTweenData

    // set up position and size, defaulting to bottom
    if (edge === "bottom") {
      width = scene.game.config.width
      height = size
      x = width / 2
      y = scene.game.config.height + height / 2
      activateTweenData = {y: `-=${height}`}
      deactivateTweenData = {y: `+=${height}`}
    } else if (edge === "top") {
      width = scene.game.config.width
      height = size
      x = width / 2
      y = -height / 2
      activateTweenData = {y: `+=${height}`}
      deactivateTweenData = {y: `-=${height}`}
    } else if (edge === "left") {
      width = size
      height = scene.game.config.height
      x = -width / 2
      y = height / 2
      activateTweenData = {x: `+=${width}`}
      deactivateTweenData = {x: `-=${width}`}
    } else if (edge === "right") {
      width = size
      height = scene.game.config.height
      x = scene.game.config.width + width / 2
      y = height / 2
      activateTweenData = {x: `-=${width}`}
      deactivateTweenData = {x: `+=${width}`}
    } else {
      throw "Drawer edge must be one of the following: 'bottom', 'top', 'right' or 'left'."
    }

    // initialize it
    super(
      scene,
      {
        x: x,
        y: y,
        width: width,
        height: height,
        hasOutline: false
      }
    )

    // set up background rectangle
    this.backgroundRect = scene.add.rectangle(
      0, 0,
      this.width, this.height,
      0x000000, 1
    )
    this.add(this.backgroundRect)

    // add content
    this.content = content
    if (this.content.setOrigin) {
      this.content.setOrigin(0.5, 0.5)
    }
    this.content.x = 0
    this.content.y = 0
    this.add(this.content)

    // set up initial state
    this.disableInteractive()
    this.activateTweenData = activateTweenData
    this.deactivateTweenData = deactivateTweenData

    // add cancel button if needed
    if (cancelButton) {
      let cancelButtonSize = 30
      this.cancelButton = new Button(
        scene,
        {
          x: -this.width / 2 + cancelButtonSize,
          y: -this.height / 2 + cancelButtonSize,
          width: cancelButtonSize, height: cancelButtonSize,
          label: "X", arcRadius: 5, hasOutline: false,
          callback: this.deactivate,
          callbackScope: this,
          eventName: "domlessDrawerClose",
          stopPropagation: false
        }
      )
      this.add(this.cancelButton)
    }

    // make sure this thing moves along with the camera
    this.setScrollFactor(0)
  }

  slide(tweenData, callback=_.noop) {
    if (!this.slideTween || this.slideTween.progress === 1) {
      this.slideTween = this.scene.add.tween(
        Object.assign(
          {
            targets: [this],
            ease: Phaser.Math.Easing.Cubic.InOut,
            duration: 500,
          }, tweenData
        )
      )
      this.slideTween.setCallback(
        "onComplete", callback, [], this
      )
    }
  }

  activate(callback=_.noop) {
    let slideCallback = () => {
      callback()
    }
    if (!this.active) {
      super.activate()
      let maxDepth = _.maxBy(this.scene.children.list, "depth").depth
      if (this.depth < maxDepth) {
        this.setDepth(maxDepth + 1)
      }
      this.slide(this.activateTweenData, slideCallback)
    }
  }

  deactivate(callback=_.noop) {
    let slideCallback = () => {
      callback()
    }
    if (this.active) {
      super.deactivate()
      this.slide(this.deactivateTweenData, slideCallback)
    }
  }

}

export default Drawer
