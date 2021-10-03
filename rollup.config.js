import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/generator/generator.js',
  output: {
    file: 'dist/cjs/generator.js',
    exports: "default",
    format: 'cjs'
  },
  output: {
    file: 'dist/es/generator.js',
    format: 'es'
  },

  plugins: [
    resolve(),
    commonjs()
  ]
};