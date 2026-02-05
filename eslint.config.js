import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  ignores: ['**/tests/fixtures/**'],
  react: true,
  typescript: true,
});
