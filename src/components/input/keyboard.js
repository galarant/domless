import Phaser from "phaser"
import Button from "./button"
import _ from "lodash"

/**
 * Draws an interactive keyboard in the display
 */
class Keyboard extends Phaser.GameObjects.Container {
  /**
   * @param {object} scene - The container Phaser.Scene
   * @param {number} [x=scene.game.config.width/2] - The x position of the Keyboard
   * @param {number} [y=scene.game.config.height/2] - The y position of the Keyboard
   * @param {number} [width=scene.game.config.width] - Display width in pixels
   * @param {number} [height=scene.game.config.height] - Display height in pixels
   */
  constructor(
    scene,
    x=scene.game.config.width/2,
    y=scene.game.config.height/2,
    width=scene.game.config.width,
    height=scene.game.config.height
  ) {

    //container attributes and basic setup
    super(scene, x, y)
    scene.sys.displayList.add(this)
    this.width = width
    this.height = height

    this.keyWidth = Math.round(this.width / 12)
    this.keyHeight = this.keyWidth
    this.keySpacing = 0.15 * this.keyWidth

    /** 
     * Key configs follow this pattern:
     * [
     *   keyLabel,
     *   keyCode,
     *   keyWidth (default: 1),
     *   keyValue (default: keyLabel)
     * ]
     */

    let bottomRowConfig = [
      ["\u232B", Phaser.Input.Keyboard.KeyCodes.BACKSPACE, 1.5],
      [",", Phaser.Input.Keyboard.KeyCodes.COMMA],
      ["", Phaser.Input.Keyboard.KeyCodes.SPACE, 4, " "],
      [".", Phaser.Input.Keyboard.KeyCodes.PERIOD],
      ["\u23CE", Phaser.Input.Keyboard.KeyCodes.ENTER, 1.5, "\n"],
    ]

    let numberRowConfig = [
      ["1", Phaser.Input.Keyboard.KeyCodes.ONE],
      ["2", Phaser.Input.Keyboard.KeyCodes.TWO],
      ["3", Phaser.Input.Keyboard.KeyCodes.THREE],
      ["4", Phaser.Input.Keyboard.KeyCodes.FOUR],
      ["5", Phaser.Input.Keyboard.KeyCodes.FIVE],
      ["6", Phaser.Input.Keyboard.KeyCodes.SIX],
      ["7", Phaser.Input.Keyboard.KeyCodes.SEVEN],
      ["8", Phaser.Input.Keyboard.KeyCodes.EIGHT],
      ["9", Phaser.Input.Keyboard.KeyCodes.NINE],
      ["0", Phaser.Input.Keyboard.KeyCodes.ZERO],
    ]

    let lowercaseConfig = [
      numberRowConfig,
      [
        ["q", Phaser.Input.Keyboard.KeyCodes.Q],
        ["w", Phaser.Input.Keyboard.KeyCodes.W],
        ["e", Phaser.Input.Keyboard.KeyCodes.E],
        ["r", Phaser.Input.Keyboard.KeyCodes.R],
        ["t", Phaser.Input.Keyboard.KeyCodes.T],
        ["y", Phaser.Input.Keyboard.KeyCodes.Y],
        ["u", Phaser.Input.Keyboard.KeyCodes.U],
        ["i", Phaser.Input.Keyboard.KeyCodes.I],
        ["o", Phaser.Input.Keyboard.KeyCodes.O],
        ["p", Phaser.Input.Keyboard.KeyCodes.P],
      ],
      [
        ["a", Phaser.Input.Keyboard.KeyCodes.A],
        ["s", Phaser.Input.Keyboard.KeyCodes.S],
        ["d", Phaser.Input.Keyboard.KeyCodes.D],
        ["f", Phaser.Input.Keyboard.KeyCodes.F],
        ["g", Phaser.Input.Keyboard.KeyCodes.G],
        ["h", Phaser.Input.Keyboard.KeyCodes.H],
        ["j", Phaser.Input.Keyboard.KeyCodes.J],
        ["k", Phaser.Input.Keyboard.KeyCodes.K],
        ["l", Phaser.Input.Keyboard.KeyCodes.L],
      ],
      [
        ["z", Phaser.Input.Keyboard.KeyCodes.Z],
        ["x", Phaser.Input.Keyboard.KeyCodes.X],
        ["c", Phaser.Input.Keyboard.KeyCodes.C],
        ["v", Phaser.Input.Keyboard.KeyCodes.V],
        ["b", Phaser.Input.Keyboard.KeyCodes.B],
        ["n", Phaser.Input.Keyboard.KeyCodes.N],
        ["m", Phaser.Input.Keyboard.KeyCodes.M],
      ],
      bottomRowConfig
    ]

    let uppercaseConfig = [
      numberRowConfig,
      [
        ["Q", Phaser.Input.Keyboard.KeyCodes.Q],
        ["W", Phaser.Input.Keyboard.KeyCodes.W],
        ["E", Phaser.Input.Keyboard.KeyCodes.E],
        ["R", Phaser.Input.Keyboard.KeyCodes.R],
        ["T", Phaser.Input.Keyboard.KeyCodes.T],
        ["Y", Phaser.Input.Keyboard.KeyCodes.Y],
        ["U", Phaser.Input.Keyboard.KeyCodes.U],
        ["I", Phaser.Input.Keyboard.KeyCodes.I],
        ["O", Phaser.Input.Keyboard.KeyCodes.O],
        ["P", Phaser.Input.Keyboard.KeyCodes.P],
      ],
      [
        ["A", Phaser.Input.Keyboard.KeyCodes.A],
        ["S", Phaser.Input.Keyboard.KeyCodes.S],
        ["D", Phaser.Input.Keyboard.KeyCodes.D],
        ["F", Phaser.Input.Keyboard.KeyCodes.F],
        ["G", Phaser.Input.Keyboard.KeyCodes.G],
        ["H", Phaser.Input.Keyboard.KeyCodes.H],
        ["J", Phaser.Input.Keyboard.KeyCodes.J],
        ["K", Phaser.Input.Keyboard.KeyCodes.K],
        ["L", Phaser.Input.Keyboard.KeyCodes.L],
      ],
      [
        ["Z", Phaser.Input.Keyboard.KeyCodes.Z],
        ["X", Phaser.Input.Keyboard.KeyCodes.X],
        ["C", Phaser.Input.Keyboard.KeyCodes.C],
        ["V", Phaser.Input.Keyboard.KeyCodes.V],
        ["B", Phaser.Input.Keyboard.KeyCodes.B],
        ["N", Phaser.Input.Keyboard.KeyCodes.N],
        ["M", Phaser.Input.Keyboard.KeyCodes.M],
      ],
      bottomRowConfig
    ]

    let lowercaseKeys = this.initializeKeys(lowercaseConfig)
    let uppercaseKeys = this.initializeKeys(uppercaseConfig)
    this.keyModes = [lowercaseKeys, uppercaseKeys]
    this.setMode()

  } 

