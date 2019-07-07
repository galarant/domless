import _ from "lodash"
import Phaser from "phaser"

/**
 * Base class for a domless element
 * Most display elements except modals should ultimately inherit from this class
 */
class Element extends Phaser.GameObjects.Container {
  /**
   * @param {object} scene - The container Phaser.Scene
   * @param {number} x - The x position of the Element in the game world
   * @param {number} y - The y position of the Element in the game world
   */
  constructor(scene,
    { 
      x, y,
      width=60,
      height=60,
      hasOutline=true,
      hasFill=false,
      outlineColor=0xffffff,
      fillColor=0xffffff,
      fillAlpha=1,
      arcRadius=15,
      initComponents=false,
      interactive=false,
      responsive=true
    } = {}
  ) {

    super(scene, x, y)
    scene.sys.displayList.add(this)

    // set up domless graphics engine in the scene if it doesn't already exist
    if (!scene.domlessGraphics) {
      scene.domlessGraphics = scene.add.graphics()
    }

    this.id = _.uniqueId("domless_")
    this.width = width
    this.height = height
    this.arcRadius = arcRadius
    this.hasOutline = hasOutline
    this.hasFill = hasFill
    this.outlineColor = outlineColor
    this.fillColor = fillColor
    this.fillAlpha = fillAlpha
    this.responsive = responsive
    this.interactive = interactive

    // all elements start out inactive on initialization
    this.setActive(false)

    // handle update functionality
    this.updateOn = ["width", "height", "arcRadius"]
    this.updateCallback = this.initElementComponents
    this.scene.events.on("update", this.handleUpdate, this)
    if (this.interactive) {
      this.scene.input.on("gameobjectup", this.handleGameObjectUp, this)
      this.scene.input.on("pointerup", this.handlePointerUp, this)
    }

    this.initialized = true
    if (initComponents) {
      this.initElementComponents()
    }

  }

  initElementComponents(diffObject) {
    
    // don't do anything if I'm not yet initialized
    if (!this.initialized) {
      return
    }

    // regenerate the fill and outline
    if (!this.outline || (diffObject && (diffObject.width || diffObject.height))) {
      this.generateOutline()
    }
    if (!this.fill || (diffObject && (diffObject.width || diffObject.height))) {
      this.generateFill()
      if (this.fill) {
        this.sendToBack(this.fill)
      }
    }
    if (this.input && diffObject && (diffObject.width || diffObject.height)) {
      this.input.hitArea.setSize(this.width, this.height)
    }

    this.updateTriggers = []
    _.forEach(this.updateOn, (key) => { this.updateTriggers.push({[key]: _.get(this, key)}) })
  }

  // runs on each new frame render
  handleUpdate() {
    if (!this.responsive) {
      return
    }
    let currentValues = []
    _.forEach(this.updateOn, (key) => { currentValues.push({[key]: _.get(this, key)}) })
    let diff = _.differenceWith(currentValues, this.updateTriggers, _.isEqual)
    if (diff.length) {
      let
        diffObject = {},
        diffOld = {}
      _.forEach(diff, (d) => { _.merge(diffObject, d ) })
      _.forEach(this.updateTriggers, (d) => { _.merge(diffOld, d ) })
      this.updateCallback(diffObject, diffOld)
      this.updateTriggers = []
      _.forEach(this.updateOn, (key) => { this.updateTriggers.push({[key]: _.get(this, key)}) })
    }
  }

  // interactive functionality for gameobjectup
  // there is a bug with Phaser's container handling and pointer inputs
  // so we should really use this function when possible
  handleGameObjectUp(pointer, currentlyOver, event) {
    // don't bother with the rest if I have no handlers
    if (!this.handleGameObjectUpIn && !this.handleGameObjectUpOut) {
      return
    }

    // don't do anything if we were just dragging
    if (pointer.isDragging) {
      return
    }

    // handle pointer input when it's inside or outside the element
    if (currentlyOver === this) {
      if (this.handleGameObjectUpIn) {
        this.handleGameObjectUpIn(pointer, currentlyOver, event)
      }
    } else {
      if (this.handleGameObjectUpOut) {
        this.handleGameObjectUpOut(pointer, currentlyOver, event)
      }
    }
  }

