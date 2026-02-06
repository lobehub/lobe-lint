import { defineConfig } from 'eslint/config';
import regexpPlugin from 'eslint-plugin-regexp';

import { GLOB_SRC } from '../globs';
import { type Options } from '../types';

export function regexp(options: Options) {
  const { regexp: regexpOption = true } = options;

  if (!regexpOption) return [];

  return defineConfig([
    {
      files: GLOB_SRC,
      plugins: {
        regexp: regexpPlugin,
      },
      rules: {
        ...(regexpPlugin.configs['flat/recommended'].rules as any),
      },
    },
  ]);
}
