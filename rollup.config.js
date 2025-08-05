import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/meteogram-card.ts",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
  },
  plugins: [
    copy({
      targets: [
        { src: "src/meteogram-card.js", dest: "dist" }
      ]
    }),
    terser()
  ]
};
