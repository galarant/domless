import BootScene from "../../src/scenes/boot.js"

/**
 * Starting scene for the demo
 */
class DemoBootScene extends BootScene {

  /**
   * Constructor method for DemoBootScene
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments)
  }

  /**
   * Runs once, before the create method for this scene
   */
  preload() {
    super.preload()
  }

  /**
   * Runs once, before the first frame is rendered for this scene
   */
  create() {
    console.log("DemoBootScene create")
    super.create()
  }

  /**
   * Runs continuously, each time a single frame is rendered for this scene
   */
  update() {
    super.update()
  }
}

export default DemoBootScene
