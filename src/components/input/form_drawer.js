import _ from "lodash"

import Element from "src/components/element"
import Drawer from "src/components/display/drawer"

/**
 * Creates a drawer component with a form as its content
 *
 */
class FormDrawer extends Drawer {
  /**
   * @param {object} scene - The Phaser.Scene to implement this in
   * @param {string} edge - The edge from which this drawer should slide in and out
   * @param {Form} form - The form we are going to use
   * @param {Number} sizeFactor - The size of the drawer as a percentage of screen width/height
   */
  constructor(
    scene,
    form,
    {
      edge="right",
      sizeFactor=1.0,
      styles={
        fontSize: 24,
        fontFamily: "Helvetica",
        padding: {top: 10, left: 10, right: 10, bottom: 10},
        align: "center"
      }
    } = {}
  ) {

    // set up the size
    let
      size = null,
      contentContainer = scene.add.container()

    if (["right", "left"].includes(edge)) {
      size = scene.game.config.width * Math.min(sizeFactor, 1.0)
    } else if (["top", "bottom"].includes(edge)) {
      size = scene.game.config.height * Math.min(sizeFactor, 1.0)
    } else {
      throw "Drawer edge must be one of the following: 'bottom', 'top', 'right' or 'left'."
    }
    
    // initialize with the form fields
    super(
      scene,
      {
        edge: edge,
        size: size,
        content: contentContainer,
      }
    )
    this.form = form
    this.form.drawer = this
    this.styles = styles
    this.content.setPosition((this.content.width - this.width) / 2, (this.content.height - this.height) / 2)
    this.addHeader()
    this.addFields()

    this.formHeader.debug()
    this.cameraShift = 0
    if (this.scene.scrollable) {
      this.initMinScroll = this.scene.scrollable.minScroll
      this.initMaxScroll = this.scene.scrollable.maxScroll
      this.initMetricHeight = this.scene.scrollable.scrollBarMetricHeight
    }
    this.deactivate()
  }

  get contentHeight() {
    return _.sumBy(this.content.list, "height")
  }

  /**
   * Add the form header to the drawer content
   */
  addHeader() {
    let
      xPos = 0,
      yPos = 0

    this.formHeader = new Element(this.scene, {outline: false}),
    this.formHeader.width = this.width
    this.formHeader.height = this.form.submitButton.height + this.styles.padding.top + this.styles.padding.bottom
    this.formHeader.setPosition(this.formHeader.width / 2, yPos + this.formHeader.height / 2)

    // add the cancel button to header
    this.cancelButton.setPosition((this.cancelButton.width - this.width) / 2 + this.styles.padding.left, yPos)
    xPos = this.cancelButton.x + this.cancelButton.width / 2
    this.formHeader.add(this.cancelButton)
    
    // add the form name to header
    this.formName = this.scene.add.text(xPos, yPos, this.form.name, this.styles)
    this.formName.x += this.formName.width / 2
    this.formName.setOrigin(0.5)
    this.formHeader.add(this.formName)

    // add the submit button to the header
    xPos = (this.width - this.form.submitButton.width) / 2 - this.styles.padding.right
    this.form.submitButton.outline.destroy()
    this.form.submitButton.setPosition(xPos, yPos)
    this.formHeader.add(this.form.submitButton)

    this.content.add(this.formHeader)
  }

  /**
   * Add the form fields to the drawer content
   */
  addFields() {
    let
      xPos = 0,
      yPos = this.formHeader.height,
      formFields = this.form.children.entries

    _.forEach(
      formFields,
      (formField) => {
        formField.outline.destroy()
        formField.width = this.width
        formField.setPosition(xPos + formField.width / 2, yPos + formField.height / 2)
        formField.initComponents()
        this.content.add(formField)
        yPos += formField.height
        formField.debug()
      }
    )
  }

  /**
   * Re-initialize the fields
   * Run this when we change anything about the container
   */
  initFields() {
    _.forEach(
      this.form.children.entries,
      (formField) => {
        formField.initComponents()
      }
    )
  }

  activate() {
    let camera = this.scene.cameras.main
    this.scene.add.tween(
      {
        targets: this.scene.scrollable,
        ease: Phaser.Math.Easing.Cubic.InOut,
        duration: 500,
        props: {
          minScroll: 0,
          maxScroll: Math.max(this.contentHeight, camera.height)
        }
      }
    )
    let activateCallback = () => {
      this.setScrollFactor(1, true)
      this.cameraShift = camera.scrollY
      camera.scrollY -= this.cameraShift
    }
    super.activate(activateCallback)
  }

  deactivate() {
    this.setScrollFactor(0, true)
    this.scene.add.tween(
      {
        targets: this.scene.scrollable,
        ease: Phaser.Math.Easing.Cubic.InOut,
        duration: 500,
        props: {
          minScroll: this.initMinScroll,
          maxScroll: this.initMaxScroll,
          scrollBarMetricHeight: this.initMetricHeight
        }
      }
    )
    if (this.scene.keyboardDrawer && this.scene.keyboardDrawer.active) {
      this.scene.keyboardDrawer.deactivate(null, this.cameraShift)
    } else {
      this.scene.cameras.main.scrollY += this.cameraShift
    }
    super.deactivate()
  }
}

export default FormDrawer
