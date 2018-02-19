class Ground extends Phaser.Sprite {

  constructor(game) {
    //sprite attributes
    let height = game.world.height / 20
    super(game,
          game.world.centerX, game.world.height - height / 2,
          "ground")

    this.width = this.game.world.width
    this.height = height

    //physics attributes
    game.physics.box2d.enable(this)
    this.body.setRectangle(this.width, this.height)
    this.body.static = true

    //world stuff
    game.world.add(this)

  }

}

export default Ground
