import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'node18',
  sourcemap: false,
  outputOptions: {
    banner: '#!/usr/bin/env node',
  },
});
