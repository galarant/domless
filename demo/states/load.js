import LoadState from "../../src/states/load.js"

import bgURL from "../static/assets/images/bg.png"
import groundURL from "../static/assets/images/ground.png"
import avatarURL from "../static/assets/images/avatar.png"

/**
 * Loading state for the demo
 */
class DemoLoadState extends LoadState {

  /**
   * Constructor method for DemoLoadState
   * Runs the constructor for the parent class, passing args
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments)
  }

  /**
   * Runs once, before the create method for this state
   */
  preload() {
    console.log("DemoLoadState.preload started")
    super.preload()
    this.load.image("bg", bgURL)
    this.load.image("ground", groundURL)
    this.load.image("avatar", avatarURL)
    console.log("DemoLoadState.preload done")
  }

  /**
   * Runs once, before the first frame is rendered for this state
   */
  create() {
    super.create()
  }

  /**
   * Runs continuously, each time a single frame is rendered for this state
   */
  update() {
    super.update()
  }
}

export default DemoLoadState
