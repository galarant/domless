import domless from "../../src/domless.js";

/**
 * Starting state for the demo
 */
class DemoBootState extends domless.states.BootState {

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