  // interactive functionality for pointerup
  // there is a bug with Phaser's container handling and pointer inputs
  // so we should really use this function when possible
  handlePointerUp(pointer, currentlyOver) {
    // don't bother with the rest if I have no handlers
    if (!this.handlePointerUpIn && !this.handlePointerUpOut) {
      return
    }

    // don't do anything if we were just dragging
    if (pointer.isDragging) {
      return
    }

    // handle pointer input when it's inside or outside the element
    if (_.includes(currentlyOver, this)) {
      if (this.handlePointerUpIn) {
        this.handleGameObjectUpIn(pointer, currentlyOver)
      }
    } else {
      if (this.handlePointerUpOut) {
        this.handleGameObjectUpOut(pointer, currentlyOver)
      }
    }
  }

  // provides common activation behavior for all elements
  activate(force=false) {
    if (!this.active || force) {

      // show the element
      this.setAlpha(1)

      // activate within Phaser
      this.setActive(true)

      // accept pointer input
      if (this.interactive) {
        this.setInteractive()
      }

      // accept keyboard input
      if (this.key && this.handleKeyboardInput) {
        this.key.on("down", this.handleKeyboardInput, this)
      }
    }
  }

  // provides common deactivation behavior for all elements
  deactivate(hide=false, disableInteractive=false, force=false) {
    if (this.active || force) {
      // hide the element if desired
      if (hide) {
        this.setAlpha(0)
      }

      // deactivate within Phaser
      this.setActive(false)

      // disable pointer input
      if (this.interactive && disableInteractive) {
        this.disableInteractive()
      }

      // disable keyboard input
      if (this.key && this.handleKeyboardInput) {
        this.key.removeListener("down", this.handleKeyboardInput, this)
      }
    }
  }

  /**
   * generate an outline
   * destroy and replace the current outline if it exists
   */
  generateOutline() {
    // don't do anything if the element doesn't have an outline
    if (!this.hasOutline) {
      return
    }

    // redraw the outline texture
    if (this.outline) {
      this.outline.destroy()
    }
    let outlineKey = `outlineSquircle${this.width}${this.height}arc${this.arcRadius}`

    if (!this.scene.textures.exists(outlineKey)) {
      this.scene.domlessGraphics
        .clear()
        .lineStyle(1.2, this.outlineColor)
        .strokeRoundedRect(2, 2, this.width, this.height, this.arcRadius)
        .generateTexture(outlineKey, this.width + 4, this.height + 4)
        .clear()
    }
    this.outline = this.scene.add.sprite(0, 0, outlineKey)

    // add the outline sprite to the container
    this.add(this.outline)
  }

  /**
   * generate a fill
   * destroy and replace the current fill if it exists
   */
  generateFill() {
    // don't do anything if the element doesn't have a fil
    if (!this.hasFill) {
      return
    }

    // redraw the fill texture
    if (this.fill) {
      this.fill.destroy()
    }
    let fillKey = `fillSquircle${this.width}${this.height}arc${this.arcRadius}`
    
    if (!this.scene.textures.exists(fillKey)) {
      this.scene.domlessGraphics
        .clear()
        .fillStyle(this.fillColor)
        .fillRoundedRect(2, 2, this.width, this.height, this.arcRadius)
        .generateTexture(fillKey, this.width + 4, this.height + 4)
        .clear()
    }

    // add the fill sprite to the container
    this.fill = this.scene.add.sprite(0, 0, fillKey)
    this.add(this.fill)

    // set the fill alpha
    this.fill.setAlpha(this.fillAlpha)
  }

  /**
   * Recursively runs setScrollFactor on the element
   * And its entire child tree
   */
  setScrollFactor(factor, recurse=false) {
    super.setScrollFactor(factor)
    if (recurse) {
      _.forEach(
        this.list,
        (child) => {
          child.setScrollFactor(factor, true)
        }
      )
    }
  }

  /**
   * Generate a randomly colored Rectangle on this element
   * to debug position / size etc
   */
  debug() {
    if (this.debugRectangle) {
      this.debugRectangle.destroy()
    }
    this.debugRectangle = this.scene.add.rectangle(
      0, 0,
      this.width,
      this.height,
      Phaser.Display.Color.RandomRGB().color,
      0.3
    )
    this.add(this.debugRectangle)
  }

}

export default Element
