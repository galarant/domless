import domless from "../src/domless.js";
import DemoBootState from "./states/boot.js";
import DemoLoadState from "./states/load.js";
import DemoRunState from "./states/run.js";

/**
 * Here is where you add your states to the domless app.
 * Supported states are boot, load and run.
 */
let demoApp = domless.app;

demoApp.state.add("boot", DemoBootState);
demoApp.state.add("load", DemoLoadState);
demoApp.state.add("run", DemoRunState);
demoApp.state.start("boot");

export default demoApp;
