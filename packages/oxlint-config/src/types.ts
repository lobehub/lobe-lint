import { type OxlintConfig, type OxlintOverride } from 'oxlint';

export interface Options {
  /**
   * Enable `jsx-a11y` accessibility rules. Requires `react`.
   * @default false
   */
  a11y?: boolean;

  /**
   * Extra glob patterns to ignore, appended to the built-in ignores. Uses ESLint flat-config
   * semantics: a pattern without a slash only matches at the config root.
   */
  ignores?: string[];

  /**
   * Enable Next.js rules.
   * @default false
   */
  next?: boolean;

  /**
   * Enable React rules. A framework value adjusts the exports allowed by `only-export-components`.
   * @default false
   */
  react?: boolean | 'expo' | 'next' | 'remix' | 'vite';

  /**
   * Raise the React Compiler rules from `warn` to `error`.
   * @default false
   */
  reactCompiler?: boolean;

  /**
   * Enable React Native rules.
   * @default false
   */
  reactNative?: boolean;

  /**
   * Sort imports and exports with `simple-import-sort`.
   * @default true
   */
  sortImports?: boolean;

  /**
   * Sort interface members, enum members and JSX props.
   * @default true
   */
  sortKeys?: boolean;

  /**
   * Enable StyleX rules (`@stylexjs/eslint-plugin`) that validate `stylex.create` styles.
   * @default false
   */
  stylex?: boolean;

  /**
   * Enable type-aware rules. Requires `oxlint-tsgolint`.
   * @default false
   */
  typeChecked?: boolean;

  /**
   * Enable TypeScript rules. `'strict'` uses the strict rule set.
   * @default true
   */
  typescript?: boolean | 'strict';
}

export type PluginKey =
  | 'eslint-react'
  | 'lobe'
  | 'perfectionist'
  | 'react-js'
  | 'react-native'
  | 'simple-import-sort'
  | 'stylex';

export type LayerOverride = Omit<OxlintOverride, 'jsPlugins'> & { jsPlugins?: PluginKey[] };

export interface Layer {
  overrides: LayerOverride[];
  plugins: NonNullable<OxlintConfig['plugins']>;
  settings?: Record<string, unknown>;
}

export type { OxlintConfig, OxlintOverride } from 'oxlint';
