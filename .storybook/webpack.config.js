const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: ["to-string-loader", "css-loader"]
      },
      {
        test: /\.svg$/,
        loaders: ["to-string-loader", "svg-inline-loader"]
      }
    ]
  }
};