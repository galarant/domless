import _ from "lodash"

import Button from "src/components/input/button"
import DropDownField from "src/components/input/dropdown_field"

/**
 * A rendered multi-select option element
 */
class MultiSelectOption extends Button {
  /**
   * Add docstring
   */
  constructor(
    scene, parentField,
    {
      x, y,
      width, height,
      label, styles, option
    }
  ) {
    super(
      scene,
      {
        x: x, y: y,
        width: width,
        height: height,
        label: label,
        styles: styles,
        hasFill: true,
        fillAlpha: 0.25,
        arcRadius: 5,
      }
    )
    this.option = option
    this.parentField = parentField
    this.callback = this.parentField.deselectOption
    this.callbackScope = this.parentField
    this.callbackArgs = [this]
  }
}

/**
 * A multi-select input field
 */
class MultiSelectField extends DropDownField {
  /**
    Add docstring
   */
  constructor(
    scene,
    {
      x, y,
      width=200,
      height=null,
      helpTextValue="Help Text",
      expandSpeed=375,
      styles={
        fontSize: 24,
        fontFamily: "Helvetica",
        padding: {top: 10, left: 10, right: 10, bottom: 10},
        //align: "left"
      },
      options=[
        {
          id: "option_1",
          value: "Option 1"
        },
        {
          id: "option_2",
          value: "Option 2"
        },
        {
          id: "option_3",
          value: "Option 3"
        },
      ],
      selectedOptions=[]
    }
  ) {

    super(
      scene,
      {
        x: x, y: y,
        width: width,
        height: height,
        styles: styles,
        options: options,
        expandSpeed: expandSpeed,
        helpTextValue: helpTextValue,
        selectedOption: null
      }
    )

    this.selectedOptions = selectedOptions
    this.selectedOptionElements = []
    this.selectedOptionPadding = 5
    this.selectedOptionStyles = {
      fontSize: this.styles.fontSize.substr(0, this.styles.fontSize.length - 2) - 5,
      fontFamily: this.styles.fontFamily,
      padding: {
        top: this.styles.padding.top - 5,
        left: this.styles.padding.left - 2,
        right: this.styles.padding.right - 2,
        bottom: this.styles.padding.bottom - 5,
      }
    }

    this.updateOn = _.union(this.updateOn, ["x", "y", "width", "height", "styles", "parentContainer", "options.length"])
    this.updateCallback = this.initMultiSelectComponents
    this.initMultiSelectComponents()
  }

  initMultiSelectComponents(diffObject, diffOld) {

    // don't do anything if I'm not yet initialized
    if (!this.initialized) {
      return
    }

    super.initDropDownComponents(diffObject, diffOld)

    // if my height changed, move the selectedOptionElements up
    if (diffObject && diffObject.height) {
      this.placeSelectedOptions()
    }

  }

  selectOption(optionElement, deactivate=true) {
    this.helpText.setAlpha(0)
    this.selectedOptions.push(optionElement.option)
    let
      testText = this.scene.add.text(0, 0, optionElement.option.value, this.selectedOptionStyles),
      elementWidth = testText.width,
      selectedOptionElement = new MultiSelectOption(
        this.scene, this,
        {
          x: 0, y: 0, 
          width: elementWidth, height: this.optionRowHeight - 10,
          label: optionElement.option.value,
          styles: this.selectedOptionStyles,
          option: optionElement.option
        }
      )
    testText.destroy()
    this.add(selectedOptionElement)
    //this.formRow.parentContainer.parentContainer.parentContainer.add(selectedOptionElement)
    this.selectedOptionElements.push(selectedOptionElement)
    this.placeSelectedOptions()
    this.bringToTop(selectedOptionElement)
    //this.scene.children.bringToTop(selectedOptionElement)
    if (this.options.length > 1) {
      _.remove(this.options, (option) => { return option.id === optionElement.option.id })
    } else {
      this.options = []
    }
    if (deactivate) {
      this.deactivate()
    }
  }

  deselectOption(optionElement) {
    // remove option from selectedOptions and selectedOptionElements
    _.remove(this.selectedOptions, (option) => { return option.id === optionElement.option.id })
    _.remove(this.selectedOptionElements, (option) => { return option.option.id === optionElement.option.id })

    optionElement.destroy()
    this.placeSelectedOptions()
    this.options.push(optionElement.option)
    
    if (this.selectedOptions.length === 0) {
      this.helpText.setAlpha(1)
    }

  }

  placeSelectedOptions() {
    let
      x = this.selectedOptionPadding - this.width / 2,
      y = this.selectedOptionPadding - this.height / 2,
      optionRows = 1,
      counter = 0

    _.forEach(
      this.selectedOptionElements,
      (selectedOptionElement) => {
        if (counter && selectedOptionElement.width + x > this.caratDivider.x) {
          y += this.optionRowHeight
          x = this.selectedOptionPadding - this.width / 2
          optionRows += 1
        }
        selectedOptionElement.x = x + selectedOptionElement.width / 2
        selectedOptionElement.y = y + selectedOptionElement.height / 2
        x = selectedOptionElement.x + selectedOptionElement.width / 2 + this.selectedOptionPadding
        counter += 1
      }
    )
    this.height = optionRows * this.optionRowHeight
    this.y = optionRows * this.optionRowHeight / 2
  }

  activate() {
    super.activate()
  }

  deactivate() {
    super.deactivate()
  }

}

export default MultiSelectField