  setMode() {
    this.disableKeys(this.keyModes[1])
  }

  initializeKeys(keyModeConfig) {
    let keyContainer = this.scene.add.container(this.width / 2, this.height / 2)
    let keyConfigRowCounter = 0
    let keyboard = this
    _.each(keyModeConfig, function(keyConfigRow) {
      let keyRow = keyboard.scene.add.container(0, 0)
      let keyPosX = 0
      _.each(keyConfigRow, function(keyConfig) {
        let thisKeyWidth = keyboard.keyWidth
        if (keyConfig[2] !== undefined) {
          thisKeyWidth = keyboard.keyWidth * keyConfig[2] + keyboard.keySpacing * (keyConfig[2] - 1)
        }
        let buttonLabel = keyConfig[0]
        let buttonKeyCode = keyConfig[1]
        let buttonValue = (keyConfig[3] !== undefined ? keyConfig[3] : keyConfig[0])
        let button = new Button(
          keyboard.scene, keyPosX + thisKeyWidth / 2, 0,
          thisKeyWidth, keyboard.keyHeight,
          buttonLabel, buttonKeyCode, buttonValue
        )
        keyPosX += thisKeyWidth + keyboard.keySpacing
        keyRow.add(button)
      })
      keyRow.x = (keyboard.keySpacing - keyPosX) / 2
      keyRow.y = (keyConfigRowCounter - 1) * (keyboard.keyWidth + keyboard.keySpacing)
      keyContainer.add(keyRow)
      keyConfigRowCounter += 1
    })
    return keyContainer
  }

  disableKeys(keyContainer) {
    _.each(keyContainer.list, function(keyRow) {
      _.each(keyRow.list, function(key) {
        key.disableInput(true)
      })
    })
  }

  enableKeys(keyContainer) {
    _.each(keyContainer.list, function(keyRow) {
      _.each(keyRow.list, function(key) {
        key.enableInput(true)
      })
    })
  }

}

export default Keyboard
