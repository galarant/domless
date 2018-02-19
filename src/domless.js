class DomlessApp extends Phaser.Game {

  /**
   * Constructor method for DomlessApp
   * Creates a specialized Phaser.Game instance and returns it
   */
  constructor() {
    super("100%", "100%", Phaser.AUTO, "body", null, true)
  }

}

export default DomlessApp
