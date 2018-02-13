/* global before after */
// import { expect } from "chai";

import "./before.js";
import DomlessApp from "../../src/domless.js";
// import demoApp from "../main.js";
import DemoBootState from "../states/boot.js";
import DemoLoadState from "../states/load.js";
// import DemoRunState from "../states/run.js";

/*
describe.only("demoApp", function() {

  before(function() {
    demoApp.device.canvas = true;
    demoApp.boot();
  });

  after(function() {
    demoApp.destroy();
  });

  it("should have a Boot state", function() {
    console.log("1");
    expect(demoApp.state.states).to.have.property("boot");
  });

  it("should have a Load state", function() {
    console.log("2");
    expect(demoApp.state.states).to.have.property("load");
  });

  it("should have a Run state", function() {
    console.log("3");
    expect(demoApp.state.states).to.have.property("run");
  });

});
*/

describe.only("DemoBootState", function() {

  let app = new DomlessApp();
  app.device.canvas = true;
  app.boot();
  let bootState = new Phaser.State();

  before(function() {
    let stateManager = new Phaser.StateManager(app);
    stateManager.add("boot", DemoBootState, true);
  });

  after(function() {
    app.state.destroy();
    app.destroy();
  });

  it("should run its boot preload method without error", function() {
    console.log("4");
    bootState.preload();
  });

  it("should run its boot create method without error", function() {
    console.log("5");
    bootState.create();
  });

  it("should run its boot update method without error", function() {
    console.log("6");
    bootState.update();
    // expect(demoBootStateApp.state._pendingState).to.equal("load");
  });

});

describe.only("DemoLoadState", function() {

  let app = new DomlessApp();
  let loadState = new Phaser.State();

  before(function() {
    app.device.canvas = true;
    app.boot();
    let stateManager = new Phaser.StateManager(app);
    stateManager.add("load", DemoLoadState, true);
  });

  after(function() {
    app.state.destroy();
    app.destroy();
  });

  it("should run its load preload method without error", function() {
    console.log("7");
    loadState.preload();
  });

  it("should run its load create method without error", function() {
    console.log("8");
    loadState.create();
  });

  it("should run its load update method without error", function() {
    console.log("9");
    loadState.update();
    // expect(demoLoadStateApp.state._pendingState).to.equal("run");
  });

});
