import Phaser from "phaser"
import defaultFontXMLURL from "static/assets/main/proxima_nova.xml"
import defaultFontImageURL from "static/assets/main/proxima_nova.png"

import defaultTouchableBodyURL from "static/assets/components/input/touchable/squircle.png"
import defaultTouchableFillURL from "static/assets/components/input/touchable/squircle_fill.png"

/**
 * Displays the loading screen for the app
 * Loads the assets in the background
 * Starts the run scene when loading is finished
 */
class LoadingScene extends Phaser.Scene {

  /**
   * Constructor method for LoadScene
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments)
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
    super.preload()
    // show the preloader image while assets are loading
    this.loadingSprite = new Phaser.Sprite(this.app,
                                           this.app.world.centerX,
                                           this.app.world.centerY,
                                           "loading")

    this.loadingSprite.anchor.setTo(0.5, 0.5)

    // load default domless fonts
    this.load.bitmapFont("proxima_nova",
                         defaultFontImageURL,
                         defaultFontXMLURL)
    this.load.image("defaultTouchableBody", defaultTouchableBodyURL)
    this.load.image("defaultTouchableFill", defaultTouchableFillURL)
  }

  /**
   * Runs once, before the first frame is rendered for this scene
   */
  create() {
    super.create()
  }

  /**
   * Runs continuously, before each frame is rendered for this scene
   * Starts the run scene if all assets and components have loaded
   */
  update() {
    super.update()
    if(this.load.hasLoaded) {
      this.app.scene.start("run")
    }
  }
}

export default LoadingScene
