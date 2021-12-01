const dist = `${__dirname}/dist`;

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/typescript"],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-transform-typescript",
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  mode: "development",
  devtool: "source-map",
  entry: {
    background: "./src/background.ts",
    "content-script": "./src/content-script.ts",
  },
  target: "web",
  output: {
    filename: "[name].js",
    libraryTarget: "umd",
    path: dist,
  },
};
