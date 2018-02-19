/* global __dirname */

var path = require("path")
var webpack = require("webpack")

module.exports = {
  // configure the development server
  devServer: {
    contentBase: [
      path.resolve(__dirname),
      path.resolve(__dirname, ".."),
    ],
    publicPath: "/static-demo/dist/",
  },

  // create sourcemaps for the bundle
  devtool: "source-map",

  // where to start the import chain
  entry: path.resolve(__dirname, "main.js"),

  // custom translations and stuff
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname), path.resolve(__dirname, "..", "src")],
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

  // other plugins
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin()
  ],

  // where to write the bundle in non-dev environments
  // also some extra serve info
  output: {
    path: path.resolve(__dirname, "..", "static-demo", "dist"),
    filename: "demo.js",
  },

  resolve: {
    modules: [
      path.resolve(__dirname),
      path.resolve(__dirname, ".."),
      path.resolve(__dirname, "..", "node_modules"),
    ]
  }

}
