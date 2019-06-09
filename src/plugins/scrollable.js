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
        hasOutline: false,
        hasFill: true,
        arcRadius: 3
      }
    )
    this.plugin = plugin
    this.setScrollFactor(0)
    this.resize()
    this.reposition()
    this.x = this.scene.game.config.width - this.plugin.scrollBarWidth / 2
    this.updateOn = _.union(
      this.updateOn,
      [
        "x", "y", "plugin.scrollbarMetricHeight",
        "plugin.minScroll", "plugin.maxScroll",
        "scene.cameras.main.scrollY", "scene.maxDepth"
      ]
    )
    this.updateCallback = this.initScrollBarComponents
    this.initScrollBarComponents()

  }

  initScrollBarComponents() {
    // don't do anything if I'm not yet initialized
    if (!this.initialized && this.plugin.initialized) {
      return
    }

    super.initElementComponents()

    this.reposition()
    this.resize()
    this.bringToFront()
  }

  reposition() {
    // reposition the srollbar if any relevant vars have changed
    let
      metricHeight = this.plugin.scrollBarMetricHeight,
      camera = this.scene.cameras.main,
      scrollableHeight = this.plugin.maxScroll - this.plugin.minScroll,
      scrollPercent = (camera.scrollY - this.plugin.minScroll) / scrollableHeight

    this.y = scrollPercent * metricHeight + this.height / 2
  }

  resize() {
    // resize the srollbar if any relevant vars have changed
    let
      metricHeight = this.plugin.scrollBarMetricHeight,
      scrollableHeight = this.plugin.maxScroll - this.plugin.minScroll,
      camera = this.scene.cameras.main

    if (Math.abs(this.plugin.minScroll) < 1 && Math.abs(this.plugin.maxScroll - camera.height) < 1) {
      this.setAlpha(0)
    } else {
      this.setAlpha(1)
    }
    this.width = this.plugin.scrollBarWidth
    this.height = (metricHeight / scrollableHeight * camera.height - 3)
  }

  bringToFront() {
    // bring scrollbar to top z pos if any renderable objects have been added to the scene
    this.setDepth(this.scene.maxDepth + 1)
  }


}

class ScrollablePlugin extends Phaser.Plugins.ScenePlugin {


  start(minScroll, maxScroll) {
    let camera = this.scene.cameras.main
    // handle mouse wheel inputs
    this.scene.scrollable = this
    this.game.canvas.addEventListener("wheel", () => this.handleMouseWheel(event))
    this.minScroll = Math.min(0, minScroll)
    this.maxScroll = Math.max(camera.height, maxScroll)
    this.scrollBarWidth = 5
    this.scrollBarMetricHeight = camera.height
    
    // handle drag inputs
    this.scene.input.keyboard.on("keydown", this.handleKey, this)

    // add a scrollbar
    this.scrollbar = new ScrollBar(this.scene, this)

    this.scene.events.on("update", this.handleUpdate, this)
    Object.defineProperty(
      this.scene, "maxDepth",
      {
        get: function() {
          return _.maxBy(this.children.list, "depth").depth
        }
      }
    )
    this.initialized = true

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
    // delegated for the user
    pointer
  }

  handleUpdate() {
    let pointer = this.scene.input.activePointer
    if (pointer.isDown && pointer.getDistanceY() > 5 && pointer.getDuration() > 25) {
      if (!pointer.isDragging) {
        this.handleDragStart()
      }
      pointer.isDragging = true
      this.handleDrag(pointer, 0, pointer.y - pointer.downY)
    } else if (pointer.isDragging) {
      pointer.isDragging = false
      this.handleDragEnd(pointer)
    }
  }

  scrollCamera(scrollDelta) {
    let
      camera = this.scene.cameras.main

    if (this.minScroll !== undefined && camera.scrollY + scrollDelta < this.minScroll) {
      camera.setScroll(0, this.minScroll)
    } else if (this.maxScroll !== undefined && camera.scrollY + scrollDelta + camera.height > this.maxScroll) {
      camera.setScroll(0, this.maxScroll - camera.height)
    } else {
      camera.setScroll(0, camera.scrollY + scrollDelta / 2)
    }
  }

}

export default ScrollablePlugin
