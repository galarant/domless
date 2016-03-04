class Avatar extends Phaser.Sprite {

  constructor(game) {
    let width = game.camera.width / 15;
    let height = width;
    super(game,
      game.camera.x + game.camera.width / 2,
      game.ground.y - game.ground.height / 2 - height / 2,
      "avatar");

    this.width = width;
    this.height = height;
    game.world.add(this);

    game.physics.box2d.enable(this);
    this.body.setCircle(this.width / 1.5);
  }

  update() {
    //handle inputs
    if (this.game.cursors.left.isDown)
    {
      this.body.applyForce(-400,0);
    }

    if (this.game.cursors.right.isDown)
    {
      this.body.applyForce(400,0);
    }

    if (this.game.cursors.up.isDown)
    {
      this.body.applyForce(0, -375);
    }
  }


}

export default Avatar;
