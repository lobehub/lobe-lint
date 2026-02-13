import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

import { GLOB_CONFIG_FILES, GLOB_NEXT_APP_FILES, GLOB_SRC, GLOB_TEST } from '../globs';

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
        'no-useless-rename': 'error',
        'object-shorthand': ['error', 'properties', { avoidQuotes: true }],
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
        'no-restricted-syntax': [
          'warn',
          {
            selector: 'ExportDefaultDeclaration',
            message: 'Default export is not allowed. Use named exports instead.',
          },
        ],
      },
    },
    // Allow default export in config and Next.js App Router files
    {
      files: [...GLOB_CONFIG_FILES, ...GLOB_NEXT_APP_FILES],
      rules: {
        'no-restricted-syntax': 'off',
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
