import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react-hook-form',
    'react-draggable',
    'lucide-react',
    '@emotion/react',
    '@emotion/styled',
    '@mui/material',
    '@mui/icons-material',
  ],
  treeshake: true,
  minify: false,
  target: 'es2020',
});