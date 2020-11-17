import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';

import pkg from './package.json';

const OUTPUT_DIR = 'dist';
const INPUT = './src/index.js';

export default [
  // UMD
  {
    input: INPUT,
    plugins: [
      nodeResolve(),
      babel({
        babelHelpers: 'bundled',
      }),
      terser(),
    ],
    output: {
      file: `${OUTPUT_DIR}/${pkg.name}.min.js`,
      format: 'umd',
      name: 'VBCanvas',
      esModule: false,
      exports: 'named',
      sourcemap: true,
    },
  },
  // ESM + CJS
  {
    input: INPUT,
    plugins: [nodeResolve()],
    external: ['lodash-es', 'resize-observer-polyfill'],
    output: [
      // ESM
      {
        dir: `${OUTPUT_DIR}/esm`,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      // CJS
      {
        dir: `${OUTPUT_DIR}/cjs`,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
  },
];
