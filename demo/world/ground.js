import Phaser from "phaser"

class Ground extends Phaser.GameObjects.Rectangle {

  /**
   * Constructs an instance of the Avatar class
   * Returns the instance
   */
  constructor(
    scene,
    x=scene.app.config.width / 2,
    y=scene.app.config.height - 25
  ) {

    super(scene, x, y, scene.app.config.width, 50, 0x181818)

    this.body = new Phaser.Physics.Arcade.StaticBody(scene.physics.world, this)

    scene.sys.displayList.add(this)
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.STATIC_BODY)
  }

}

export default Ground
