/* global __dirname */

var path = require("path");

var parentConfig = require("../webpack.config");
var nodeExternals = require("webpack-node-externals");

var config = Object.assign(parentConfig, {

  // where does the import chain start
  entry: path.resolve(__dirname, "main.js"),

  // exclude these dependencies from output bundles
  externals: [nodeExternals()],

  target: "node",

});

config.module.rules.push(
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
      {
        loader: "istanbul-instrumenter-loader",
        options: {
          esModules: true
        }
      }
    ]
  }
);

module.exports = config;
