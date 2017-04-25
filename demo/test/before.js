import { jsdom } from "jsdom";
import canvas from "canvas-prebuilt";

const doc = jsdom("<!doctype html><html><body></body></html>");
const win = doc.defaultView;

global.document = doc;
global.window = win;
global.Image = canvas.Image;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }

});

var PIXI = require("../../static/vendor/phaser/build/pixi.js");
var p2 = require("../../static/vendor/phaser/build/p2.js");

global.PIXI = PIXI;
global.p2 = p2;

var Phaser = require("../../static/vendor/phaser/build/phaser.js");

global.Phaser = Phaser;
