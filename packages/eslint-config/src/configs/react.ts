import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import reactPlugin from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

import { GLOB_JSX, GLOB_TSX } from '../globs';
import { type Options } from '../types';

export function react(options: Options) {
  const { react: reactOption, reactCompiler: reactCompilerOption } = options;

  if (!reactOption) return [];

  const files = [GLOB_JSX, GLOB_TSX];

  const configs = defineConfig([
    {
      files,
      ...eslintReact.configs['recommended-typescript'],
    },
    {
      files,
      plugins: {
        'react': reactPlugin,
        'react-hooks': reactHooksPlugin as any,
        'react-refresh': reactRefresh,
      },
      rules: {
        'react-hooks/exhaustive-deps': 'warn',
        'react-hooks/rules-of-hooks': 'error',

        'react-hooks/config': 'warn',
        'react-hooks/error-boundaries': 'warn',
        'react-hooks/gating': 'warn',
        'react-hooks/globals': 'warn',
        'react-hooks/immutability': 'warn',
        'react-hooks/incompatible-library': 'warn',
        'react-hooks/preserve-manual-memoization': 'warn',
        'react-hooks/purity': 'warn',
        'react-hooks/refs': 'warn',
        'react-hooks/set-state-in-effect': 'warn',
        'react-hooks/set-state-in-render': 'warn',
        'react-hooks/static-components': 'warn',
        'react-hooks/unsupported-syntax': 'warn',
        'react-hooks/use-memo': 'warn',

        '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
        '@eslint-react/no-array-index-key': 'warn',
        '@eslint-react/no-leaked-conditional-rendering': 'off',

        '@eslint-react/error-boundaries': 'warn',
        '@eslint-react/set-state-in-render': 'warn',
        '@eslint-react/static-components': 'warn',
        '@eslint-react/unsupported-syntax': 'warn',
        '@eslint-react/use-memo': 'warn',

        'react/self-closing-comp': 'warn',

        'react-refresh/only-export-components': [
          'warn',
          {
            allowConstantExport: true,
            allowExportNames:
              reactOption === 'next'
                ? [
                    'dynamic',
                    'dynamicParams',
                    'revalidate',
                    'fetchCache',
                    'runtime',
                    'preferredRegion',
                    'maxDuration',
                    'config',
                    'generateStaticParams',
                    'metadata',
                    'generateMetadata',
                    'viewport',
                    'generateViewport',
                  ]
                : reactOption === 'remix'
                  ? ['meta', 'links', 'headers', 'loader', 'action']
                  : undefined,
          },
        ],
      },
      settings: {
        'react-x': {
          version: 'detect',
        },
      },
    },
  ]);

  if (reactCompilerOption) {
    configs.push({
      files,
      plugins: {
        'react-compiler': reactCompiler,
      },
      rules: {
        'react-compiler/react-compiler': 'error',
      },
    });
  }

  return configs;
}
