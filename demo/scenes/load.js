import LoadScene from "../../src/scenes/load.js"

import bgURL from "../static/assets/images/bg.png"
import groundURL from "../static/assets/images/ground.png"
import avatarURL from "../static/assets/images/avatar.png"

/**
 * Loading scene for the demo
 */
class DemoLoadScene extends LoadScene {

  /**
   * Constructor method for DemoLoadScene
   * Runs the constructor for the parent class, passing args
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments)
  }

  /**
   * Runs once, before the create method for this scene
   */
  preload() {
    super.preload()
    this.load.image("bg", bgURL)
    this.load.image("ground", groundURL)
    this.load.image("avatar", avatarURL)
  }

  /**
   * Runs once, before the first frame is rendered for this scene
   */
  create() {
    super.create()
  }

  /**
   * Runs continuously, each time a single frame is rendered for this scene
   */
  update() {
    super.update()
  }
}

export default DemoLoadScene
