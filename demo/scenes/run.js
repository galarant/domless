import Phaser from "phaser"

import Avatar from "../world/avatar"
import Ground from "../world/ground"

import TextField from "src/components/input/text_field"
import Form from "src/components/input/form"
import ScrollablePlugin from "src/plugins/scrollable"


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
    this.scrollable = new ScrollablePlugin(this, this.plugins)
    this.scrollable.start(-300, 300)
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

    // add textField as test
    let formFields = [
      new TextField(
        this,
        {
          x: 300,
          y: 200,
          height: 50,
          submitOnEnter: true,
          helpText: "First Field"
        }
      ),
      new TextField(
        this,
        {
          x: 300,
          y: 275,
          height: 50,
          submitOnEnter: true,
          helpText: "Second Field"
        }
      ),
      new TextField(
        this,
        {
          x: 300,
          y: 350,
          height: 50,
          submitOnEnter: true,
          helpText: "Third Field"
        }
      ),
      new TextField(
        this,
        {
          x: 300,
          y: 425,
          height: 50,
          submitOnEnter: true,
          helpText: "Fourth Field"
        }
      ),
    ]

    this.testForm = new Form(
      this,
      {
        fields: formFields
      }
    )

    this.debugText = this.add.text(10, 10).setText("Camera Debug").setScrollFactor(0)

    console.log(this)
    console.log("LISTENING FOR: ", this.events.eventNames())

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

    var
      cam = this.cameras.main,
      pointer = this.input.mousePointer
    
    this.debugText.setText(
      [
        "Camera " + " x: " + cam.scrollX + " y: " + cam.scrollY + "\n" +
        "Pointer " + " x: " + pointer.x + " y: " + pointer.y + "\n" +
        "FPS " + this.game.loop.actualFps
      ]
    )



  }

}

export default DemoRunScene
