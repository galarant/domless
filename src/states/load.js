import defaultFontXMLURL from "static/assets/main/proxima_nova.xml";
import defaultFontImageURL from "static/assets/main/proxima_nova.png";

import defaultTouchableBodyURL from "static/assets/components/input/touchable/squircle.png";

/**
 * Displays the loading screen for the app
 * Loads the assets in the background
 * Starts the run state when loading is finished
 */
class LoadState extends Phaser.State {

  /**
   * Constructor method for LoadState
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments);
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
   * Sets up the loading image for display
   * Initializes the loaders for all Domless components
   */
  preload() {
    console.log("LoadState.preload started");
    super.preload();
    // show the preloader image while assets are loading
    console.log("GAME TYPE:", typeof this.game);
    console.log("APP TYPE:", typeof this.app);
    this.loadingSprite = new Phaser.Sprite(this.app,
                                           this.app.world.centerX,
                                           this.app.world.centerY,
                                           "loading");

    this.loadingSprite.anchor.setTo(0.5, 0.5);

    // load default domless fonts
    this.load.bitmapFont("proxima_nova",
      defaultFontImageURL,
      defaultFontXMLURL);
    this.load.image("defaultTouchableBody", defaultTouchableBodyURL);
    console.log("LoadState.preload done");
  }

  /**
   * Runs once, before the first frame is rendered for this state
   */
  create() {
    super.create();
  }

  /**
   * Runs continuously, before each frame is rendered for this state
   * Starts the run state if all assets and components have loaded
   */
  update() {
    super.update();
    if(this.load.hasLoaded) {
      this.app.state.start("run");
    }
  }
}

export default LoadState;
