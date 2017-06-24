/* global __dirname */

var path = require("path");
var webpack = require("webpack");

module.exports = {
  // create sourcemaps for the bundle
  devtool: "source-map",

  devServer: {
    inline: true
  },

  // where does the import chain start
  entry: "./src/domless.js",

  // where do the bundle files get written to
  output: {
    path: path.resolve(__dirname, "static", "dist"),
    filename: "domless.js"
  },

  // custom translations and stuff
  module: {
    loaders: [
      // transpile es6 to es5 during build
      {
        test: path.join(__dirname, "src"),
      }
    ]
  },

  // other plugins
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin()
  ],

  // output formatting
  stats: {
    colors: true
  },

};
