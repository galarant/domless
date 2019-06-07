import Phaser from "phaser"
import DemoBootScene from "./scenes/boot.js"
import DemoLoadScene from "./scenes/load.js"
import DemoRunScene from "./scenes/run.js"

const CONFIG = {
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 300,
      },
      debug: false
    }
  },
  scale: {
    parent: "body",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 600,
    height: 800
  }
}

/**
 * Here I am defining custom resize behavior for the app.
 * Phaser 3 does not provide options for this, so
 * we need to handle it on our own :)
 */
window.onload = function() {
  window.focus()
}

/**
 * Here is where you add your scenes to the domless app.
 * Supported scenes are boot, load and run.
 */
let demoApp = new Phaser.Game(CONFIG)

demoApp.scene.add("boot", DemoBootScene)
demoApp.scene.add("load", DemoLoadScene)
demoApp.scene.add("run", DemoRunScene)
demoApp.scene.start("boot")

export default demoApp
