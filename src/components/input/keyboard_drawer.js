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
    this.setInteractive()
  }

  pointerListener(pointer, localX, localY, event) {
    event.stopPropagation()
  }

  activate(forElement=null) {
    super.activate()
    if (forElement) {
      this.forElement = forElement
      this.slideTween.setCallback(
        "onUpdate",
        function() {
          this.pushElementUp()
        },
        [], this
      )
    }
  }

  deactivate(forElement=null) {
    super.deactivate()
    if (forElement) {
      this.forElement = forElement
      this.slideTween.setCallback(
        "onUpdate",
        function() {
          this.pullElementDown()
        },
        [], this
      )
    }
  }

  pushElementUp() {
    // if the drawer is getting too close, we need to "push it up"
    // by moving the camera and the drawer down
    let
      myTop = this.y - this.displayOriginY,
      elementBottom = this.forElement.y - this.forElement.displayOriginY + this.forElement.height,
      distance = myTop - elementBottom

    if (distance < 20) {
      this.scene.cameras.main.scrollY = 20 - distance
      this.y += 20 - distance
    }
  }


  pullElementDown() {
    // if the drawer pushed an element up during activate
    // pull it back down during deactivate
    // by moving the camera and the drawer tween target up
    let
      myTop = this.y - this.displayOriginY,
      elementBottom = this.forElement.y - this.forElement.displayOriginY + this.forElement.height,
      distance = myTop - elementBottom

    if (distance > 20 && this.scene.cameras.main.scrollY > 0) {
      this.scene.cameras.main.scrollY -= distance - 20
      if (this.scene.cameras.main.scrollY < 0) {
        this.slideTween.data[0].end -= distance - 20 + this.scene.cameras.main.scrollY
        this.scene.cameras.main.scrollY = 0
      } else {
        this.slideTween.data[0].end -= distance - 20
      }
    }
  }


}

export default KeyboardDrawer
