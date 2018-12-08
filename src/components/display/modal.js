import _ from "lodash"
import Phaser from "phaser"

/**
 * Pauses all other scenes, dims the screen and brings up a modal with variable content
 */
class Modal extends Phaser.Scene {
  /**
   * @param {object} game - Phaser.Game
   */
  constructor(
    calledFrom,
    {
      defaultDeactivate=true,
      key="domlessModal",
      content="PAUSED",
      deactivateEvent=key + "Deactivate"
    } = {}
  ) {

    //basic initialization
    super(key)
    let game = calledFrom.game
    game.scene.add(key, this)
    this.key = key
    this.calledFrom = calledFrom.key
    this.content = content
    this.width = this.game.config.width
    this.height = this.game.config.height
    this.dimmerRect = this.add.rectangle(
      this.width / 2, this.height / 2,
      this.width, this.height,
      0x000000, 1
    )
    this.deactivateEvent = deactivateEvent

    //show the content, centered on the screen
    if (typeof(content) === "string") {
      this.content = this.add.text(0, 0, this.content)
      this.content.setOrigin(0.5, 0.5)
      this.content.setFontSize(this.width / 20)
      this.content.setFontFamily("Helvetica")
      this.content.setPosition(this.width / 2, this.height / 2)
    } else {
      this.content = content 
      this.content.setPosition(this.width / 2, this.height / 2)
    }

    this.content.setAlpha(0)

    // set up default deactivation behavior
    // deactivates the modal on tap or space bar
    if (defaultDeactivate) {
      this.input.keyboard.on("keydown_SPACE", function() {
        this.events.emit(this.deactivateEvent)
      }, this)
      this.input.on("pointerdown", function () {
        this.events.emit(this.deactivateEvent)
      }, this)
    }

    // set up listener for deactivate event
    this.events.on(this.deactivateEvent, this.deactivate, this)

  }

  pauseOtherScenes(pause=true) {
    /**
     * pause or unpause all other scenes except this one
     */
    let game = this.game
    let thisSceneKey = this.scene.key
    _.forEach(game.scene.keys, function(scene, sceneKey) {
      if (sceneKey !== thisSceneKey && scene.scene.isVisible()) {
        if (pause) {
          scene.scene.pause()
          if (scene.world) {
            scene.physics.world.pause()
          }
        } else {
          scene.scene.resume()
          if (scene.world) {
            scene.physics.world.resume()
          }
        }
      }
    })
  }

  activate() {
    // pause all other scenes in the game
    this.pauseOtherScenes(true)
    this.returnValue = null

    // bring this scene to the top and start it
    if (!this.scene.isSleeping()) {
      this.scene.start()
    } else {
      this.scene.wake()
    }

    // dim the screen
    this.dimmerRect.alpha = 0
    this.dimTween = this.add.tween({
      targets: [this.dimmerRect],
      ease: "Linear",
      duration: 250,
      alpha: 0.8
    })
    this.dimTween.setCallback("onComplete", function() {
      this.content.setAlpha(1)
    }, [], this)

  }

  deactivate() {
    // un-dim the screen
    if (this.isKeyboardModal) {
      this.returnValue = this.textDisplay.content
    }
    this.content.setAlpha(0)
    this.unDimTween = this.add.tween({
      targets: [this.dimmerRect],
      ease: "Linear",
      duration: 250,
      alpha: 0,
    })
    this.unDimTween.setCallback(
      "onComplete", function() {
        this.pauseOtherScenes(false)
        this.scene.sleep()
      },
      [], this
    )
  }

}

export default Modal
