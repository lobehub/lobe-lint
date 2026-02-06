import { defineConfig } from 'eslint/config';
import reactNativePlugin from 'eslint-plugin-react-native';

import { GLOB_JSX, GLOB_TSX } from '../globs';
import { type Options } from '../types';

export function reactNative(options: Options) {
  const { reactNative: reactNativeOption } = options;

  if (!reactNativeOption) return [];

  const files = [GLOB_JSX, GLOB_TSX];

  return defineConfig([
    {
      files,
      plugins: {
        'react-native': reactNativePlugin,
      },
      languageOptions: {
        globals: {
          __DEV__: 'readonly',
        },
      },
      rules: {
        'react-native/no-color-literals': 'warn',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-raw-text': 'off',
        'react-native/no-single-element-style-arrays': 'warn',
        'react-native/no-unused-styles': 'error',
        'react-native/split-platform-components': 'warn',
      },
    },
  ]);
}
