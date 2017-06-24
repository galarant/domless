import "./before.js";

import { expect } from "chai";
import app from "../main.js";

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

    it("will start on the Boot state", function() {
      expect(app.state._pendingState).to.equal("boot");
    });

  });
});
