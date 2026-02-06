import nextPlugin from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';

import { GLOB_JSX, GLOB_TSX } from '../globs';
import { type Options } from '../types';

export function next(options: Options) {
  const { next: nextOption } = options;

  if (!nextOption) return [];

  const files = [GLOB_JSX, GLOB_TSX];

  return defineConfig([
    {
      files,
      plugins: {
        '@next/next': nextPlugin,
      },
      rules: {
        ...nextPlugin.configs.recommended.rules,
        ...nextPlugin.configs['core-web-vitals'].rules,
        '@next/next/no-img-element': 'off',
      },
    },
  ]);
}
