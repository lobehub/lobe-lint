import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

import { GLOB_JSX, GLOB_TSX } from '../globs';
import { type Options } from '../types';

/** react-hooks rules backed by the React Compiler (`warn` by default, `error` with `reactCompiler`). */
const REACT_COMPILER_RULES = [
  'config',
  'error-boundaries',
  'gating',
  'globals',
  'immutability',
  'incompatible-library',
  'preserve-manual-memoization',
  'purity',
  'refs',
  'set-state-in-effect',
  'set-state-in-render',
  'static-components',
  'unsupported-syntax',
  'use-memo',
] as const;

/** @eslint-react rules that duplicate a react-hooks rule (the react-hooks one is kept). */
export const ESLINT_REACT_DUPLICATES = [
  'error-boundaries',
  'exhaustive-deps',
  'purity',
  'rules-of-hooks',
  'set-state-in-effect',
  'set-state-in-render',
  'static-components',
  'unsupported-syntax',
  'use-memo',
] as const;

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

        // @eslint-react/eslint-plugin 5 ships its own copies of the react-hooks rules. Keep the
        // react-hooks ones (reference implementation; `exhaustive-deps` supports `additionalHooks`,
        // the compiler rules follow `reactCompiler`, existing disable comments keep working) and
        // turn the copies off, otherwise every violation is reported twice.
        ...Object.fromEntries(
          ESLINT_REACT_DUPLICATES.map((rule) => [`@eslint-react/${rule}`, 'off']),
        ),

        '@eslint-react/dom-no-dangerously-set-innerhtml': 'off',
        '@eslint-react/no-array-index-key': 'warn',
        '@eslint-react/no-leaked-conditional-rendering': 'off',

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
    // eslint-plugin-react-hooks 6+ ships the React Compiler diagnostics as separate rules and
    // replaces the deprecated eslint-plugin-react-compiler (its `zod-validation-error ^3` range
    // made package managers hoist 3.5.4, which lacks the `./v4` export react-hooks 7 requires).
    configs.push({
      files,
      rules: Object.fromEntries(
        REACT_COMPILER_RULES.map((rule) => [`react-hooks/${rule}`, 'error']),
      ),
    });
  }

  return configs;
}
