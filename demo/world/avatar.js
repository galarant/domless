import Phaser from "phaser"

class Avatar extends Phaser.GameObjects.Sprite {

  /**
   * Constructs an instance of the Avatar class
   * Returns the instance
   */
  constructor(
    scene,
    x=scene.app.config.width / 2,
    y=scene.app.config.height / 2,
    key="avatar"
  ) {

    super(scene, x, y, key)

    // add Avatar specific display and physics properties
    this.body = new Phaser.Physics.Arcade.Body(scene.physics.world, this)
    this.body.setBounce(0.2)
    this.body.setCollideWorldBounds(true)
    this.setSize(50, 50)
    this.setDisplaySize(50, 50)

    // get it registered with the scene and physics world
    scene.sys.displayList.add(this)
    scene.sys.updateList.add(this)
    scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY)

  }

}

export default Avatar
