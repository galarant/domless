import DomlessApp from "../../../src/domless.js"
import BootState from "../../../src/states/boot.js"

describe("BootState", function() {

  let testApp = new DomlessApp()
  let bootState = new BootState()

  before(function() {
    testApp.device.canvas = true
    testApp.boot()
    bootState.game = testApp
    bootState.load = testApp.load
  })

  after(function() {
    testApp.destroy()
  })

  it("should run its boot preload method without error", function() {
    bootState.preload()
  })

  it("should run its boot create method without error", function() {
    bootState.create()
  })

  it("should run its boot update method without error", function() {
    bootState.update()
  })

})
