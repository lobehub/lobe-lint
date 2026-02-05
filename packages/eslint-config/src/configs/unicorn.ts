import { defineConfig } from 'eslint/config';
import unicornPlugin from 'eslint-plugin-unicorn';

import { GLOB_SRC } from '../globs';

const GLOB_NEXT_APP_FILES = [
  '**/app/**/page.{js,jsx,ts,tsx}',
  '**/app/**/layout.{js,jsx,ts,tsx}',
  '**/app/**/loading.{js,jsx,ts,tsx}',
  '**/app/**/error.{js,jsx,ts,tsx}',
  '**/app/**/not-found.{js,jsx,ts,tsx}',
  '**/app/**/template.{js,jsx,ts,tsx}',
  '**/app/**/default.{js,jsx,ts,tsx}',
  '**/app/**/route.{js,ts}',
  '**/app/**/opengraph-image.{js,jsx,ts,tsx}',
  '**/app/**/twitter-image.{js,jsx,ts,tsx}',
  '**/app/**/apple-icon.{js,jsx,ts,tsx}',
  '**/app/**/icon.{js,jsx,ts,tsx}',
  '**/app/**/sitemap.{js,ts}',
  '**/app/**/robots.{js,ts}',
  '**/app/**/manifest.{js,ts}',
];

const GLOB_CONFIG_FILES = ['**/*.config.{js,mjs,ts,mts,cjs,cts}', '**/.*.{js,mjs,ts,mts,cjs,cts}'];

export function unicorn() {
  return defineConfig([
    {
      files: GLOB_SRC,
      plugins: {
        unicorn: unicornPlugin,
      },
      rules: {
        // ===== Error Prevention / Bug Detection =====
        'unicorn/better-regex': 'warn',
        'unicorn/error-message': 'error',
        'unicorn/new-for-builtins': 'error',
        'unicorn/no-abusive-eslint-disable': 'error',
        'unicorn/no-accessor-recursion': 'error',
        'unicorn/no-await-in-promise-methods': 'error',
        'unicorn/no-immediate-mutation': 'error',
        'unicorn/no-instanceof-builtins': 'error',
        'unicorn/no-invalid-fetch-options': 'error',
        'unicorn/no-invalid-remove-event-listener': 'error',
        'unicorn/no-negation-in-equality-check': 'error',
        'unicorn/no-single-promise-in-promise-methods': 'error',
        'unicorn/no-thenable': 'error',
        'unicorn/throw-new-error': 'error',

        // ===== Code Cleanliness =====
        'unicorn/escape-case': 'warn',
        'unicorn/no-anonymous-default-export': 'error',
        'unicorn/no-console-spaces': 'warn',
        'unicorn/no-empty-file': 'warn',
        'unicorn/no-lonely-if': 'warn',
        'unicorn/no-new-array': 'error',
        'unicorn/no-new-buffer': 'error',
        'unicorn/no-unnecessary-await': 'error',
        'unicorn/no-unreadable-iife': 'warn',
        'unicorn/no-useless-fallback-in-spread': 'warn',
        'unicorn/no-useless-length-check': 'warn',
        'unicorn/no-useless-promise-resolve-reject': 'warn',
        'unicorn/no-useless-spread': 'warn',
        'unicorn/no-useless-switch-case': 'warn',
        'unicorn/no-zero-fractions': 'warn',
        'unicorn/number-literal-case': 'warn',
        'unicorn/switch-case-braces': 'warn',
        'unicorn/text-encoding-identifier-case': 'warn',
        'unicorn/import-style': 'warn',

        // ===== Modern APIs =====
        'unicorn/prefer-array-find': 'warn',
        'unicorn/prefer-array-flat': 'warn',
        'unicorn/prefer-array-flat-map': 'warn',
        'unicorn/prefer-array-index-of': 'warn',
        'unicorn/prefer-array-some': 'warn',
        'unicorn/prefer-at': 'warn',
        'unicorn/prefer-date-now': 'warn',
        'unicorn/prefer-includes': 'warn',
        'unicorn/prefer-logical-operator-over-ternary': 'warn',
        'unicorn/prefer-node-protocol': 'warn',
        'unicorn/prefer-object-from-entries': 'warn',
        'unicorn/prefer-regexp-test': 'warn',
        'unicorn/prefer-string-replace-all': 'warn',
        'unicorn/prefer-string-slice': 'warn',
        'unicorn/prefer-string-starts-ends-with': 'warn',
        'unicorn/prefer-structured-clone': 'warn',
      },
    },
    {
      files: GLOB_NEXT_APP_FILES,
      rules: {
        'unicorn/no-anonymous-default-export': 'off',
      },
    },
    {
      files: GLOB_CONFIG_FILES,
      rules: {
        'unicorn/no-anonymous-default-export': 'off',
      },
    },
  ]);
}
