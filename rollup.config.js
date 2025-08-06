import typescript from '@rollup/plugin-typescript';
  import terser from '@rollup/plugin-terser';
  import resolve from '@rollup/plugin-node-resolve';

  export default {
    input: 'src/meteogram-card.ts',
    output: {
      file: 'dist/meteogram-card.js',
      format: 'iife',
      name: 'MeteogramCard',
      sourcemap: true
    },
    plugins: [
      resolve(),
      typescript(),
      terser()
    ]
  };