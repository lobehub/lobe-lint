import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  ignores: [
    '**/tests/fixtures/**',
    '**/eslint-typegen.d.ts',
    'packages/eslint-config/scripts/**',
    '.remarkrc.mjs',
  ],
  react: true,
  typescript: true,
});
