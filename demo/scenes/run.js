import Phaser from "phaser"

import Avatar from "../world/avatar"
import Ground from "../world/ground"

import TextField from "src/components/input/text_field"
import MultiSelectField from "src/components/input/multiselect_field"
import DropDownField from "src/components/input/dropdown_field"
import Form from "src/components/input/form"
import FormDrawer from "src/components/input/form_drawer"
import Button from "src/components/input/button"
import ScrollablePlugin from "src/plugins/scrollable"
import DebugText from "src/components/debug_text"


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
    this.scrollable.start(-300, 800, ["drag", "wheel"])
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

    // add debug text
    this.debugText = new DebugText(this)



    // add textField as test
    let formRows = [
      [
        new DropDownField(
          this,
          {
            x: 0,
            width: 200,
            helpTextValue: "DropDown Field",
          }
        ),
        new TextField(
          this,
          {
            x: 200,
            height: 50,
            width: 200,
            helpTextValue: "Text Field 1",
          }
        ),
      ],
      [
        new MultiSelectField(
          this,
          {
            x: 0,
            width: 200,
            helpTextValue: "MultiSelect Field"
          }
        ),
        new TextField(
          this,
          {
            x: 200,
            height: 50,
            width: 200,
            helpTextValue: "Text Field 2",
          }
        ),
      ],
      [
        new TextField(
          this,
          {
            x: 0,
            height: 100,
            width: 400,
            helpTextValue: "Text Field 3",
          }
        ),
      ]
    ]

    this.testForm = new Form(
      this,
      {
        x: 100, y: 250,
        rows: formRows,
        submitButtonConfig: {
          x: 300,
          width: 100,
          height: 60,
          label: "Submit",
        }
      }
    )

    //this.formContainer = this.add.container(100, 100, [this.testForm])


    this.formDrawer = new FormDrawer(
      this, this.testForm
    )

    this.openFormButton = new Button(
      this,
      {
        x: 100, y: 100, label: "form",
        callback: this.openFormDrawer,
        callbackScope: this
      }
    )
    this.openFormButton.testProp = true


    console.log(this)

  }

  openFormDrawer() {
    this.formDrawer.activate()
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
