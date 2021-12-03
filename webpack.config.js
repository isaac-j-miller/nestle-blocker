const dist = `${__dirname}/dist`;
const defaults = {
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
  output: {
    filename: "[name].js",
    libraryTarget: "umd",
    path: dist,
  },
};
const webConfig = {
  ...defaults,
  entry: {
    "content-script": "./src/content-script.ts",
  },
  target: "web",
};
const buildConfig = {
  ...defaults,
  externalsPresets: { node: true },
  externals: ["prettier"],
  entry: {
    "create-manifest": "./src/build/create-manifest.ts",
  },
  target: "node",
};
module.exports = [webConfig, buildConfig];
