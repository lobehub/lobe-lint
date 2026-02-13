import { defineConfig } from 'eslint/config';
import unicornPlugin from 'eslint-plugin-unicorn';

import { GLOB_CONFIG_FILES, GLOB_NEXT_APP_FILES, GLOB_SRC } from '../globs';

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

        // Styles
        'unicorn/catch-error-name': 0,
        'unicorn/explicit-length-check': 0,
        'unicorn/no-array-callback-reference': 0,
        'unicorn/require-module-specifiers': 0,
        'unicorn/no-array-for-each': 0,
        'unicorn/no-negated-condition': 0,
        'unicorn/no-null': 0,
        'unicorn/no-typeof-undefined': 0,
        'unicorn/no-useless-undefined': 0,
        'unicorn/prefer-code-point': 0,
        'unicorn/prefer-number-properties': 0,
        'unicorn/prefer-query-selector': 0,
        'unicorn/prefer-spread': 0,
        'unicorn/prefer-ternary': 0,
        'unicorn/prefer-type-error': 0,
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
