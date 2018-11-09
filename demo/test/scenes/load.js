import DomlessApp from "../../../src/domless.js"
import LoadScene from "../../../src/scenes/load.js"

describe("LoadScene", function() {

  let testApp = new DomlessApp()
  let loadScene = new LoadScene()

  before(function() {
    testApp.device.canvas = true
    testApp.boot()
    loadScene.game = testApp
    loadScene.load = testApp.load
  })

  after(function() {
    testApp.destroy()
  })

  it("should run its load preload method without error", function() {
    loadScene.preload()
  })

  it("should run its load create method without error", function() {
    loadScene.create()
  })

  it("should run its load update method without error", function() {
    loadScene.update()
  })

})
