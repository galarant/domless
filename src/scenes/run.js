import Phaser from "phaser"
/**
 * Runs the app
 */
class RunScene extends Phaser.Scene {

  /**
   * Constructor method for RunScene
   * Returns a ndw instance of this class
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
   * Runs before the first frame is rendered for this scene
   */
  preload() {
    super.preload()
  }

  /**
   * Runs once, before the first frame is rendered for this scene
   */
  create() {
    super.create()
  }

  /**
   * Runs continuously, before each frame is rendered for this scene
   */
  update() {
    super.update()
  }

}

export default RunScene
