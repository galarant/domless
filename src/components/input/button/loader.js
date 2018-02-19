const IMAGES = {
  "outline": "domless/components/input/button/assets/outline.png",
  "fill": "domless/components/input/button/assets/fill.png"
}

/**
 * Asynchronously loads assets for the Button component
 */
class ButtonLoader extends Phaser.Loader {

  /**
   * @param {object} app - The container App
   */
  constructor(app) {
    super(app)
  }

  /**
   * Downloads the Button assets in parallel
   * @param {object=IMAGES} images - Object which maps asset keys to their url's.
   */
  start(images=IMAGES) {
    this.images(images)
    super.start()
  }
}

export default ButtonLoader
