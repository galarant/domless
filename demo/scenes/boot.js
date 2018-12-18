import Phaser from "phaser"

/**
 * Starting scene for the demo
 */
class DemoBootScene extends Phaser.Scene {

  /**
   * Constructor method for DemoBootScene
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments)
    this.loadingImageURL = "static/assets/images/preloader.png"
  }

  /**
   * Runs once, before the create method for this scene
   */
  preload() {
    this.load.image("loading", this.loadingImageURL)
  }

  /**
   * Runs once, before the first frame is rendered for this scene
   */
  create() {}

  /**
   * Runs continuously, each time a single frame is rendered for this scene
   */
  update() {
    if (this.load.progress >= 1) {
      this.scene.start("load")
      this.scene.stop()
    }
  }
}

export default DemoBootScene
