/* global __dirname */

var path = require("path");
var webpack = require("webpack");

module.exports = {
  // create sourcemaps for the bundle
  devtool: "source-map",

  devServer: {
    contentBase: [
      path.join(__dirname, "./demo"),
      path.join(__dirname, "./")
    ],
  },

  // where does the import chain start
  entry: "./demo/main.js",

  // custom translations and stuff
  module: {
    rules: [
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

  // other plugins
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin(),
  ],

  // where do the bundle files get written to
  output: {
    path: path.resolve(__dirname, "static-demo", "dist"),
    filename: "bundle.js"
  },

  resolve: {
    modules: [
      path.resolve("./"),
      path.resolve("./demo"),
      path.resolve("./node_modules")
    ]
  },

  // output formatting
  stats: {
    colors: true
  },

};
