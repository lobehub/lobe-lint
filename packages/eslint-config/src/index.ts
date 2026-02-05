import { a11y } from './configs/a11y';
import { eslintCommentsConfig } from './configs/eslint-comments';
import { ignores } from './configs/ignores';
import { imports } from './configs/imports';
import { javascript } from './configs/javascript';
import { next } from './configs/next';
import { react } from './configs/react';
import { reactNative } from './configs/react-native';
import { regexp } from './configs/regexp';
import { sorting } from './configs/sorting';
import { typescript } from './configs/typescript';
import { unicorn } from './configs/unicorn';
import { unused } from './configs/unused';
import type { FlatConfig, FlatConfigArray, Options } from './types';

export type { FlatConfig, FlatConfigArray, Linter, Options, ParserOptions } from './types';

export function defineConfig(options: Options = {}, ...userConfigs: FlatConfig[]): FlatConfigArray {
  const {
    a11y: a11yOption = false,
    ignores: userIgnores = [],
    next: nextOption = false,
    react: reactOption = false,
    reactNative: reactNativeOption = false,
    regexp: regexpOption = true,
    sortImports = true,
    sortKeys = true,
    typeChecked = false,
    typescript: tsOption = true,
  } = options;

  const configs: FlatConfigArray = [
    ignores(userIgnores),
    ...javascript(),
    ...typescript({ ...options, typeChecked, typescript: tsOption }),
    ...react({ ...options, react: reactOption }),
    ...reactNative({ ...options, reactNative: reactNativeOption }),
    ...next({ ...options, next: nextOption }),
    ...a11y({ ...options, a11y: a11yOption, react: reactOption }),
    ...imports({ ...options, sortImports }),
    ...unicorn(),
    ...sorting({ ...options, sortKeys }),
    ...regexp({ ...options, regexp: regexpOption }),
    ...unused(),
    ...eslintCommentsConfig(),
    // 用户自定义配置（最高优先级）
    ...userConfigs,
  ];

  return configs;
}

export * from './globs';
