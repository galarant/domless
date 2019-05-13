import Keyboard from "./keyboard"
import Drawer from "../display/drawer"

/**
 * Creates a bottom drawer component with a keyboard
 */
class KeyboardDrawer extends Drawer {
  /**
   * @param {object} scene - The container Phaser.Scene
   */
  constructor(
    scene,
    {
      enterLabel="\u23CE"
    }
  ) {

    // initialize with keyboard
    let content = new Keyboard(
      scene,
      {
        enterLabel: enterLabel
      }
    )
    super(
      scene,
      {
        edge: "bottom",
        content: content,
        size: content.height,
      }
    )
    content.y -= content.keyHeight + content.keySpacing

    // errant taps inside the drawer should not propagate
    this.on("pointerdown", this.pointerListener)
  }

  pointerListener(pointer, localX, localY, event) {
    event.stopPropagation()
  }

  activate(toElement=null) {
    if (!this.active) {
      console.log("activating keyboarDrawer")
      this.toElement = toElement 
      super.activate()
      this.slideTween.setCallback(
        "onUpdate",
        function() {
          this.pushElementUp()
        },
        [], this
      )
      if (this.scene.maxScroll !== undefined) {
        this.scene.maxScroll += this.height
      }
    }
  }

  deactivate(fromElement=null) {
    if (this.active) {
      console.log("deactivating keyboarDrawer")
      this.fromElement = fromElement
      super.deactivate()
      this.slideTween.setCallback(
        "onUpdate",
        function() {
          this.pullElementDown()
        },
        [], this
      )
      if (this.scene.maxScroll !== undefined) {
        this.scene.maxScroll -= this.height
      }
    }
  }

  reFocus(toElement) {
    // if next element is below the keyboard drawer, pull it up to focus
    // otherwise do nothing
    console.log("refocusing keyboardDrawer")
    let
      myTop = this.y - this.displayOriginY,
      elementBottom = toElement.y - toElement.displayOriginY + toElement.height,
      distanceToFocus = elementBottom - (myTop - 20)
    if (distanceToFocus > 0) {
      // move the camera up to focus on the new element
      this.reFocusTween = this.scene.add.tween(
        {
          targets: this.scene.cameras.main,
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: 500,
          scrollY: `+=${distanceToFocus}`
        }
      )
      this.reFocusTween.setCallback(
        "onComplete",
        function() {
          toElement.activate()
        },
        [], this
      )
    }
  }

  pushElementUp() {
    // if the drawer is getting too close, we need to "push it up"
    // by moving the camera and the drawer down
    if (!this.toElement) {
      return
    }
    let
      myTop = this.y - this.displayOriginY,
      elementBottom = this.toElement.y - this.toElement.displayOriginY + this.toElement.height,
      distance = myTop - elementBottom

    if (distance < 20) {
      this.scene.cameras.main.scrollY = 20 - distance
    }
  }


  pullElementDown() {
    // if the drawer pushed an element up during activate
    // pull it back down during deactivate
    // by moving the camera and the drawer tween target up
    if (!this.fromElement) {
      return
    }
    let
      myTop = this.y - this.displayOriginY,
      elementBottom = this.fromElement.y - this.fromElement.displayOriginY + this.fromElement.height,
      distance = myTop - elementBottom

    if (distance > 20 && this.scene.cameras.main.scrollY > 0) {
      this.scene.cameras.main.scrollY -= distance - 20
      if (this.scene.cameras.main.scrollY < 0) {
        this.scene.cameras.main.scrollY = 0
      }
    }
  }


}

export default KeyboardDrawer
