import Phaser from "phaser"
import TextField from "./text_field"
import Keyboard from "../input/keyboard"
import Button from "../input/button"
import Modal from "./modal.js"

/**
 * Pauses all other scenes, dims the screen and brings up a modal with variable content
 */
class KeyboardModal extends Modal {
  /**
   * @param {object} game - Phaser.Game
   */
  constructor(
    calledFrom,
    {
      key="domlessModal",
      deactivateEvent=key + "Deactivate"
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
    this.content = this.add.container(0, 0)
    this.submitButton = new Button(
      this,
      {
        x: 0, y: 0,
        width: this.width / 12, height: this.width / 12, fontSize: this.width / 12,
        label: "\u27A4", keyCode: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        fill: false, outline: false,
        eventName: this.deactivateEvent, eventArgs: []
      }
    )
    this.textDisplay = new TextField(
      this, 
      {
        x: this.width / 2 - this.submitButton.width / 2 - 10, y: this.height / 6,
        width: this.width * 0.75, height: this.height / 4
      }
    )
    this.submitButton.x = this.textDisplay.x + this.textDisplay.width / 2 + this.submitButton.width / 2 + 20
    this.submitButton.y = this.textDisplay.y
    this.keyboard = new Keyboard(this)
    this.content.add(this.textDisplay)
    this.content.add(this.submitButton)
    this.content.add(this.keyboard)
  }

  deactivate() {
    // un-dim the screen
    this.returnValue = this.textDisplay.content
    super.deactivate()
  }

}

export default KeyboardModal