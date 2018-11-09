import Phaser from "phaser"

const DEFAULT_CONFIG = {
  type: Phaser.AUTO,
  width: 800,
  height:600,
}

class DomlessApp extends Phaser.Game {

  /**
   * Constructor method for DomlessApp
   * Creates a specialized Phaser.Game instance and returns it
   */
  constructor(config={}) {
    config = Object.assign(DEFAULT_CONFIG, config)
    super(config)
  }

}

export default DomlessApp
