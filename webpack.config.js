/* global __dirname */

var path = require("path");
var webpack = require("webpack");

module.exports = {
  // create sourcemaps for the bundle
  devtool: "source-map",

  // where does the import chain start
  entry: path.resolve(__dirname, "src", "domless.js"),

  // custom translations and stuff
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname), "src"],
        loader: "babel-loader",
        options: {
          presets: ["env"]
        }
      },
      {
        test: /\.(xml)$/i,
        use: [
          {
            loader: "url-loader"
          },
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: "url-loader"
          },
          {
            loader: "image-webpack-loader",
            options: {
              query: {
                bypassOnDebug: true,
                interlaced: false,
                progressive: true,
                optimizationLevel: 7,
                gifsicle: {
                  interlaced: false
                },
                mozjpeg: {
                  quality: 65
                },
                pngquant: {
                  quality: "65-90",
                  speed: 4
                },
                svgo: {
                  plugins: [
                    {
                      removeViewBox: false
                    },
                    {
                      removeEmptyAttrs: false
                    }
                  ]
                }
              }
            }
          },
        ]
      },
    ],
  },

  // where to write the bundle in non-dev environments
  output: {
    path: path.resolve(__dirname, "static", "dist"),
    filename: "domless.js"
  },

  // other plugins
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin()
  ],

  // subsequent import statements resolve in this order
  resolve: {
    modules: [
      path.resolve(__dirname),
      path.resolve(__dirname, "node_modules")
    ]
  },

  // output formatting
  stats: {
    colors: true
  },

};
