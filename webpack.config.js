const { IgnorePlugin } = require("webpack");
const dist = `${__dirname}/dist`;
const defaults = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /\.test.ts$/],
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
};
const buildConfig = {
  ...defaults,
  externalsPresets: { node: true },
  externals: ["prettier", "jsdom"],
  entry: {
    "create-manifest": "./src/build/create-manifest.ts",
  },
  target: "node",
  output: {
    filename: "[name].js",
    libraryTarget: "umd",
    path: dist + "/build",
  },
};
const webConfig = {
  ...defaults,
  entry: {
    "content-script": "./src/content-script.ts",
  },
  target: "web",

  output: {
    filename: "[name].js",
    libraryTarget: "umd",
    path: dist + "/web",
  },
};
module.exports = [buildConfig, webConfig];
