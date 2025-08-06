import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/meteogram-card.ts',
  output: {
    file: 'meteogram-card.js',
    format: 'es',
    sourcemap: false,
  },
  external: [
    'lit',
    'lit/decorators.js'
  ],
  plugins: [
    resolve(),
    typescript({
      // Override the outDir from tsconfig.json to match the Rollup output directory
      outDir: '.',
      rootDir: 'src'
    }),
    terser({
      format: {
        comments: false
      }
    })
  ]
};
