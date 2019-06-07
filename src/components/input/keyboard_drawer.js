//import _ from "lodash"

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
      enterLabel="\u23CE",
      elementPadding=20
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
        cancelButton: false
      }
    )
    content.y -= content.keyHeight + content.keySpacing
    this.elementPadding = elementPadding
    this.activateCameraPos = null

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
      this.activateCameraPos = this.scene.cameras.main.scrollY
      this.pushCameraUp(toElement, maxPush)

    }
  }

  deactivate(fromElement=null, pullDistance=0) {
    if (this.active) {
      console.log("deactivating keyboarDrawer")
      this.fromElement = fromElement
      super.deactivate()
      this.pullCameraDown(pullDistance)
    }
  }

  reFocus(toElement) {
    // if element is above the screen, pull it down so it's visible
    // if element is below the keyboardDrawer, pull it up so it's visible
    // if element is visible, do nothing
    console.log("refocusing keyboardDrawer")
    let activateElement = toElement

    if (toElement.form && !toElement.form.drawer && !toElement.form.nextField(toElement)) {
      toElement = toElement.form.submitButton
    }

    let
      camera = this.scene.cameras.main,
      elementTopPos = toElement.y - toElement.displayOriginY - camera.scrollY,
      visibleHeight = this.scene.game.config.height - (this.height + this.elementPadding),
      pushDistance = 0

    if (elementTopPos < 0) {
      pushDistance = elementTopPos - this.elementPadding
    } else if (elementTopPos > visibleHeight) {
      pushDistance = elementTopPos + toElement.height - visibleHeight
    }

    this.pushCameraTween = this.scene.add.tween(
      {
        targets: camera,
        ease: Phaser.Math.Easing.Cubic.InOut,
        duration: 100,
        scrollY: `+=${pushDistance}`
      }
    )
    this.pushCameraTween.setCallback(
      "onComplete",
      function() {
        activateElement.activate()
      },
      [], this
    )

  }

  pushCameraUp(toElement, maxPush=null) {
    let
      camera = this.scene.cameras.main,
      elementBottomPos = toElement.y + toElement.displayOriginY - camera.scrollY,
      distanceToBottom = this.scene.game.config.height - elementBottomPos,
      rawPushDistance = this.height + this.elementPadding - distanceToBottom,
      pushDistance = Math.min(rawPushDistance, maxPush)

    // if the drawer is going to cover an element
    // we need to scroll the camera up so that it won't cover it
    if (pushDistance > 0) {
      this.pushCameraTween = this.scene.add.tween(
        {
          targets: camera,
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: 250,
          scrollY: `+=${pushDistance}`
        }
      )
    }
    // if scene is scrollabe
    // change the scroll distance and metric height to account for drawer
    if (this.scene.scrollable) {
      this.scene.add.tween(
        {
          targets: this.scene.scrollable,
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: 250,
          props: {
            maxScroll: `+=${this.height}`,
            scrollBarMetricHeight: `-=${this.height}`
          }
        }
      )
    }
  }


  pullCameraDown(pullDistance=0) {
    // if the drawer moved the camera around while it was active
    // move it back to its original position on activation
    let camera = this.scene.cameras.main
    if (this.activateCameraPos !== null) {
      this.pushCameraTween = this.scene.add.tween(
        {
          targets: camera,
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: 250,
          scrollY: this.activateCameraPos + pullDistance
        }
      )
      this.activateCameraPos = null
    }
    // if scene is scrollabe
    // reset the scroll distance and metric height back to normal
    if (this.scene.scrollable) {
      this.scene.add.tween(
        {
          targets: this.scene.scrollable,
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: 250,
          props: {
            maxScroll: `-=${this.height}`,
            scrollBarMetricHeight: `+=${this.height}`
          }
        }
      )
    }
  }


}

export default KeyboardDrawer
