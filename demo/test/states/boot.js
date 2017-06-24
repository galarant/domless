import "../before.js";
import app from "../../main.js";

let demoBootState = app.state.states["boot"];

describe("states/boot.js", function() {
  describe("DemoBootState", function() {

    it("should have a preload method", function() {
      demoBootState.preload();
    });

    it("should have a create method", function() {
      demoBootState.create();
    });

    it("should have an update method", function() {
      demoBootState.update();
    });

  });
});
