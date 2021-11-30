const path = require("path");

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
              presets: ["@babel/react", "@babel/typescript"],
              plugins: [
                [
                  "babel-plugin-module-resolver",
                  {
                    root: ["./packages/host/src"],
                    alias: {
                      common: "./packages/common/src",
                      host: "./packages/host/src",
                    },
                  },
                ],
                "babel-plugin-transform-typescript-metadata",
                ["@babel/plugin-proposal-decorators", { legacy: true }],
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
    "background": "./src/nestle-blocker.ts",
    "kroger": "./src/vendors/kroger.ts",
  },
  target: "node",
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: dist,
  },
};
