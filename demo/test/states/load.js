import DomlessApp from "../../../src/domless.js"
import LoadState from "../../../src/states/load.js"

describe("LoadState", function() {

  let testApp = new DomlessApp()
  let loadState = new LoadState()

  before(function() {
    testApp.device.canvas = true
    testApp.boot()
    loadState.game = testApp
    loadState.load = testApp.load
  })

  after(function() {
    testApp.destroy()
  })

  it("should run its load preload method without error", function() {
    loadState.preload()
  })

  it("should run its load create method without error", function() {
    loadState.create()
  })

  it("should run its load update method without error", function() {
    loadState.update()
  })

})
