import "./before.js";

import { expect } from "chai";
import { game } from "../main.js";

describe("main.js", function() {
  describe("game", function() {

    it("should have a Boot state", function() {
      expect(game.state.states).to.have.property("boot");
    });

    it("should have a Loading state", function() {
      expect(game.state.states).to.have.property("loading");
    });

    it("should have a Play state", function() {
      expect(game.state.states).to.have.property("play");
    });
  });
});
