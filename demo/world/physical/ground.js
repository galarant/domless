import Phaser from "phaser"

class Ground extends Phaser.GameObjects.Sprite {

  constructor(game) {
    //sprite attributes
    let height = game.world.height / 20
    super(game,
          game.world.centerX, game.world.height - height / 2,
          "ground")

    this.width = this.game.world.width
    this.height = height

    //world stuff
    game.world.add(this)

  }

}

export default Ground
