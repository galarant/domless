import Phaser from "phaser"
import _ from "lodash"

import Button from "src/components/input/button"

/**
 * Groups related fields into a Form
 */
class Form extends Phaser.GameObjects.Group {

  constructor(
    scene,
    {
      fields=[],
      onSubmit=function() {},
      submitButtonConfig={
        label: "Submit",
        width: 100,
        height: 60,
        topPadding: 20
      }
    }
  ) {

    if (!fields) {
      throw("Cannot instantiate Form with no fields.")
    }

    super(scene, fields)

    let maxX = _.max(_.map(fields, field => field.x - field.displayOriginX + field.width))
    let maxY = _.max(_.map(fields, field => field.y - field.displayOriginY + field.height))

    this.submitButton = new Button(
      scene,
      {
        x: maxX - submitButtonConfig.width / 2,
        y: maxY + submitButtonConfig.height / 2 + submitButtonConfig.topPadding,
        width: submitButtonConfig.width,
        height: submitButtonConfig.height,
        label: submitButtonConfig.label,
        eventName: "domlessFormSubmit",
        eventArgs: [this],
        callback: onSubmit,
        callbackScope: this,
        stopPropagation: false
      }
    )
    this.submitButton.activate()
    fields.forEach(field => {field.form = this})
  }  

  nextField(field) {
    // given a field, gets the next one in the form
    let fieldIndex = _.findIndex(this.children.entries, f => f.id == field.id)
    let nextField = this.children.entries[fieldIndex + 1]
    return nextField
  }

  previousField(field) {
    // given a field, gets the previous one in the form
    let fieldIndex = _.findIndex(this.children.entries, f => f.id == field.id)
    let nextField = this.children.entries[fieldIndex - 1]
    return nextField
  }

}

export default Form
