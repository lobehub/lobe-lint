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
        ...unicornPlugin.configs['flat/recommended'].rules,
        'unicorn/catch-error-name': 'off',
        'unicorn/explicit-length-check': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/import-style': 'off',
        'unicorn/no-anonymous-default-export': 'error',
        'unicorn/no-array-callback-reference': 'off',
        'unicorn/no-array-for-each': 'off',
        'unicorn/no-array-push-push': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-empty-file': 'warn',
        'unicorn/no-negated-condition': 'off',
        'unicorn/no-nested-ternary': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-typeof-undefined': 'off',
        'unicorn/no-useless-undefined': 'off',
        'unicorn/prefer-code-point': 'off',
        'unicorn/prefer-logical-operator-over-ternary': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/prefer-number-properties': 'off',
        'unicorn/prefer-query-selector': 'off',
        'unicorn/prefer-spread': 'off',
        'unicorn/prefer-string-raw': 'off',
        'unicorn/prefer-string-replace-all': 'warn',
        'unicorn/prefer-ternary': 'off',
        'unicorn/prefer-type-error': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/switch-case-braces': 'warn',
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
