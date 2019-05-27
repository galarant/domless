import _ from "lodash"
import Phaser from "phaser"

/**
 * Base class for a configurable debug overlay
 * Straightforward extension of Phaser.Text
 * Which sits in the top left corner and shows debug info
 */

const
  CAMERA = "camera",
  POINTER = "pointer",
  FPS = "fps"


class DebugText extends Phaser.GameObjects.Text {

  constructor(scene,
    {
      x=10, y=10,
      facets=[CAMERA, POINTER, FPS]
    } = {}
  ) {
    super(scene, x, y)
    scene.sys.displayList.add(this)
    this.setScrollFactor(0)

    this.facets = facets
    this.debugDetails = {
      "camera": { 
        "x": () => {return this.scene.cameras.main.scrollX.toFixed(2)},
        "y": () => {return this.scene.cameras.main.scrollY.toFixed(2)},
      },
      "pointer": {
        "x": () => {return this.scene.input.mousePointer.x.toFixed(2)},
        "y": () => {return this.scene.input.mousePointer.y.toFixed(2)}
      },
      "fps": { 
        "": () => {return this.scene.game.loop.actualFps.toFixed(2)}
      }
    }

    // update the debug info on each frame
    this.scene.events.on("update", this.handleUpdate, this)
  }

  handleUpdate() {
    let debugLines = []
    _.forEach(
      this.debugDetails,
      (facet, facetName) => {
        if (_.includes(this.facets, facetName)) {
          let thisLine = `${facetName} `
          _.forEach(
            facet,
            (metricVal, metricName) => {
              thisLine += ` ${metricName}: ${metricVal()}`
            }
          )
          debugLines.push(thisLine)
        }
      }
    )
    this.setText(debugLines)
  }
}

export default DebugText
