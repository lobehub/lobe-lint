<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-logo/assets/logo-3d.webp">
<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-logo/assets/split.svg">
<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-emoji/assets/triangular-ruler.webp">

<h1>@lobehub/oxlint-config</h1>

Oxlint configuration for LobeHub projects

[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-license-shield]][github-license-link]

</div>

## Features

- The `@lobehub/eslint-config` rule set, converted to Oxlint and kept in sync by a generator
- No `typescript` or `eslint` install: the JS plugins it needs are bundled with stubs for both
- Native Oxlint rules for JavaScript, TypeScript, React, Next.js, import, unicorn and jsx-a11y
- Bundled JS plugins: `@eslint-react`, `perfectionist`, `simple-import-sort`, `react-native`, `react/jsx-sort-props`, `@stylexjs`
- Optional type-aware rules through `oxlint-tsgolint`
- About 4x faster than ESLint on a 12,000-file codebase (6.7s vs 30s)

## Installation

```bash
pnpm add -D @lobehub/oxlint-config oxlint
```

## Usage

Create `oxlint.config.ts` in your project root. Oxlint loads TypeScript config files on Node.js 22.18 or later.

```ts
import { defineConfig } from '@lobehub/oxlint-config';

export default defineConfig({
  react: 'next',
  next: true,
});
```

Then run:

```bash
npx oxlint
npx oxlint --fix
```

### Overrides

Every argument after the options is an Oxlint override, appended after the built-in ones:

```ts
import { defineConfig } from '@lobehub/oxlint-config';

export default defineConfig(
  { react: true },
  {
    files: ['**/*.test.ts'],
    rules: { 'no-console': 'off' },
  },
);
```

Overrides that use your own JS plugins list them in `jsPlugins`. Do not list a plugin this package already bundles.

## Options Reference

| Option          | Type                                               | Default | Description                                                         |
| --------------- | -------------------------------------------------- | ------- | ------------------------------------------------------------------- |
| `typescript`    | `boolean \| 'strict'`                              | `true`  | TypeScript rules; `'strict'` uses the strict rule set               |
| `typeChecked`   | `boolean`                                          | `false` | Type-aware rules; install `oxlint-tsgolint`                         |
| `react`         | `boolean \| 'next' \| 'remix' \| 'vite' \| 'expo'` | `false` | React rules; a framework value adjusts `only-export-components`     |
| `reactCompiler` | `boolean`                                          | `false` | Raise the React Compiler rules from `warn` to `error`               |
| `reactNative`   | `boolean`                                          | `false` | React Native rules                                                  |
| `next`          | `boolean`                                          | `false` | Next.js rules                                                       |
| `a11y`          | `boolean`                                          | `false` | jsx-a11y rules; requires `react`                                    |
| `sortImports`   | `boolean`                                          | `true`  | Sort imports and exports with `simple-import-sort`                  |
| `sortKeys`      | `boolean`                                          | `true`  | Sort interface members, enum members and JSX props                  |
| `stylex`        | `boolean`                                          | `false` | StyleX rules for `stylex.create` styles (`@stylexjs/eslint-plugin`) |
| `ignores`       | `string[]`                                         | `[]`    | Extra ignore globs; a pattern without a slash matches at the root   |

## Differences from @lobehub/eslint-config

- **Not ported:** the `regexp`, `yml` and `mdx` options, `parserOptions` and `tsconfigPath`.
- **Comment rules:** only `no-unlimited-disable` and `no-duplicate-disable` are kept. Oxlint's `reportUnusedDisableDirectives` warns about unused disable comments.
- **Unused imports:** reported by Oxlint's `no-unused-vars`. There is no separate autofix rule.
- **React Compiler rules:** Oxlint's own implementations. They also check components wrapped in `memo()`, which `eslint-plugin-react-hooks` skips, so expect more warnings.
- **Adjusted for Oxlint behavior:**
  - `no-useless-assignment` is off until [oxc-project/oxc#28603][oxc-28603] is fixed;
  - `unicorn/no-immediate-mutation` is `warn`, because Oxlint also flags `new Map(source)` followed by `.set()`;
  - `no-unsafe-optional-chaining` is off in test files.
- **Type-aware `@eslint-react` rules** (`no-implicit-*`, `no-leaked-conditional-rendering`, `no-unused-props`) are off. They need the TypeScript API.

## Requirements

- Node.js >= 20.19 (`oxlint.config.ts` needs Node.js >= 22.18)
- Oxlint >= 1.90.0 < 2
- `oxlint-tsgolint` when `typeChecked` is on

## License

MIT © [LobeHub](https://github.com/lobehub)

<!-- LINK GROUP -->

[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/oxlint-config
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/oxlint-config?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/oxlint-config
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/oxlint-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[oxc-28603]: https://github.com/oxc-project/oxc/issues/28603
