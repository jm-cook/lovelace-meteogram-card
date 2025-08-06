import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/meteogram-card.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: false,
  },
  external: [
    'lit',
    'lit/decorators.js'
  ],
  plugins: [
    resolve(),
    typescript(),
    terser({
      format: {
        comments: false
      }
    })
  ]
};
