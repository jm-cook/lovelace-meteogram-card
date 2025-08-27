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
    // Fix the imports to avoid variable naming conflicts
    banner: `// Import required lit modules
const litModulesPromise = Promise.all([
  import("https://unpkg.com/lit@3.1.0/index.js?module"),
  import("https://unpkg.com/lit@3.1.0/decorators.js?module")
]).then(([litCore, litDecorators]) => {
  window.litElementModules = {
    LitElement: litCore.LitElement,
    html: litCore.html,
    css: litCore.css,
    customElement: litDecorators.customElement,
    property: litDecorators.property,
    state: litDecorators.state
  };
});
`
  },
  plugins: [
    resolve({
      browser: true,
      dedupe: ['lit']
    }),
    json(),
    typescript({
      // Add compilation options to ignore the imports we'll replace at runtime
      compilerOptions: {
        skipLibCheck: true,
        allowSyntheticDefaultImports: true,
      }
    })
    ,
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
  // Add these modules as externals
  external: [
    'lit',
    'lit/decorators.js'
  ]
};
