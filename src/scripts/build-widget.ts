/* eslint-disable @typescript-eslint/no-require-imports */
const esbuild = require('esbuild');
const path = require('path');

esbuild
  .build({
    entryPoints: [path.resolve(__dirname, '../widget/index.tsx')],
    bundle: true,
    outfile: path.resolve(__dirname, '../../public/widget.js'),
    format: 'iife',
    globalName: 'GlobalWidget',
    loader: { '.tsx': 'tsx' },
    jsx: 'automatic',
    minify: true,
    alias: {
      '@': path.resolve(__dirname, '../'),
    },
  })
  .catch(() => process.exit(1));
