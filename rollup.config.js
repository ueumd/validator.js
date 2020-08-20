import {uglify} from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";
const pack = require('./package.json')
const YEAR = new Date().getFullYear()
export default {
  input: 'src/validator.js',
  output: [
    {
      file: 'dist/validator.esm.js',
      name: 'validator',
      format: 'esm'
    },
    {
      file: 'dist/validator.cjs.js',
      name: 'validator',
      format: 'cjs'
    },
  ],
  banner   () {
    return `/*!
     * ${pack.name} v${pack.version}
     * (c) ${YEAR} ${pack.author.name} ${pack.author.email}
     * Release under the ${pack.license} License.
     */`
  },
}
