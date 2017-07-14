/* global __dirname */

var path = require("path");

var parentConfig = require("../webpack.config");
var nodeExternals = require("webpack-node-externals");

var config = {

  // where does the import chain start
  entry: path.resolve(__dirname, "main.js"),

  // exclude these dependencies from output bundles
  externals: [nodeExternals()],

  target: "node",

};

module.exports = Object.assign(parentConfig, config);
