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
      arcRadius=15,
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

    // all elements start out inactive on initialization
    this.setActive(false)

    // handle update functionality
    this.updateOn = ["width", "height", "arcRadius"]
    this.updateCallback = this.initElementComponents
    this.scene.events.on("update", this.handleUpdate, this)

    this.initialized = true
    this.initElementComponents()

  }

  handleUpdate() {
    if (!_.isEqual(this.updateTriggers, _.map(this.updateOn, (key) => { return _.get(this, key) }))) {
      this.updateCallback()
      this.updateTriggers = _.map(this.updateOn, (key) => { return _.get(this, key) })
    }
  }

  initElementComponents() {
    
    // don't do anything if I'm not yet initialized
    if (!this.initialized) {
      return
    }

    this.generateFill()
    this.generateOutline()

  }


  // provides common activation behavior for all elements
  activate(force=false) {
    if (!this.active || force) {

      // show the element
      this.setAlpha(1)

      // activate within Phaser
      this.setActive(true)

      // accept pointer input
      this.setInteractive()

      // accept keyboard input
      if (this.key && this.handleKeyboardInput) {
        this.key.on("down", this.handleKeyboardInput, this)
      }
    }
  }

  // provides common deactivation behavior for all elements
  deactivate(hide=false, disableInteractive=true, force=false) {
    if (this.active || force) {
      // hide the element if desired
      if (hide) {
        this.setAlpha(0)
      }

      // deactivate within Phaser
      this.setActive(false)

      // disable pointer input
      if (disableInteractive) {
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
    let outlineKey = `outlineSquircle${this.width}${this.height}`

    if (!this.scene.textures.exists(outlineKey)) {
      this.scene.domlessGraphics
        .clear()
        .lineStyle(1.2, 0xffffff)
        .strokeRoundedRect(2, 2, this.width, this.height, this.arcRadius)
        .generateTexture(outlineKey, this.width + 4, this.height + 4)
        .clear()
    }

    // add the outline sprite to the container
    this.outline = this.scene.add.sprite(0, 0, outlineKey)
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
    let fillKey = `fillSquircle${this.width}${this.height}`
    
    if (!this.scene.textures.exists(fillKey)) {
      this.scene.domlessGraphics
        .clear()
        .fillStyle(0xffffff)
        .fillRoundedRect(2, 2, this.width, this.height, this.arcRadius)
        .generateTexture(fillKey, this.width + 4, this.height + 4)
        .clear()
    }

    // add the fill sprite to the container
    this.fill = this.scene.add.sprite(0, 0, fillKey)
    this.add(this.fill)

    // set the fill invisible if we are flashing it
    if (this.flashFill) {
      this.fill.setAlpha(0)
    }
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
