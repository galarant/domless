import LoadScene from "../../src/scenes/load.js"


/**
 * Load scene for the demo
 */
class DemoLoadScene extends LoadScene {

  /**
   * Constructor method for DemoLoadScene
   * Runs the constructor for the parent class, passing args
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments)
    this.bgURL = "static/assets/images/bg.png"
    this.groundURL = "static/assets/images/ground.png"
    this.avatarURL = "static/assets/images/avatar.png"
    this.squircleURL = "static/assets/images/squircle.png"
    this.squircleFillURL = "static/assets/images/squircle_fill.png"
  }

  /**
   * Runs once, before the create method for this scene
   */
  preload() {
    console.log("DemoLoadScene preload")
    super.preload()
    this.load.image("bg", this.bgURL)
    this.load.image("ground", this.groundURL)
    this.load.image("avatar", this.avatarURL)
    this.load.image("squircle", this.squircleURL)
    this.load.image("squircle_fill", this.squircleFillURL)
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
