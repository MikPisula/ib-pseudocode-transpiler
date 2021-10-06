import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { string } from "rollup-plugin-string";

export default {
  input: 'src/generator/generator.js',
  output: [
    {
      file: 'dist/cjs/generator.js',
      exports: "default",
      format: 'cjs'
    },
    {
      file: 'dist/es/generator.js',
      format: 'es'
    }
  ],

  plugins: [
    resolve(),
    commonjs(),
    string({
      include: "**/runtime.js",
    })
  ]
};