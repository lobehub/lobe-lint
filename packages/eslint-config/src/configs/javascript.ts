import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

import { GLOB_SRC } from '../globs';

export function javascript() {
  return defineConfig([
    {
      ...js.configs.recommended,
      files: GLOB_SRC,
      languageOptions: {
        ecmaVersion: 'latest',
        globals: {
          ...globals.browser,
          ...globals.node,
          ...globals.es2021,
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 'latest',
          sourceType: 'module',
        },
        sourceType: 'module',
      },
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
      },
      rules: {
        ...js.configs.recommended.rules,
        'no-empty': 'warn',
        'no-extra-boolean-cast': 'off',
        'no-unused-vars': 'off',
      },
    },
  ]);
}
