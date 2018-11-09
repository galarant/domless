import DomlessApp from "../../../src/domless.js"
import RunScene from "../../../src/scenes/run.js"

describe("DemoRunScene", function() {

  let testApp = new DomlessApp()
  let runScene = new RunScene()

  before(function() {
    testApp.device.canvas = true
    testApp.boot()
    runScene.game = testApp
    runScene.load = testApp.load
  })

  after(function() {
    testApp.destroy()
  })

  it("should run its run preload method without error", function() {
    runScene.preload()
  })

  it("should run its run create method without error", function() {
    runScene.create()
  })

  it("should run its run update method without error", function() {
    runScene.update()
  })

})
