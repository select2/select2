import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
const license = require('rollup-plugin-license');
const path = require('path');

export default [
    // browser-friendly UMD build
    {
        input: 'bridge/src/select25.tsx',
        output: {
            name: 'select25',
            file: 'dist/select25.js',
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            resolve(),
            commonjs(),
            typescript(),
            uglify(),
            scss(),
            license({ banner: { file: path.join(__dirname, 'BANNER.txt'), encoding: 'utf-8' } })
        ]
    }
];
