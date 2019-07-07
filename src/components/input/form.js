import _ from "lodash"

import Button from "src/components/input/button"
import Element from "src/components/element"

/**
 * A row of Form fields. For internal use only
 */
class FormRow extends Element {
  constructor(
    scene, form, showFieldDividers=false
  ) {

    // set up basic attributes
    super(
      scene,
      {
        x: 0, y: 0,
        width: 0,
        height: 0,
        hasOutline: false,
        hasFill: false,
      }
    )
    this.form = form
    this.fields = []
    this.fieldDividers = []
    this.showFieldDividers = showFieldDividers
    this.updateOn = _.union(
      this.updateOn, ["y", "innerHeight"]
    )
    this.updateCallback = this.formRowUpdate
  }

  formRowUpdate() {
    if (this.list && this.innerHeight) {
      let nextRow = this.form.nextRow(this)
      if (nextRow) {
        nextRow.y = this.y + this.innerHeight + this.form.rowPadding
      }
      if (this.bottomBorder) {
        this.bottomBorder.y = this.innerHeight
      }
      this.drawFieldDividers()
    }
  }

  drawFieldDividers() {
    if (!this.showFieldDividers) {
      return
    }
    _.forEach(this.fieldDividers, (fieldDivider) => { fieldDivider.destroy() })

    _.forEach(
      this.fields,
      (field) => {
        if (this.nextField(field)) {
          let fieldDivider = this.scene.add.line(
            field.x + field.width / 2, field.height / 2,
            0, 0,
            0, field.height,
            0xffffff, 0.4
          )
          this.add(fieldDivider)
          this.fieldDividers.push(fieldDivider)
        }
      }
    )
  }

  nextField(field) {
    // given a field, gets the next one in the form
    let fieldIndex = _.findIndex(this.fields, f => f.id == field.id)
    if (fieldIndex > -1) {
      let nextField = this.fields[fieldIndex + 1]
      return nextField
    } else {
      return null
    }
  }

  get innerHeight() {
    let tallestField = _.maxBy(this.fields, "height")
    if (tallestField) {
      return tallestField.height
    } else {
      return 0
    }
  }

}


/**
 * Groups related fields into a Form
 */
class Form extends Element {

  constructor(
    scene,
    {
      x, y,
      rows=[],
      rowPadding=20,
      onSubmit=function() {},
      name="Form Name",
      submitButtonConfig={
        x: 0,
        label: "Submit",
        width: 100,
        height: 60,
      }
    }
  ) {

    if (!rows.length) {
      throw("Cannot instantiate Form with no rows.")
    }

    super(
      scene, 
      {
        x: x, y: y,
        width: 0, height: 0,
        hasOutline: false,
        hasFill: false,
      }
    )
    this.submitButtonConfig = submitButtonConfig
    this.rowPadding = rowPadding
    this.fields = []
    this.rows = []
    _.forEach(rows, (row) => { this.addRow(row) })

    this.submitButton = new Button(
      scene,
      {
        x: this.submitButtonConfig.x,
        y: 0,
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
    this.addRow([this.submitButton])
    this.submitButton.activate()
    this.name = name
  }  

  addRow(row) {
    if (!row.length) {
      throw("Cannot add an empty form row.")
    }

    let formRow = new FormRow(this.scene, this)

    // add a row of fields
    _.forEach(
      row, (field) => {
        this.addField(field, formRow)
        field.setPosition(field.x + field.width / 2, field.height / 2)
      }
    )
    if (this.rows.length) {
      let lastRow = this.lastRow
      let tallestField = _.maxBy(lastRow.list, "height")
      formRow.y = lastRow.y + tallestField.height + this.rowPadding 
    }
    this.add(formRow)
    this.rows.push(formRow)
  }

  nextRow(row) {
    // given a row, gets the next one in the form
    let rowIndex = _.findIndex(this.rows, f => f.id == row.id)
    if (rowIndex > -1) {
      let nextRow = this.rows[rowIndex + 1]
      return nextRow
    } else {
      return null
    }
  }

  previousRow(row) {
    // given a row, gets the previous one in the form
    let rowIndex = _.findIndex(this.rows, f => f.id == row.id)
    let nextRow = this.rows[rowIndex - 1]
    return nextRow
  }

  get lastRow() {
    if (this.rows.length) {
      return this.rows[this.rows.length - 1]
    } else {
      return null
    }
  }

  addField(field, formRow) {
    if (formRow) {
      formRow.add(field)
      field.formRow = formRow
    } else {
      this.add(field)
    }
    this.fields.push(field)
    formRow.fields.push(field)
    field.form = this
  }

  nextField(field) {
    // given a field, gets the next one in the form
    let fieldIndex = _.findIndex(this.fields, f => f.id == field.id)
    if (fieldIndex > -1) {
      let nextField = this.fields[fieldIndex + 1]
      return nextField
    } else {
      return null
    }
  }

  previousField(field) {
    // given a field, gets the previous one in the form
    let fieldIndex = _.findIndex(this.fields, f => f.id == field.id)
    let nextField = this.fields[fieldIndex - 1]
    return nextField
  }

  get lastField() {
    if (this.fields.length) {
      return this.fields[this.fields.length - 1]
    } else {
      return null
    }
  }

}

export default Form
