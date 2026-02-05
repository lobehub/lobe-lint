import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

import { GLOB_TS_ALL } from '../globs';
import type { Options } from '../types';

export function typescript(options: Options) {
  const {
    typescript: tsOption,
    typeChecked,
    tsconfigPath,
    parserOptions: userParserOptions,
  } = options;

  if (!tsOption) return [];

  const isStrict = tsOption === 'strict';

  const baseConfigs = isStrict
    ? typeChecked
      ? tseslint.configs.strictTypeChecked
      : tseslint.configs.strict
    : typeChecked
      ? tseslint.configs.recommendedTypeChecked
      : tseslint.configs.recommended;

  const configs = defineConfig([
    ...baseConfigs,
    {
      files: GLOB_TS_ALL,
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          ...(typeChecked && {
            projectService: !tsconfigPath,
            project: tsconfigPath,
          }),
          ...userParserOptions,
        },
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            disallowTypeAnnotations: false,
            fixStyle: 'separate-type-imports',
            prefer: 'type-imports',
          },
        ],
        '@typescript-eslint/method-signature-style': ['error', 'property'],
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-unused-expressions': [
          'error',
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
          },
        ],

        ...(isStrict
          ? {}
          : {
              '@typescript-eslint/ban-ts-comment': 'off',
              '@typescript-eslint/no-explicit-any': 'off',
              '@typescript-eslint/no-empty-object-type': 'off',
              '@typescript-eslint/no-require-imports': 'off',
            }),

        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-useless-constructor': 'off',
      },
    },
  ]);

  if (typeChecked) {
    configs.push({
      files: GLOB_TS_ALL,
      rules: {
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
        '@typescript-eslint/require-await': 'error',
      },
    });
  }

  return configs;
}
