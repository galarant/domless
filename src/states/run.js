/**
 * Runs the app
 */
class RunState extends Phaser.State {

  /**
   * Constructor method for RunState
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
   * Runs before the first frame is rendered for this state
   */
  preload() {
    super.preload()
  }

  /**
   * Runs once, before the first frame is rendered for this state
   */
  create() {
    super.create()
  }

  /**
   * Runs continuously, before each frame is rendered for this state
   */
  update() {
    super.update()
  }

}

export default RunState
