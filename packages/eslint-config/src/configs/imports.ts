import { defineConfig } from 'eslint/config';
import { importX } from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import { GLOB_SRC } from '../globs';
import { type Options } from '../types';

export function imports(options: Options) {
  const { sortImports = true } = options;

  const configs = defineConfig([
    {
      files: GLOB_SRC,
      plugins: {
        'import-x': importX as any,
      },
      settings: {
        'import-x/resolver': {
          node: true,
          typescript: true,
        },
      },
      rules: {
        'import-x/first': 'error',
        'import-x/newline-after-import': 'error',
        'import-x/no-duplicates': 'error',
        'import-x/no-mutable-exports': 'error',
        'import-x/no-self-import': 'error',
        'import-x/consistent-type-specifier-style': ['error', 'prefer-inline'],
      },
    },
  ]);

  if (sortImports) {
    configs.push({
      files: GLOB_SRC,
      plugins: {
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'sort-imports': 'off',
      },
    });
  }

  return configs;
}
