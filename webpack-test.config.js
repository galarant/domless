var nodeExternals = require("webpack-node-externals");

var config = {
  target: "node",
  externals: [nodeExternals()],
};

module.exports = config;
