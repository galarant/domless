import BootState from "../../src/states/boot.js";

/**
 * Starting state for the demo
 */
class DemoBootState extends BootState {

  /**
   * Constructor method for DemoBootState
   * Returns a new instance of this class
   */
  constructor() {
    super(...arguments);
  }

  /**
   * Runs once, before the create method for this state
   */
  preload() {
    super.preload();
  }

  /**
   * Runs once, before the first frame is rendered for this state
   */
  create() {
    super.create();
  }

  /**
   * Runs continuously, each time a single frame is rendered for this state
   */
  update() {
    super.update();
  }
}

export default DemoBootState;
