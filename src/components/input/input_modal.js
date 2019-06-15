import Phaser from "phaser"
import TextField from "./text_field"
import Keyboard from "./keyboard"
import Button from "./button"
import Modal from "../display/modal.js"

/**
 * Pauses all other scenes, dims the screen and brings up a modal with a keyboard
 */
class InputModal extends Modal {
  /**
   * @param {object} game - Phaser.Game
   */
  constructor(
    calledFrom,
    {
      key="domlessModal",
      deactivateEvent=key + "Deactivate",
      inputField=null
    } = {}
  ) {

    //basic initialization
    super(
      calledFrom,
      {
        defaultDeactivate: false,
        key: key,
        deactivateEvent: deactivateEvent
      }
    )

    //destroy default content and set up keyboard content
    this.content.destroy()
    this.content = []

    // use inputField if one is supplied
    // otherwise create a textField and input button
    if (inputField) {
      this.inputField = inputField
      this.textField = this.inputField.textField
      this.sys.displayList.add(this.inputField)
      this.sys.displayList.add(this.textField)
    } else {
      this.textField = new TextField(
        this, 
        {
          x: this.width / 2 - this.submitButton.width / 2 - 10, y: this.height / 6,
          width: this.width * 0.75, height: this.height / 4
        }
      )
      this.content.push(this.textField)
      this.content.push(this.submitButton)
    }

    this.submitButton = new Button(
      this,
      {
        x: 0, y: 0,
        width: this.width / 12, height: this.width / 12,
        label: "\u27A4", keyCode: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        hasFill: false, hasOutline: false,
        eventName: this.deactivateEvent, eventArgs: []
      }
    )
    this.submitButton.x = this.textField.x + this.textField.width / 2 + this.submitButton.width / 2 + 20
    this.submitButton.y = this.textField.y

    this.keyboard = new Keyboard(this)

    this.content.push(this.keyboard)
  }

  activate() {
    if (this.inputField) {
      let tweenTimeline = this.tweens.timeline({
        duration: 500,
        ease: Phaser.Math.Easing.Cubic.InOut,
        tweens: [
          {
            targets: this.inputField,
            x: 10 + this.inputField.width / 2,
            y: this.inputField.height / 2 + this.inputField.label.height
          },
        ]
      })
      tweenTimeline.setCallback(
        "onComplete",
        function() {
          console.log("running timeline complete callback")
          this.inputField.stretch(
            {
              x: this.inputField.outline.width * 2,
              y: this.inputField.outline.height * 2
            }, this
          )
        }, [], this
      )
    }
    super.activate()
  }

  deactivate() {
    // un-dim the screen
    this.returnValue = this.textField.content
    super.deactivate()
  }

}

export default InputModal
