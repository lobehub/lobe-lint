import stylexPlugin from '@stylexjs/eslint-plugin';
import { defineConfig } from 'eslint/config';

import { GLOB_SRC } from '../globs';
import { type Options } from '../types';

export function stylex(options: Options) {
  const { stylex: stylexOption = false } = options;

  if (!stylexOption) return [];

  return defineConfig([
    {
      files: GLOB_SRC,
      plugins: {
        '@stylexjs': stylexPlugin as any,
      },
      rules: {
        '@stylexjs/no-conflicting-props': 'error',
        '@stylexjs/no-legacy-contextual-styles': 'error',
        '@stylexjs/no-lookahead-selectors': 'error',
        '@stylexjs/no-unused': 'error',
        '@stylexjs/valid-shorthands': 'error',
        '@stylexjs/valid-styles': 'error',
      },
    },
  ]);
}
