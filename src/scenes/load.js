import Phaser from "phaser"

/**
 * Displays the loading screen for the app
 * Loads the assets in the background
 * Starts the run scene when loading is finished
 */
class LoadScene extends Phaser.Scene {

  /**
   * Constructor method for LoadScene
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments)
    this.defaultFontXMLURL = "static/assets/main/proxima_nova.xml"
    this.defaultFontImageURL = "static/assets/main/proxima_nova.png"

    this.defaultTouchableBodyURL = "static/assets/components/input/touchable/squircle.png"
    this.defaultTouchableFillURL = "static/assets/components/input/touchable/squircle_fill.png"
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
   * Sets up the loading image for display
   * Initializes the loaders for all Domless components
   */
  preload() {
    // show the preloader image while assets are loading
    let loadingImage = this.add.image(400, 300, "loading")
    loadingImage.scaleX = 0.1
    loadingImage.scaleY = 0.1

    // load default domless fonts
    this.load.bitmapFont("proxima_nova",
                         this.defaultFontImageURL,
                         this.defaultFontXMLURL)
    this.load.image("defaultTouchableBody", this.defaultTouchableBodyURL)
    this.load.image("defaultTouchableFill", this.defaultTouchableFillURL)
  }

  /**
   * Runs once, before the first frame is rendered for this scene
   */
  create() {
    this.counter = 0
  }

  /**
   * Runs continuously, before each frame is rendered for this scene
   * Starts the run scene if all assets and components have loaded
   */
  update() {
    this.counter += 0.1
    let progress = this.counter * this.load.progress
    if (progress >= 1.0) {
      console.log("LOADING FINISHED")
      this.scene.start("run")
      this.scene.stop()
    } else {
      console.log("Loading Progress:", progress)
    }
  }
}

export default LoadScene
