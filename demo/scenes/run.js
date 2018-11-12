//import Phaser from "phaser"
import RunScene from "../../src/scenes/run"

import Avatar from "../world/avatar"
import Ground from "../world/ground"
import Button from "src/components/input/button"
import Modal from "src/components/display/modal"
import TextDisplay from "src/components/display/text_display"

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
    this.modal = new Modal(this, false, true)

    // add button
    let buttonWidth = 100
    this.button = new Button(
      this,
      100, 100,
      buttonWidth, buttonWidth, "OK", false,
      null, null,
      function() {
        this.scene.modal.activate()
      }
    )

    this.textDisplay = new TextDisplay(
      this, 
      300, 300,
      400, 200,
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In id porta augue. Etiam sollicitudin metus vel ipsum interdum congue. Morbi ac lacus metus. Morbi et velit tincidunt, suscipit quam eget, pretium sem. Nunc in aliquam libero. Aliquam cursus tortor lectus.",
      24, "Helvetica",
      true, true, "words"
    )

    this.add.tween({
      targets: [this.button],
      alpha: 0,
      duration: 250,
      yoyo: true,
      repeat: -1
    })

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
