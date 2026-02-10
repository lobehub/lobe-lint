import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

import { GLOB_SRC, GLOB_TEST } from '../globs';

const GLOB_SCRIPTS = ['**/scripts/**'];

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
        // Only disallow console.log, allow console.warn/error/info/etc.
        'no-console': [
          'error',
          {
            allow: [
              'warn',
              'error',
              'info',

              'table',

              'group',
              'groupCollapsed',
              'groupEnd',

              'assert',
              'clear',
            ],
          },
        ],
        'no-empty': 'warn',
        'no-extra-boolean-cast': 'off',
        'no-unused-vars': 'off',
      },
    },
    // Allow all console in test and script files
    {
      files: [...GLOB_TEST, ...GLOB_SCRIPTS],
      rules: {
        'no-console': 'off',
      },
    },
  ]);
}
