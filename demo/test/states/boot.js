import { expect } from "chai";

import "../before.js";
import app from "../../main.js";

app.device.canvas = true;
app.boot();

let demoBootState = app.state.states["boot"];

describe("states/boot.js", function() {
  describe("DemoBootState", function() {

    it("should run its preload method without error", function() {
      demoBootState.preload();
      expect(app.state._pendingState).to.equal("load");
    });

    it("should run its create method without error", function() {
      demoBootState.create();
    });

    it("should its update method without error", function() {
      demoBootState.update();
    });

  });
});
