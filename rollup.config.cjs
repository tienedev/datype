const typescript = require('@rollup/plugin-typescript');
const { default: terser } = require('@rollup/plugin-terser');

const createConfig = (format) => ({
  input: 'src/index.ts',
  output: format === 'umd' ? {
    file: 'dist/umd/datype.js',
    format: 'umd',
    name: 'Datype',
    exports: 'named',
    compact: true
  } : {
    dir: `dist/${format}`,
    format: format === 'esm' ? 'es' : format,
    preserveModules: true,
    preserveModulesRoot: 'src',
    exports: 'named',
    entryFileNames: format === 'cjs' ? '[name].cjs' : '[name].js',
    chunkFileNames: format === 'cjs' ? '[name].cjs' : '[name].js'
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
      declaration: false,
      declarationMap: false,
      outDir: undefined,
      target: format === 'umd' ? 'es2015' : 'es2020'
    }),
    // Only minify UMD build
    ...(format === 'umd' ? [terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
        passes: 2
      },
      mangle: {
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false
      }
    })] : [])
  ],
  external: []
});

module.exports = [
  createConfig('esm'),
  createConfig('cjs'),
  createConfig('umd')
];