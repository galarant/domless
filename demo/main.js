import DomlessApp from "../src/domless.js"
import DemoBootScene from "./scenes/boot.js"
import DemoLoadScene from "./scenes/load.js"
import DemoRunScene from "./scenes/run.js"

/**
 * Here I am defining custom resize behavior for the app.
 * Phaser 3 does not provide options for this, so
 * we need to handle it on our own :)
 */
window.onload = function() {
  window.focus()
  resizeApp()
  window.addEventListener("resize", resizeApp)
}

/**
 * Here is where you add your scenes to the domless app.
 * Supported scenes are boot, load and run.
 */
let demoApp = new DomlessApp()

demoApp.scene.add("boot", DemoBootScene)
demoApp.scene.add("load", DemoLoadScene)
demoApp.scene.add("run", DemoRunScene)
demoApp.scene.start("boot")

let resizeApp = function() {
  let canvas = document.querySelector("canvas")
  let windowWidth = window.innerWidth
  let windowHeight = window.innerHeight
  let windowRatio = windowWidth / windowHeight
  let appRatio = demoApp.config.width / demoApp.config.height
  if(windowRatio < appRatio) {
    canvas.style.width = windowWidth + "px"
    canvas.style.height = (windowWidth / appRatio) + "px"
  } else {
    canvas.style.width = (windowHeight * appRatio) + "px"
    canvas.style.height = windowHeight + "px"
  }

}


export default demoApp
