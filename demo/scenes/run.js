import Phaser from "phaser"

import Avatar from "../world/avatar"
import Ground from "../world/ground"
import Button from "src/components/input/button.js"


/**
 * Run scene for the demo
 */
class DemoRunScene extends Phaser.Scene {

  /**
   * Constructor method for DemoRunScene
   * Runs the constructor for the parent class, passing args
   * Returns a new instance of this class
   */
  get app() {
    return this.game
  }

  constructor() {
    super(...arguments)
  }

  /**
   * Runs once, before the create method for this scene
   * Configures the default pointer and keyboard input
   */
  preload() {
    this.input.maxPointers = 1
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  /**
   * Runs once, before the first frame is rendered for this scene
   */
  create() {

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

    this.button = new Button(
      this,
      {
        x: 200, y: 200,
      }
    )

    this.button2 = new Button(
      this,
      {
        x: 300, y: 300,
        callback: function() {
          this.button.stretch({targetWidth: 120, targetHeight: 120})
        },
        callbackScope: this
      }
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

  }

}

export default DemoRunScene
