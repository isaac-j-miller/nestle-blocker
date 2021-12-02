module.exports = {
    presets: [
      ['@babel/preset-env', {targets: {node: true}}],
      '@babel/preset-typescript',
    ],
    plugins: [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-transform-typescript",
    ],
  };