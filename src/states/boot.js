import loadingImage from "static/assets/main/preloader.png";

/**
 * Starting point for prettymuch everything
 * Retrieves and initializes the preloader assets
 * Displays an empty black screen while preloader assets are downloading
 */
class BootState extends Phaser.State {


  /**
   * Constructor method for BootState
   * Sets the loading image url
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments);
    this.loadingImageURL = loadingImage;
  }

  /**
   * Getter for the app property
   * this.app is a synonym for this.game
   */
  get app() {
    return this.game;
  }

  /**
   * Runs once, before the create method for this state
   * Sets up app scaling behavior
   * Retrieves the loading image from the server
   */
  preload() {
    super.preload();
    this.app.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.app.scale.pageAlignVertically = true;
    this.app.scale.pageAlignHorizontally = true;
    this.app.scale.trackParentInterval = 500;
    this.load.image("loading", this.loadingImageURL);
  }

  /** Runs once, before the first frame is rendered for this state
   */
  create() {
    super.create();
  }

  /**
   * Runs continuously, before each frame is rendered for this state
   * Starts the LoadState once the loading image has been retrieved
   */
  update() {
    super.update();
    if (this.load.hasLoaded) {
      this.app.state.start("load");
    }
  }
}

export default BootState;
