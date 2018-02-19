import { expect } from "chai"
import DomlessApp from "../../../src/domless.js"

import Touchable from "../../../src/components/input/touchable/touchable.js"

describe("TouchableComponent", function() {

  let testApp = new DomlessApp()

  before(function() {
    testApp.device.canvas = true
    testApp.boot()
  })

  after(function() {
    testApp.destroy()
  })

  it("can create a new instance without error", function() {
    new Touchable(testApp)
  })

  it("does not respond to touches outside its body", function() {
    let testPointer = new Phaser.Pointer(testApp, "test")
    let testTouchable = new Touchable(testApp)
    testTouchable.touched = 0
    testTouchable.callback = function() {
      testTouchable.touched += 1
    }

    // does not respond to touches outside its body
    testPointer.x = testTouchable.worldPosition.x + testTouchable.width + 10
    testPointer.y = 0
    testTouchable.handlePointerInput(testPointer)
    expect(testTouchable.touched).to.equal(0)
  })

  it("does respond to touches inside its body", function() {
    let testPointer = new Phaser.Pointer(testApp, "test")
    let testTouchable = new Touchable(testApp)
    testTouchable.touched = 0
    testTouchable.callback = function() {
      testTouchable.touched += 1
    }

    // does not respond to touches outside its body
    testPointer.x = testTouchable.worldPosition.x + 1
    testPointer.y = testTouchable.worldPosition.y + 1
    testTouchable.handlePointerInput(testPointer)
    expect(testTouchable.touched).to.equal(1)
  })

})

