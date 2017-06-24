import domless from "../../src/domless";

import Ground from "../world/physical/ground";
import Avatar from "../world/physical/avatar";

/**
 * Run state for the demo
 */
class DemoRunState extends domless.states.RunState {

  /**
   * Constructor method for DemoRunState
   * Runs the constructor for the parent class, passing args
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments);
  }

  /**
   * Runs once, before the create method for this state
   * Configures the default pointer and keyboard input
   */
  preload() {
    super.preload();
    this.app.input.maxPointers = 1;
    this.app.cursors = this.app.input.keyboard.createCursorKeys();
  }

  /**
   * Runs once, before the first frame is rendered for this state
   */
  create() {
    super.create();

    // initialize app world
    this.app.world.setBounds(0, 0, this.app.camera.width * 2, this.app.camera.height * 2);

    // initialize physics system
    this.app.physics.startSystem(Phaser.Physics.BOX2D);
    this.app.physics.box2d.gravity.y = 500;
    this.app.physics.box2d.setBoundsToWorld();

    // add bg
    this.app.bg = this.app.add.tileSprite(0, 0,
      this.app.world.width, this.app.world.height, "bg");
    this.app.bg.tileScale = new Phaser.Point(2.0, 2.0);

    // populate this.app world
    this.app.ground = new Ground(this.app);
    this.app.avatar = new Avatar(this.app);
    this.app.camera.follow(this.app.avatar);

  }

  /**
   * Runs continuously, each time a single frame is rendered for this state
   */
  update() {
    super.update();
  }

}

export default DemoRunState;
