import Phaser from "phaser"

class DomlessApp extends Phaser.Game {

  /**
   * Constructor method for DomlessApp
   * Creates a specialized Phaser.Game instance and returns it
   */
  constructor() {
    let config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
    }
    super(config)
  }

}

export default DomlessApp
