import { defineConfig } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';

import { GLOB_JSX, GLOB_TSX } from '../globs';
import type { Options } from '../types';

export function a11y(options: Options) {
  const { a11y: a11yOption, react: reactOption } = options;

  if (!a11yOption || !reactOption) return [];

  const files = [GLOB_JSX, GLOB_TSX];

  return defineConfig([
    {
      files,
      plugins: {
        'jsx-a11y': jsxA11y,
      },
      rules: {
        ...jsxA11y.flatConfigs.recommended.rules,
        'jsx-a11y/alt-text': 'warn',
        'jsx-a11y/anchor-has-content': 'warn',
        'jsx-a11y/anchor-is-valid': 'warn',
        'jsx-a11y/click-events-have-key-events': 'warn',
        'jsx-a11y/no-static-element-interactions': 'warn',
      },
    },
  ]);
}
