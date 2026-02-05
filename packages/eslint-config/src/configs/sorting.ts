import { defineConfig } from 'eslint/config';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import reactPlugin from 'eslint-plugin-react';

import { GLOB_JSX, GLOB_TS_ALL, GLOB_TSX } from '../globs';
import type { Options } from '../types';

export function sorting(options: Options) {
  const { sortKeys = true } = options;

  if (!sortKeys) return [];

  return defineConfig([
    // TypeScript interface and enum sorting
    {
      files: GLOB_TS_ALL,
      plugins: {
        perfectionist: perfectionistPlugin,
      },
      rules: {
        'perfectionist/sort-enums': [
          'error',
          {
            order: 'asc',
            type: 'natural',
          },
        ],
        'perfectionist/sort-interfaces': [
          'error',
          {
            order: 'asc',
            type: 'natural',
          },
        ],
      },
    },
    // JSX props sorting
    {
      files: [GLOB_JSX, GLOB_TSX],
      plugins: {
        react: reactPlugin,
      },
      rules: {
        'react/jsx-sort-props': [
          'warn',
          {
            callbacksLast: true,
            multiline: 'last',
            shorthandFirst: true,
          },
        ],
      },
    },
  ]);
}
