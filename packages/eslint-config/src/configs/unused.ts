import { defineConfig } from 'eslint/config';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

import { GLOB_SRC } from '../globs';

export function unused() {
  return defineConfig([
    {
      files: GLOB_SRC,
      plugins: {
        'unused-imports': unusedImportsPlugin,
      },
      rules: {
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          {
            args: 'after-used',
            argsIgnorePattern: '^_',
            vars: 'all',
            varsIgnorePattern: '^_',
          },
        ],
      },
    },
  ]);
}
