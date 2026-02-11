import { defineConfig } from 'eslint/config';
import eslintPluginYml from 'eslint-plugin-yml';

import { type Options } from '../types';

export function yml(options: Options) {
  const { yml: ymlOption = true } = options;

  if (!ymlOption) return [];

  return defineConfig([
    ...eslintPluginYml.configs.recommended,
    {
      rules: {
        'yml/quotes': [
          'error',
          {
            avoidEscape: true,
            prefer: 'single',
          },
        ],
      },
    },
  ]);
}
