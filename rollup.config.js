const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const babel = require("rollup-plugin-babel");

module.exports = {
  input: "./src/index.js",
  output: [
    {
      file: "./build/bundle.umd.js",
      format: "umd",
      name: "ReactAlgoliaPlaces",
      globals: {
        react: "react",
        algoliasearch: "algoliasearch",
      },
      plugins: [
        babel({
          exclude: "node_modules/**",
          presets: [
            "@babel/preset-env",
            { modules: false, targets: { browsers: "not dead" } },
          ],
        }),
      ],
    },
    {
      file: "./build/bundle.es.js",
      format: "esm",
    },
    {
      file: "./build/bundle.cjs.js",
      format: "cjs",
    },
  ],
  plugins: [peerDepsExternal()],
};
