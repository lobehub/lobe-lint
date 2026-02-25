import { type ParserOptions } from '@typescript-eslint/parser';
import { type Linter } from 'eslint';

export interface Options {
  /**
   * 是否启用可访问性规则
   * @default false
   */
  a11y?: boolean;

  /**
   * 额外的忽略模式
   */
  ignores?: string[];

  /**
   * 是否启用 MDX 规则（需安装 eslint-plugin-mdx、eslint-mdx）
   * ESLint 10 下需应用 patches/eslint-plugin-mdx@3.6.2.patch
   * @default false
   */
  mdx?: boolean;

  /**
   * 是否启用 Next.js ESLint 规则
   * @default false
   */
  next?: boolean;

  /**
   * TypeScript 解析器选项
   */
  parserOptions?: ParserOptions;

  /**
   * 是否启用 React 支持
   * @default false
   */
  react?: boolean | 'next' | 'remix' | 'vite' | 'expo';

  /**
   * 是否启用 React Compiler 规则
   * @default false
   */
  reactCompiler?: boolean;

  /**
   * 是否启用 React Native 支持
   * @default false
   */
  reactNative?: boolean;

  /**
   * 是否启用正则表达式优化规则
   * @default true
   */
  regexp?: boolean;

  /**
   * 是否启用导入排序
   * @default true
   */
  sortImports?: boolean;

  /**
   * 是否启用接口和枚举排序
   * @default true
   */
  sortKeys?: boolean;

  /**
   * tsconfig 路径，用于类型检查规则
   */
  tsconfigPath?: string | string[];

  /**
   * 是否启用类型检查规则
   * @default false
   */
  typeChecked?: boolean;

  /**
   * 是否启用 TypeScript 支持
   * @default true
   */
  typescript?: boolean | 'strict';

  /**
   * 是否启用 YAML 规则（如字符串使用单引号）
   * @default true
   */
  yml?: boolean;
}

export type FlatConfig = Linter.Config;
export type FlatConfigArray = Linter.Config[];

export { type ParserOptions } from '@typescript-eslint/parser';
export { type Linter } from 'eslint';
