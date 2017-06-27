import { expect } from "chai";

import "./before.js";
import app from "../main.js";

app.device.canvas = true;
app.boot();

describe("main.js", function() {
  describe("app", function() {

    it("should have a Boot state", function() {
      expect(app.state.states).to.have.property("boot");
    });

    it("should have a Load state", function() {
      expect(app.state.states).to.have.property("load");
    });

    it("should have a Run state", function() {
      expect(app.state.states).to.have.property("run");
    });

  });
});
