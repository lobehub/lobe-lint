import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

import { GLOB_SRC } from '../globs';
import type { Options } from '../types';

export function stylisticConfig(options: Options) {
  const { stylistic: stylisticOption = true } = options;

  if (!stylisticOption) return [];

  return defineConfig([
    {
      files: GLOB_SRC,
      plugins: {
        '@stylistic': stylistic,
      },
      rules: {
        '@stylistic/jsx-self-closing-comp': 'warn',
      },
    },
  ]);
}
