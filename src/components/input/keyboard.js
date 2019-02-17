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
    {
      x=scene.game.config.width/2,
      y=scene.game.config.height/2,
    } = {}
  ) {

    //container attributes and basic setup
    super(scene, x, y)
    scene.sys.displayList.add(this)
    this.width = scene.game.config.width

    if (!this.scene.sys.game.device.os.desktop) {
      this.keyWidth = Math.round(this.width / 12)
    } else {
      this.keyWidth = Math.round(this.width / 14)
    }
    this.keyHeight = this.keyWidth
    this.keySpacing = 0.15 * this.keyWidth

    // always assume 5 rows for now
    // this should be customized later
    this.height = this.keyHeight * 5 + this.keySpacing * 7
    let keyboard = this

    /** 
     * Key configs follow this pattern:
     * [
     *   keyLabel,
     *   keyCode,
     *   keyWidth (default: 1),
     *   keyValue (default: keyLabel),
     *   keyCallback (default: null),
     *   keyCallbackContext (default: null),
     * ]
     */

    let mobileCapsButtonCallback = function() {
      if (this.mode === "mobileuppercase") {
        this.setMode("mobilelowercase")
      } else {
        this.setMode("mobileuppercase")
      }
    }

    let mobileSymbolsButtonCallback = function() {
      if (this.mode === "mobilesymbols") {
        this.setMode("mobileuppercase")
      } else {
        this.setMode("mobilesymbols")
      }
    }

    let desktopCapsButtonCallback = function() {
      if (this.mode === "desktopuppercase") {
        this.capslock = false
        this.setMode("desktoplowercase")
      } else if (this.mode === "desktoplowercase") {
        this.capslock = true
        this.setMode("desktopuppercase")
      }
    }

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

    let lowercaseLettersRowOneConfig = [
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
    ]

    let lowercaseLettersRowTwoConfig = [
      ["a", Phaser.Input.Keyboard.KeyCodes.A],
      ["s", Phaser.Input.Keyboard.KeyCodes.S],
      ["d", Phaser.Input.Keyboard.KeyCodes.D],
      ["f", Phaser.Input.Keyboard.KeyCodes.F],
      ["g", Phaser.Input.Keyboard.KeyCodes.G],
      ["h", Phaser.Input.Keyboard.KeyCodes.H],
      ["j", Phaser.Input.Keyboard.KeyCodes.J],
      ["k", Phaser.Input.Keyboard.KeyCodes.K],
      ["l", Phaser.Input.Keyboard.KeyCodes.L],
    ]

    let lowercaseLettersRowThreeConfig = [
      ["z", Phaser.Input.Keyboard.KeyCodes.Z],
      ["x", Phaser.Input.Keyboard.KeyCodes.X],
      ["c", Phaser.Input.Keyboard.KeyCodes.C],
      ["v", Phaser.Input.Keyboard.KeyCodes.V],
      ["b", Phaser.Input.Keyboard.KeyCodes.B],
      ["n", Phaser.Input.Keyboard.KeyCodes.N],
      ["m", Phaser.Input.Keyboard.KeyCodes.M],
    ]

    let uppercaseLettersRowOneConfig = [
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
    ]

    let uppercaseLettersRowTwoConfig = [
      ["A", Phaser.Input.Keyboard.KeyCodes.A],
      ["S", Phaser.Input.Keyboard.KeyCodes.S],
      ["D", Phaser.Input.Keyboard.KeyCodes.D],
      ["F", Phaser.Input.Keyboard.KeyCodes.F],
      ["G", Phaser.Input.Keyboard.KeyCodes.G],
      ["H", Phaser.Input.Keyboard.KeyCodes.H],
      ["J", Phaser.Input.Keyboard.KeyCodes.J],
      ["K", Phaser.Input.Keyboard.KeyCodes.K],
      ["L", Phaser.Input.Keyboard.KeyCodes.L],
    ]

    let uppercaseLettersRowThreeConfig = [
      ["Z", Phaser.Input.Keyboard.KeyCodes.Z],
      ["X", Phaser.Input.Keyboard.KeyCodes.X],
      ["C", Phaser.Input.Keyboard.KeyCodes.C],
      ["V", Phaser.Input.Keyboard.KeyCodes.V],
      ["B", Phaser.Input.Keyboard.KeyCodes.B],
      ["N", Phaser.Input.Keyboard.KeyCodes.N],
      ["M", Phaser.Input.Keyboard.KeyCodes.M],
    ]


    let mobileLowercaseConfig = [
      numberRowConfig,
      lowercaseLettersRowOneConfig,
      lowercaseLettersRowTwoConfig,
      _.concat(
        [["\u21E7", null, 1.5, "", false, mobileCapsButtonCallback, keyboard]], // unicode uppercase arrow white
        lowercaseLettersRowThreeConfig,
        [["\u232B", Phaser.Input.Keyboard.KeyCodes.BACKSPACE, 1.5]] // unicode backspace symbol
      ),
      [
        ["!#1", null, 1.5, "", false, mobileSymbolsButtonCallback, keyboard],
        [",", Phaser.Input.Keyboard.KeyCodes.COMMA],
        ["", Phaser.Input.Keyboard.KeyCodes.SPACE, 4, " "],
        [".", Phaser.Input.Keyboard.KeyCodes.PERIOD],
        ["\u23CE", Phaser.Input.Keyboard.KeyCodes.ENTER, 1.5, "\n"], //unicode return symbol
      ],
    ]

    let mobileUppercaseConfig = [
      numberRowConfig,
      uppercaseLettersRowOneConfig,
      uppercaseLettersRowTwoConfig,
      _.concat(
        [["\u2B06", null, 1.5, "", false, mobileCapsButtonCallback, keyboard]], // unicode uppercase arrow black
        uppercaseLettersRowThreeConfig,
        [["\u232B", Phaser.Input.Keyboard.KeyCodes.BACKSPACE, 1.5]] // unicode backspace symbol
      ),
      [
        ["!#1", null, 1.5, "", false, mobileSymbolsButtonCallback, keyboard],
        [",", Phaser.Input.Keyboard.KeyCodes.COMMA],
        ["", Phaser.Input.Keyboard.KeyCodes.SPACE, 4, " "],
        [".", Phaser.Input.Keyboard.KeyCodes.PERIOD],
        ["\u23CE", Phaser.Input.Keyboard.KeyCodes.ENTER, 1.5, "\n"], //unicode return symbol
      ],
    ]

    let mobileSymbolsConfig = [
      numberRowConfig,
      [
        ["+", null],
        ["x", null],
        ["\u00F7", null], // unicode division symbol
        ["=", null],
        ["/", null],
        ["_", null],
        ["<", null],
        [">", null],
        ["[", null],
        ["]", null],
      ],
      [
        ["!", null],
        ["@", null],
        ["#", null],
        ["$", null],
        ["%", null],
        ["^", null],
        ["&", null],
        ["*", null],
        ["(", null],
        [")", null],
      ],
      [
        ["\u2B06", null, 1.5, "", false, mobileCapsButtonCallback, this], // unicode uppercase arrow black
        ["-", null],
        ["'", null],
        ["\"", null],
        [":", null],
        [";", null],
        [",", null],
        ["?", null],
        ["\u232B", Phaser.Input.Keyboard.KeyCodes.BACKSPACE, 1.5], // unicode backspace symbol
      ],
      [
        ["ABC", null, 1.5, "", false, mobileSymbolsButtonCallback, keyboard],
        [",", Phaser.Input.Keyboard.KeyCodes.COMMA],
        ["", Phaser.Input.Keyboard.KeyCodes.SPACE, 4, " "],
        [".", Phaser.Input.Keyboard.KeyCodes.PERIOD],
        ["\u23CE", Phaser.Input.Keyboard.KeyCodes.ENTER, 1.5, "\n"], //unicode return symbol
      ],
    ]

    let desktopLowercaseConfig = [
      _.concat(
        numberRowConfig,
        [["-", Phaser.Input.Keyboard.KeyCodes.MINUS]],
        [["=", Phaser.Input.Keyboard.KeyCodes.PLUS]]
      ),
      _.concat(
        lowercaseLettersRowOneConfig,
        [["[", Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET]],
        [["]", Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET]]
      ),
      _.concat(
        lowercaseLettersRowTwoConfig,
        [[";", Phaser.Input.Keyboard.KeyCodes.SEMICOLON]],
        [["'", Phaser.Input.Keyboard.KeyCodes.QUOTES]]
      ),
      _.concat(
        [["\u21E7", Phaser.Input.Keyboard.KeyCodes.CAPS_LOCK, 1.5, "", false, desktopCapsButtonCallback, keyboard]], // unicode uppercase arrow white
        lowercaseLettersRowThreeConfig,
        [["/", Phaser.Input.Keyboard.KeyCodes.FORWARD_SLASH]],
        [["\u232B", Phaser.Input.Keyboard.KeyCodes.BACKSPACE, 1.5]] // unicode backspace symbol
      ),
      [
        ["\\", Phaser.Input.Keyboard.KeyCodes.BACK_SLASH, 1.5],
        [",", Phaser.Input.Keyboard.KeyCodes.COMMA],
        ["", Phaser.Input.Keyboard.KeyCodes.SPACE, 4, " "],
        [".", Phaser.Input.Keyboard.KeyCodes.PERIOD],
        ["\u23CE", Phaser.Input.Keyboard.KeyCodes.ENTER, 1.5, "\n"], //unicode return symbol
      ],
    ]

    let desktopUppercaseConfig = [
      [
        ["!", Phaser.Input.Keyboard.KeyCodes.ONE],
        ["@", Phaser.Input.Keyboard.KeyCodes.TWO],
        ["#", Phaser.Input.Keyboard.KeyCodes.THREE],
        ["$", Phaser.Input.Keyboard.KeyCodes.FOUR],
        ["%", Phaser.Input.Keyboard.KeyCodes.FIVE],
        ["^", Phaser.Input.Keyboard.KeyCodes.SIX],
        ["&", Phaser.Input.Keyboard.KeyCodes.SEVEN],
        ["*", Phaser.Input.Keyboard.KeyCodes.EIGHT],
        ["(", Phaser.Input.Keyboard.KeyCodes.NINE],
        [")", Phaser.Input.Keyboard.KeyCodes.ZERO],
        ["_", Phaser.Input.Keyboard.KeyCodes.MINUS],
        ["+", Phaser.Input.Keyboard.KeyCodes.PLUS],
      ],
      _.concat(
        uppercaseLettersRowOneConfig,
        [["{", Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET]],
        [["}", Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET]]
      ),
      _.concat(
        uppercaseLettersRowTwoConfig,
        [[":", Phaser.Input.Keyboard.KeyCodes.SEMICOLON]],
        [["\"", Phaser.Input.Keyboard.KeyCodes.QUOTES]]
      ),
      _.concat(
        [["\u21E7", Phaser.Input.Keyboard.KeyCodes.CAPS_LOCK, 1.5, "", false, desktopCapsButtonCallback, keyboard]], // unicode uppercase arrow white
        uppercaseLettersRowThreeConfig,
        [["?", Phaser.Input.Keyboard.KeyCodes.FORWARD_SLASH]],
        [["\u232B", Phaser.Input.Keyboard.KeyCodes.BACKSPACE, 1.5]] // unicode backspace symbol
      ),
      [
        ["|", Phaser.Input.Keyboard.KeyCodes.BACK_SLASH, 1.5],
        ["<", Phaser.Input.Keyboard.KeyCodes.COMMA],
        ["", Phaser.Input.Keyboard.KeyCodes.SPACE, 4, " "],
        [">", Phaser.Input.Keyboard.KeyCodes.PERIOD],
        ["\u23CE", Phaser.Input.Keyboard.KeyCodes.ENTER, 1.5, "\n"], //unicode return symbol
      ],
    ]

    if (!this.scene.sys.game.device.os.desktop) {
      // set up keyboard for mobile
      let mobileLowercaseKeys = this.initializeKeys(mobileLowercaseConfig)
      let mobileUppercaseKeys = this.initializeKeys(mobileUppercaseConfig)
      let mobileSymbolKeys = this.initializeKeys(mobileSymbolsConfig)
      this.keyModes = {
        "mobilelowercase": mobileLowercaseKeys,
        "mobileuppercase": mobileUppercaseKeys,
        "mobilesymbols": mobileSymbolKeys
      }
      this.setMode("mobilelowercase")
    } else {
      // set up keyboard for desktop
      let desktopLowercaseKeys = this.initializeKeys(desktopLowercaseConfig)
      let desktopUppercaseKeys = this.initializeKeys(desktopUppercaseConfig)
      this.keyModes = {
        "desktoplowercase": desktopLowercaseKeys,
        "desktopuppercase": desktopUppercaseKeys,
      }
      this.setMode("desktoplowercase")

      this.scene.input.keyboard.on("keydown_SHIFT", function() {
        if (this.mode !== "desktopuppercase" && !this.capslock) {
          this.setMode("desktopuppercase")
        }
      }, this)

      this.scene.input.keyboard.on("keyup_SHIFT", function() {
        if (this.mode !== "desktoplowercase" && !this.capslock) {
          this.setMode("desktoplowercase")
        }
      }, this)
    }

  } 

  setMode(modeName) {
    if (this.mode) {
      this.disableKeys(this.keyModes[this.mode])
    }
    this.mode = modeName
    this.enableKeys(this.keyModes[modeName])
  }

  initializeKeys(keyModeConfig) {
    let keyContainer = this.scene.add.container(0, 0)
    let keyConfigRowCounter = 0
    let keyboard = this
    this.add(keyContainer)

    _.each(keyModeConfig, function(keyConfigRow) {
      let keyRow = keyboard.scene.add.container(0, 0)
      let keyPosX = 0
      _.each(keyConfigRow, function(keyConfig) {
        let thisKeyWidth = keyboard.keyWidth
        if (keyConfig[2] !== undefined) {
          thisKeyWidth = keyboard.keyWidth * keyConfig[2] + keyboard.keySpacing * (keyConfig[2] - 1)
        }
        let buttonConfig = {
          x: keyPosX + thisKeyWidth / 2,
          y: 0,
          width: thisKeyWidth,
          height: keyboard.keyHeight,
          label: keyConfig[0],
          keyCode: keyConfig[1],
          value: (keyConfig[3] !== undefined ? keyConfig[3] : keyConfig[0]),
          fill: (keyConfig[4] !== undefined ? keyConfig[4] : true),
          callback: (keyConfig[5] !== undefined ? keyConfig[5] : null),
          callbackScope: (keyConfig[6] !== undefined ? keyConfig[6] : null)
        }
        let button = new Button(keyboard.scene, buttonConfig)
        keyPosX += thisKeyWidth + keyboard.keySpacing
        keyRow.add(button)
      })
      keyRow.x = (keyboard.keySpacing - keyPosX) / 2
      keyRow.y = (keyConfigRowCounter - 1) * (keyboard.keyWidth + keyboard.keySpacing)
      keyContainer.add(keyRow)
      keyConfigRowCounter += 1
    })
    this.disableKeys(keyContainer)
    return keyContainer
  }

  disableKeys(keyContainer) {
    _.each(keyContainer.list, function(keyRow) {
      _.each(keyRow.list, function(key) {
        key.deactivate(true)
      })
    })
  }

  enableKeys(keyContainer) {
    _.each(keyContainer.list, function(keyRow) {
      _.each(keyRow.list, function(key) {
        key.activate(true)
      })
    })
  }

}

export default Keyboard
