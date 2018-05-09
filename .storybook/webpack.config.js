const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: ["to-string-loader", "css-loader"]
      }
    ]
  }
};