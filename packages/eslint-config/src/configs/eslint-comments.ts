import eslintComments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { defineConfig } from 'eslint/config';

import { GLOB_SRC } from '../globs';

export function eslintCommentsConfig() {
  return defineConfig([
    {
      ...eslintComments.recommended,
      files: GLOB_SRC,
      rules: {
        ...eslintComments.recommended.rules,
        // 允许文件级别的 eslint-disable 没有对应的 eslint-enable
        '@eslint-community/eslint-comments/disable-enable-pair': 'off',
        // 禁止未使用的 eslint-disable 注释（可自动修复）
        '@eslint-community/eslint-comments/no-unused-disable': 'error',
        // 禁止没有规则名的 eslint-disable（必须指定具体规则）
        '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
        // 禁止重复的 eslint-disable
        '@eslint-community/eslint-comments/no-duplicate-disable': 'error',
        // 禁止一个 eslint-enable 同时启用多个 eslint-disable（鼓励合并多行 disable 注释）
        '@eslint-community/eslint-comments/no-aggregating-enable': 'error',
      },
    },
  ]);
}
