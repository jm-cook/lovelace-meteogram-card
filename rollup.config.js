import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const dev = process.env.ROLLUP_WATCH;

export default {
  input: 'src/meteogram-card.ts',
  output: {
    file: 'dist/meteogram-card.js',
    format: 'es',
    sourcemap: dev ? true : false,
  },
  plugins: [
    resolve({
      browser: true,
      dedupe: ['lit']
    }),
    json(),
    typescript({
      compilerOptions: {
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
      }
    }),
    // !dev && terser({
    //   format: {
    //     comments: false // Keep comments to preserve the banner
    //   },
    //   ecma: 2020,
    //   compress: true,
    //   // mangle: {
    //   //   properties: {
    //   //     regex: /^_/,
    //   //   },
    //   // },
    // }),
  ],
  external: [
    // Remove 'lit' and 'lit/decorators.js' from externals so they are bundled
  ]
};
