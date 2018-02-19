import DomlessApp from "../../../src/domless.js"
import RunState from "../../../src/states/run.js"

describe("DemoRunState", function() {

  let testApp = new DomlessApp()
  let runState = new RunState()

  before(function() {
    testApp.device.canvas = true
    testApp.boot()
    runState.game = testApp
    runState.load = testApp.load
  })

  after(function() {
    testApp.destroy()
  })

  it("should run its run preload method without error", function() {
    runState.preload()
  })

  it("should run its run create method without error", function() {
    runState.create()
  })

  it("should run its run update method without error", function() {
    runState.update()
  })

})
