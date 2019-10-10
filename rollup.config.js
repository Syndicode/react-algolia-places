const peerDepsExternal = require("rollup-plugin-peer-deps-external");

module.exports = {
  input: "index.js",
  output: {
    file: "bundle.js",
    format: "cjs",
    exports: "default"
  },
  plugins: [
    peerDepsExternal()
  ]
};
