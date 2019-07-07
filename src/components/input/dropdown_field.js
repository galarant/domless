import _ from "lodash"

import Element from "src/components/element"
import Button from "src/components/input/button"

/**
 * A dropdown input field
 */
class DropDownField extends Element {
  /**
   * @param {object} scene - The container Phaser.Scene
   * @param {number} x - The x position of the field
   * @param {number} y - The y position of the field
   * @param {number} [width=200] - Display width in pixels
   * @param {number} [height=400] - Display height in pixels
   * @param {string} [content=""] - The text displayed
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
          id: "option_null",
          value: null
        },
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
      selectedOption={id: "option_null", value: null}
    }
  ) {

    // if we didn't pass a height, set it based on font size
    if (height === null) {
      let testText = scene.add.text(0, 0, "II", styles)
      height = testText.height
      testText.destroy()
    }

    super(
      scene,
      {
        x: x, y: y,
        width: width,
        height: height
      }
    )

    this.helpTextValue = helpTextValue
    this.options = options
    this.styles = styles
    this.expandSpeed = expandSpeed
    this.optionElements = []
    this.optionRowHeight = this.height
    this.maskGraphics = this.scene.add.graphics()
    this.optionsOpen = false

    // activate on click inside / deactivate on click outside
    this.scene.input.on("pointerup", this.pointerListener, this)

    this.setInteractive()
    this.updateOn = _.union(
      this.updateOn,
      [
        "x", "y", "width", "height", "styles",
        "options.length", "localTransform.tx", "localTransform.ty",
      ]
    )
    this.updateCallback = this.initDropDownComponents
    this.initDropDownComponents()
    if (selectedOption) {
      let selectedOptionElement = _.find(
        this.optionElements,
        (optionElement) => {
          return optionElement.option.id === selectedOption.id
        }
      )
      this.selectOption(selectedOptionElement, false)
    }
  }

  initDropDownComponents(diffObject, diffOld) {

    // don't do anything if I'm not yet initialized
    if (!this.initialized) {
      return
    }

    super.initElementComponents(diffObject, diffOld)

    // set up help text
    if (this.helpText) {
      this.helpText.setStyle(this.styles)
      this.helpText.setPosition(-this.width / 2, -this.height / 2)
    } else {
      this.helpText = this.scene.add.text(-this.width / 2, -this.height / 2, this.helpTextValue, this.styles)
      this.helpText.setColor("gray")
      this.add(this.helpText)
    }

    // set up selected element
    if (this.selectedOptionElement) {
      this.selectedOptionElement.setStyle(this.styles)
      this.selectedOptionElement.setPosition(-this.width / 2, -this.height / 2)
    } else {
      this.selectedOptionElement = this.scene.add.text(-this.width / 2, -this.height / 2, "", this.styles)
      this.add(this.selectedOptionElement)
    }

    // set up carat
    if (this.carat) {
      this.carat.setStyle(this.styles)
      this.caratDivider.destroy()
    } else {
      this.carat = this.scene.add.text(0, 0, "\u2BC8", this.styles)
      this.carat.setOrigin(0.5, 0.5)
      this.add(this.carat)
    }
    this.caratDivider = this.scene.add.line(
      this.width / 2 - this.carat.width, 0,
      0, 0,
      0, this.height,
      0xffffff, 1
    )
    this.caratDivider.setLineWidth(0.5)
    this.add(this.caratDivider)
    this.carat.setPosition((this.width - this.carat.width) / 2, 0)

    // if my y or height changed, move the form row below me
    if (diffObject && (diffObject.height || diffObject.y) && this.formRow) {
      let nextRow = this.form.nextRow(this.formRow)
      if (nextRow) {
        let tallestField = _.maxBy(this.formRow.list, "height")
        nextRow.y = this.formRow.y + tallestField.height + this.form.rowPadding
      }
    }

    // set up the options container
    if (this.optionsContainer && diffObject && (diffObject.height || diffObject.y)) {
      this.optionsContainer.setX(0)
      this.optionsContainer.width = this.width
      this.optionsContainer.generateOutline()

      _.forEach(
        this.optionElements,
        (optionElement) => {
          optionElement.width = this.width
          optionElement.label.setStyle(this.styles)
          optionElement.label.setPadding(this.styles.padding)
          optionElement.label.x = (optionElement.label.width - optionElement.width ) / 2
        }
      )
    } 
    if (!this.optionsContainer) {
      this.optionsContainer = new Element(
        this.scene,
        {
          x: 0, y: this.height / 2 + 5,
          width: this.width, height: 0,
          hasFill: true, fillColor: 0x000000
        }
      )
      this.add(this.optionsContainer)
      this.setOptionsContainer()
      this.deactivateOptions()
    }

    if (diffObject && (diffObject["options.length"] !== undefined || diffObject.width)) {
      this.setOptionsContainer()
    }

    this.repositionMask()

  }

  repositionMask() {
    // reposition the mask
    let
      maskX = this.localTransform.tx - this.optionsContainer.width / 2 - 1,
      maskY = this.localTransform.ty + this.optionsContainer.y - this.optionsContainer.height * 1.5 - 3

    if (this.optionsOpened) {
      this.maskGraphics.setPosition(maskX, maskY + this.optionsContainer.height + 2)
    } else {
      this.maskGraphics.setPosition(maskX, maskY)
    }
  }

  setOptionsContainer() {
    this.optionsContainer.y = this.height / 2 + 5
    this.optionsContainer.height = this.optionRowHeight * this.options.length
    _.forEach(
      this.optionElements,
      (e) => {
        e.updateCallback = _.noop
        e.destroy()
      }
    )
    this.optionElements = []
    let
      yPos = (this.optionRowHeight - this.optionsContainer.height) / 2,
      counter = 0
    _.forEach(
      this.options,
      (option) => {
        let fillAlpha = 0.1
        if (counter % 2) {
          fillAlpha = 0.2
        }
        let optionElement = new Button(
          this.scene,
          {
            x: 0, y: yPos,
            width: this.width, height: this.optionRowHeight,
            hasOutline: false, label: option.value,
            callback: this.selectOption, callbackScope: this,
            fillAlpha: fillAlpha, arcRadius: 0
          }
        )
        optionElement.label.setStyle(this.styles)
        optionElement.label.setPadding(this.styles.padding)
        optionElement.label.x = (optionElement.label.width - optionElement.width ) / 2
        optionElement.callbackArgs = [optionElement]
        optionElement.option = option
        optionElement.flashFill = _.noop
        this.optionsContainer.add(optionElement)
        this.optionElements.push(optionElement)
        yPos += optionElement.height
        counter += 1
      }
    )
    this.optionsContainer.generateOutline()
    this.optionsContainer.y += this.optionsContainer.height / 2

    // set up a mask on the options container
    // this will hide the container normally, and reveal it on activation
    
    this.maskGraphics
      .clear()
      .fillStyle(0x000000, 0.25)
      .fillRoundedRect(
        0, 0,
        this.optionsContainer.width + 2, this.optionsContainer.height + 2, 15
      )

    if (!this.optionsMask) {
      this.optionsMask = this.createGeometryMask(this.maskGraphics)
      this.optionsContainer.setMask(this.optionsMask)
    }
  }

  pointerListener(pointer, currentlyOver) {
    // don't do anything if we were just dragging
    // or if we're opening / closing the dropdown
    if (
      pointer.isDragging || 
      (this.activateTween && this.activateTween.progress > 0 && this.activateTween.progress < 1)
    ) {
      return
    }

    // don't do anything if we are tweening the keyboard drawer
    if (
      this.scene.keyboardDrawer &&
      this.scene.keyboardDrawer.slideTween &&
      this.scene.keyboardDrawer.slideTween.progress > 0 &&
      this.scene.keyboardDrawer.slideTween.progress < 1
    ) {
      return
    }

    // activate on click inside this, deactivate on click outside
    if (_.includes(currentlyOver, this) && !this.active) {
      this.activate()
    } else {
      this.deactivate()
    }
  }

  selectOption(optionElement, deactivate=true) {
    if (optionElement.option && optionElement.option.value) {
      this.selectedOption = optionElement.option
      this.selectedOptionElement.setText(optionElement.option.value)
      this.helpText.setAlpha(0)
    } else {
      this.selectedOption = optionElement.option
      this.selectedOptionElement.setText("")
      this.helpText.setAlpha(1)
    }
    if (deactivate) {
      this.selectedOptionElement.y = optionElement.y + this.optionsContainer.y - this.height / 2
      this.bringToTop(this.selectedOptionElement)
      this.deactivate()
    }
  }

  activate() {
    if (!this.active) {
      console.log("activating dropDown ", this.id)
      this.scene.children.bringToTop(this)
      if (this.formRow) {
        this.formRow.parentContainer.bringToTop(this.formRow)
      }
      if (this.parentContainer) {
        this.parentContainer.bringToTop(this)
      }
      
      // tween the geometry mask
      this.scene.add.tween(
        {
          targets: this.maskGraphics,
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: this.expandSpeed,
          props: {
            y: `+=${this.optionsContainer.height + 2}`
          }
        }
      )
      // tween the carat
      this.activateTween = this.scene.add.tween(
        {
          targets: this.carat,
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: this.expandSpeed,
          props: {
            angle: 90
          }
        }
      )

      this.activateTween.setCallback(
        "onComplete", function() {
          this.optionsOpened = true
        }, [], this
      )
      
      // tween the optionElements
      let
        counter = 0,
        delay = this.expandSpeed / this.optionElements.length

      _.forEach(
        this.optionElements,
        (optionElement) => {
          optionElement.setAlpha(0)
          this.scene.add.tween(
            {
              targets: optionElement,
              ease: Phaser.Math.Easing.Cubic.InOut,
              duration: this.expandSpeed,
              props: {
                alpha: 1
              },
              delay: (counter + 0.5) * delay
            }
          )
          counter += 1
        }
      )
      if (this.options.length) {
        this.activateOptions()
      }
      super.activate()
    }
  }

  deactivate() {
    if (this.active) {
      console.log("deactivating dropDown ", this.id)
      this.closeTween = this.scene.tweens.timeline(
        {
          tweens: [
            {
              targets: this.optionElements,
              ease: Phaser.Math.Easing.Cubic.InOut,
              duration: this.expandSpeed,
              props: {
                alpha: 0
              }
            },
            {
              targets: this.selectedOptionElement,
              ease: Phaser.Math.Easing.Cubic.InOut,
              duration: this.expandSpeed,
              props: {
                y: -this.height / 2
              },
              offset: `-=${this.expandSpeed / 2}`
            },
            {
              targets: this.maskGraphics,
              ease: Phaser.Math.Easing.Cubic.InOut,
              duration: this.expandSpeed,
              props: {
                y: `-=${this.optionsContainer.height + 2}`
              },
              offset: `-=${this.expandSpeed / 2}`
            }
          ]
        }
      )

      this.closeTween.setCallback(
        "onComplete", function() {
          this.optionsOpened = false
          this.deactivateOptions()
          this.repositionMask()
        }, [], this
      )

      this.activateTween = this.scene.add.tween(
        {
          targets: this.carat,
          ease: Phaser.Math.Easing.Cubic.InOut,
          duration: this.expandSpeed,
          props: {
            angle: 0
          }
        }
      )
      super.deactivate()
    }
  }

  // enable interactivity of options and container
  activateOptions() {
    this.optionsContainer.activate()
    this.optionsContainer.setAlpha(1)
    _.forEach(
      this.optionElements,
      (optionElement) => {
        optionElement.activate()
        optionElement.setAlpha(0)
      }
    )
  }

  // disable interactivity of options and container
  deactivateOptions() {
    this.optionsContainer.deactivate(false, true, true)
    this.optionsContainer.setAlpha(0)
    _.forEach(
      this.optionElements,
      (optionElement) => {
        optionElement.deactivate(false, true, true)
      }
    )
    
  }

}

export default DropDownField
