import { jsdom } from "jsdom"
import canvas from "canvas-prebuilt"
import Phaser from "phaser"

const doc = jsdom("<!doctype html><html><body></body></html>")
const win = doc.defaultView

global.document = doc
global.window = win
global.Image = canvas.Image

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key]
  }

})
