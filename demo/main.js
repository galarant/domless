import domless from "../src/domless.js";
import DemoBootState from "./states/boot.js";
import DemoLoadState from "./states/load.js";
import DemoRunState from "./states/run.js";

/**
 * Here is where you add your states to the domless app.
 * Common states are boot, load and run.
 */
console.log("=== MY DOMLESS DEMO ===");

let app = domless.app;

app.state.add("boot", DemoBootState);
app.state.add("load", DemoLoadState);
app.state.add("run", DemoRunState);
app.state.start("boot");

export default app;
