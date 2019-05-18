import _ from "lodash"

import Phaser from "phaser"
import Element from  "src/components/element"

/**
 * A plugin that adds scrollable functionality to a scene
 */

class ScrollBar extends Element {

  constructor(scene) {
    let
      camera = scene.cameras.main,
      scrollBarWidth = 5,
      scrollBarHeight = (camera.height / scene.scrollableHeight) * camera.height - 3

    super(
      scene,
      {
        width: scrollBarWidth,
        height: scrollBarHeight,
        x: scene.game.config.width - scrollBarWidth / 2,
        y: scrollBarHeight / 2,
        outline: false,
        fill: true,
        arcRadius: 3
      }
    )
    this.setScrollFactor(0)
    this.reposition()

    // always bring scrollbar to top when things are added to the scene
    // I hate doing this on every frame but it seems like the only way
    this.scene.events.on("update", this.bringMeToTop, this)
  }

  bringMeToTop() {
    if (this.sceneChildren !== this.scene.children.length) {
      let maxZ = _.maxBy(this.scene.children.list, "z").z
      this.setDepth(maxZ + 1)
      this.sceneChildren = this.scene.children.length
    }
  }

  reposition() {
    let
      camera = this.scene.cameras.main,
      scrollPercent = (camera.scrollY - this.scene.minScroll) / this.scene.scrollableHeight
    this.y = scrollPercent * camera.height + this.height / 2
  }

  resize() {
    // TODO: left off here
    
  }

}

class ScrollablePlugin extends Phaser.Plugins.ScenePlugin {


  start(minScroll, maxScroll) {
    // handle mouse wheel inputs
    this.scene.scrollable = this
    this.game.canvas.addEventListener("wheel", () => this.handleMouseWheel(event))
    this.scene.minScroll = minScroll
    this.scene.maxScroll = maxScroll
    this.scene.scrollableHeight = this.scene.cameras.main.height - minScroll + maxScroll
    
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
    this.scene.scrollbar = new ScrollBar(this.scene)

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
    pointer.wasDragged = true
    this.scene.time.delayedCall(
      50,
      function(o) { o.wasDragged = false },
      [pointer], this
    )
  }

  scrollCamera(scrollDelta) {
    let
      camera = this.scene.cameras.main

    if (this.scene.minScroll !== undefined && camera.scrollY + scrollDelta < this.scene.minScroll) {
      camera.setScroll(0, this.scene.minScroll)
    } else if (this.scene.maxScroll !== undefined && camera.scrollY + scrollDelta > this.scene.maxScroll) {
      camera.setScroll(0, this.scene.maxScroll)
    } else {
      camera.setScroll(0, camera.scrollY + scrollDelta / 2)
    }
    this.scene.scrollbar.reposition()
  }

}

export default ScrollablePlugin
