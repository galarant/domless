import Phaser from "phaser"

/**
 * Starting point for prettymuch everything
 * Retrieves and initializes the preloader assets
 * Displays an empty black screen while preloader assets are downloading
 */
class BootScene extends Phaser.Scene {


  /**
   * Constructor method for BootScene
   * Sets the loading image url
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments)
    this.loadingImageURL = "static/assets/main/preloader.png"
  }

  /**
   * Getter for the app property
   * this.app is a synonym for this.game
   */
  get app() {
    return this.game
  }

  /**
   * Runs once, before the create method for this scene
   * Retrieves the loading image from the server
   */
  preload() {
    this.load.image("loading", this.loadingImageURL)
  }

  /** Runs once, before the first frame is rendered for this scene
   */
  create() {}

  /**
   * Runs continuously, before each frame is rendered for this scene
   * Starts the Loadscene once the loading image has been retrieved
   */
  update() {
    if (this.load.progress >= 1) {
      this.scene.start("load")
      this.scene.stop()
    }
  }
}

export default BootScene
