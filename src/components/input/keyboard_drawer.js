import Keyboard from "./keyboard"
//import Button from "./button"
import Drawer from "../display/drawer"

/**
 * Creates a bottom drawer component with a keyboard
 */
class KeyboardDrawer extends Drawer {
  /**
   * @param {object} scene - The container Phaser.Scene
   */
  constructor(scene) {

    // initialize with keyboard
    let content = new Keyboard(scene, {})
    super(
      scene,
      {
        edge: "bottom",
        content: content,
        size: content.height
      }
    )
    content.y -= content.keyHeight + content.keySpacing
  }
}

export default KeyboardDrawer
