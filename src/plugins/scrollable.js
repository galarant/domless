import _ from "lodash"
import Phaser from "phaser"

import Element from  "src/components/element"

/**
 * A plugin that adds scrollable functionality to a scene
 */

class ScrollBar extends Element {

  constructor(scene, plugin) {

    super(
      scene,
      {
        outline: false,
        fill: true,
        arcRadius: 3
      }
    )
    this.plugin = plugin
    this.setScrollFactor(0)
    this.resize()
    this.reposition()
    this.x = this.scene.game.config.width - this.plugin.scrollBarWidth / 2
  }

  bringToFront() {
    // bring scrollbar to top z pos if any renderable objects have been addd to the scene
    if (this.sceneChildren !== this.scene.children.length) {
      let maxZ = _.maxBy(this.scene.children.list, "z").z
      this.setDepth(maxZ + 1)
      this.sceneChildren = this.scene.children.length
    }
  }

  reposition() {
    // reposition the srollbar if any relevant vars have changed
    let
      camera = this.scene.cameras.main,
      scrollPercent = (camera.scrollY - this.plugin.minScroll) / this.plugin.scrollableHeight
    if (!_.isEqual(this.repositionArgs, [scrollPercent, this.plugin.scrollBarMetricHeight, this.height])) {
      this.y = scrollPercent * this.plugin.scrollBarMetricHeight + this.height / 2
      this.repositionArgs = [scrollPercent, this.plugin.scrollBarMetricHeight, this.height]
    }
  }

  resize() {
    // resize the srollbar if any relevant vars have changed
    let metricHeight = this.plugin.scrollBarMetricHeight
    if (!_.isEqual(this.resizeArgs, [metricHeight, this.plugin.scrollableHeight, this.plugin.scrollBarWidth])) {
      this.width = this.plugin.scrollBarWidth
      this.height = (metricHeight / this.plugin.scrollableHeight * metricHeight - 3)
      this.generateFill()
      this.resizeArgs = [metricHeight, this.plugin.scrollableHeight, this.plugin.scrollBarWidth]
    }
  }
}

class ScrollablePlugin extends Phaser.Plugins.ScenePlugin {


  start(minScroll, maxScroll) {
    let camera = this.scene.cameras.main
    // handle mouse wheel inputs
    this.scene.scrollable = this
    this.game.canvas.addEventListener("wheel", () => this.handleMouseWheel(event))
    this.minScroll = minScroll
    this.maxScroll = maxScroll
    this.scrollableHeight = camera.height - minScroll + maxScroll
    this.scrollBarWidth = 5
    this.scrollBarMetricHeight = camera.height
    
    // handle drag inputs
    this.scene.dragZone = this.scene.add.zone(0, 0, this.game.config.width, this.game.config.height)
    this.scene.dragZone.setOrigin(0, 0)
    this.scene.dragZone.setInteractive()
    this.scene.dragZone.setScrollFactor(0)
    this.scene.input.setDraggable(this.scene.dragZone)
    this.scene.dragZone.on("drag", this.handleDrag, this)
    this.scene.dragZone.on("dragstart", this.handleDragStart, this)
    this.scene.dragZone.on("dragend", this.handleDragEnd, this)
    this.scene.input.keyboard.on("keydown", this.handleKey, this)

    // add a scrollbar
    this.scrollbar = new ScrollBar(this.scene, this)

    // I hate doing this on every frame but it seems like the only way
    this.scene.events.on("update", this.handleUpdate, this)

  }

  handleKey(event) {
    if (event.code === "ArrowDown") {
      this.scrollCamera(50)
    } else if (event.code === "ArrowUp") {
      this.scrollCamera(-50)
    }
  }

  handleMouseWheel(event) {
    event.stopPropagation()
    this.scrollCamera(event.deltaY)
  } 

  handleDragStart() {
    this.lastDrag = 0
  }

  handleDrag(pointer, dragX, dragY) {
    this.scrollCamera(this.lastDrag - dragY)
    this.lastDrag = dragY
  }

  handleDragEnd(pointer) {
    // add the wasDragged flag to the pointer for 50ms
    let dragDistance = Math.abs(pointer.downY - pointer.upY)
    if (dragDistance > 1) {
      pointer.wasDragged = true
      this.scene.time.delayedCall(
        50,
        function(o) { o.wasDragged = false },
        [pointer], this
      )
    }
  }

  handleUpdate() {
    this.scrollbar.bringToFront()
    this.scrollbar.reposition()
    this.scrollbar.resize()
  }

  scrollCamera(scrollDelta) {
    let
      camera = this.scene.cameras.main

    if (this.minScroll !== undefined && camera.scrollY + scrollDelta < this.minScroll) {
      camera.setScroll(0, this.minScroll)
    } else if (this.maxScroll !== undefined && camera.scrollY + scrollDelta > this.maxScroll) {
      camera.setScroll(0, this.maxScroll)
    } else {
      camera.setScroll(0, camera.scrollY + scrollDelta / 2)
    }
  }

}

export default ScrollablePlugin
