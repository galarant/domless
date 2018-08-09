import DomlessApp from "../../../src/domless.js"
import BootScene from "../../../src/scenes/boot.js"

describe("BootScene", function() {

  let testApp = new DomlessApp()
  let bootScene = new BootScene()

  before(function() {
    testApp.device.canvas = true
    testApp.boot()
    bootScene.game = testApp
    bootScene.load = testApp.load
  })

  after(function() {
    testApp.destroy()
  })

  it("should run its boot preload method without error", function() {
    bootScene.preload()
  })

  it("should run its boot create method without error", function() {
    bootScene.create()
  })

  it("should run its boot update method without error", function() {
    bootScene.update()
  })

})
