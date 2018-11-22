//import Phaser from "phaser"
import RunScene from "../../src/scenes/run"

import Avatar from "../world/avatar"
import Ground from "../world/ground"
//import Button from "src/components/input/button"
import Modal from "src/components/display/modal"
import Dialogue from "src/components/display/dialogue"
//import TextField from "src/components/display/text_field"

/**
 * Run scene for the demo
 */
class DemoRunScene extends RunScene {

  /**
   * Constructor method for DemoRunScene
   * Runs the constructor for the parent class, passing args
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments)
  }

  /**
   * Runs once, before the create method for this scene
   * Configures the default pointer and keyboard input
   */
  preload() {
    super.preload()
    this.input.maxPointers = 1
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  /**
   * Runs once, before the first frame is rendered for this scene
   */
  create() {
    super.create()

    //set up cursor keys
    this.cursors = this.input.keyboard.createCursorKeys()

    // add bg
    let appWidth = this.app.config.width
    let appHeight = this.app.config.height
    this.bg = this.add.tileSprite(appWidth / 2, appHeight / 2, this.app.config.width, this.app.config.height, "bg")

    // add the ground
    this.ground = new Ground(this)

    // add the avatar
    this.avatar = new Avatar(this)

    // add collision between avatar and ground
    this.physics.add.collider(this.avatar, this.ground)

    // add modal
    this.modal = new Modal(
      this, false, true
    )

    // add dialogue
    this.dialogue = new Dialogue(
      this, 
      300, 150,
      400, 200,
      [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Suspendisse pulvinar fermentum semper.",
        "Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
        "Foobar..."
      ],
      24, "Helvetica",
      true, "letters", 25
    )
    console.log(this)

  }

  /**
   * Runs continuously, each time a single frame is rendered for this scene
   */
  update() {
    // add cursor key interaction
    if (this.cursors.left.isDown) {
      this.avatar.body.velocity.x -= 10
    }

    if (this.cursors.right.isDown) {
      this.avatar.body.velocity.x += 10
    }

    if (this.cursors.up.isDown) {
      this.avatar.body.velocity.y -= 10
    }

    super.update()

  }

}

export default DemoRunScene
