import Ground from "../world/physical/ground";
import Avatar from "../world/physical/avatar";

class PlayState extends Phaser.State {

  preload() {
    // config input
    this.game.input.maxPointers = 1;

    this.game.cursors = this.game.input.keyboard.createCursorKeys();
  }

  create() {

    // initialize game world
    this.game.world.setBounds(0, 0, this.game.camera.width * 2, this.game.camera.height * 2);

    // initialize physics system
    this.game.physics.startSystem(Phaser.Physics.BOX2D);
    this.game.physics.box2d.gravity.y = 500;
    this.game.physics.box2d.setBoundsToWorld();

    // add bg
    this.game.bg = this.game.add.tileSprite(0, 0,
      this.game.world.width, this.game.world.height, "bg");
    this.game.bg.tileScale = new Phaser.Point(2.0, 2.0);

    this.game.ground = new Ground(this.game);
    this.game.avatar = new Avatar(this.game);
    this.game.camera.follow(this.game.avatar);
  }

  update() {
    // foo
  }

}

export default PlayState;
