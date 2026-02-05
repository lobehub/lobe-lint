import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

import { GLOB_JSX, GLOB_TSX } from '../globs';
import type { Options } from '../types';

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
        'react-hooks': reactHooksPlugin,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...reactHooksPlugin.configs.recommended.rules,

        '@eslint-react/dom/no-dangerously-set-innerhtml': 'off',
        '@eslint-react/no-array-index-key': 'warn',
        '@eslint-react/no-leaked-conditional-rendering': 'warn',

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
