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

  activate(toElement=null, maxPush=null) {
    if (!this.active) {
      console.log("activating keyboarDrawer")
      super.activate()
      this.slideTween.setCallback(
        "onUpdate",
        function() {
          this.pushElementUp(toElement, maxPush)
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
      distanceToFocus = elementBottom - (myTop - 20) - this.scene.cameras.main.scrollY
    if (distanceToFocus > 0) {
      // move the camera up to focus on the new element
      this.reFocusTween = this.scene.add.tween(
        {
          targets: this.scene.cameras.main,
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: 250,
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
    } else {
      // delay activation of the next element by 50 milliseconds
      // so it doesn't pick up the submit button press from the previous element
      // TODO: figure out how to stop propagation on custom events
      // so this hack is not needed. this makes me nauseous
      this.scene.time.delayedCall(
        50,
        toElement.activate,
        [], toElement
      )
    }
  }

  pushElementUp(toElement, maxPush=null) {
    // if the drawer is getting too close, we need to "push it up"
    // by moving the camera and the drawer down
    let
      myTop = this.y - this.displayOriginY,
      elementBottom = toElement.y - toElement.displayOriginY + toElement.height,
      distance = myTop - elementBottom

    if ((20 - distance) < maxPush) {
      if (distance < 20) {
        this.scene.cameras.main.scrollY = 20 - distance
      }
    } else {
      this.scene.cameras.main.scrollY = maxPush
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
