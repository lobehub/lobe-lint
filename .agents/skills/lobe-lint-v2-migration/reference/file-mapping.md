# File mapping: v1 repos vs lobe-ui (v2)

Derived from lobe-ui commit `5c0fab48` ("✨ chore(lint): update lint", 2026-02-06), which deleted eight rc files and added seven ESM configs, compared file by file with the v1 repos lobe-icons, lobe-charts, lobe-tts and fluent-emoji. lobe-editor (`064c107`) is the second v2 example.

## Old → new

| v1 file | v2 file | v2 content |
| --- | --- | --- |
| `.eslintrc.js` | `eslint.config.mjs` | `export default defineConfig({ ...options }, ...configs)` |
| `.eslintignore` | `ignores` in the first `defineConfig` argument | see [Ignore patterns](#ignore-patterns) |
| `.prettierrc.js` | `prettier.config.mjs` | `import { prettier } from '@lobehub/lint'; export default prettier;` |
| `.stylelintrc.js` | `stylelint.config.mjs` | `{ ...stylelint, rules: { ...stylelint.rules, ...yours } }` |
| `.commitlintrc.js` | `commitlint.config.mjs` | `import { commitlint } from '@lobehub/lint'; export default commitlint;` |
| `.remarkrc.js` | `.remarkrc.mjs` | `import { remarklint } from '@lobehub/lint'; export default remarklint;` |
| `.releaserc.js` | `.releaserc.cjs` (CommonJS on purpose) | `module.exports = require('@lobehub/lint/release');` (`/release-monorepo` for `semanticReleaseMonoRepo`; needs `@lobehub/lint` >= 2.1.6) |
| `.changelogrc.js` | `.changelogrc.cjs` (CommonJS on purpose) | `module.exports = require('@lobehub/lint/changelog');` (needs `@lobehub/lint` >= 2.1.6) |
| `packages/*/.changelogrc.js` (`require('../../.changelogrc')`) | `packages/*/.changelogrc.cjs` | `module.exports = require('../../.changelogrc.cjs');` |
| `.prettierignore`, `.remarkignore`, `.editorconfig`, `.npmrc` | unchanged | |
| `.husky/pre-commit`, `.husky/commit-msg` | unchanged | keep repo steps; see package-json.md |
| `tsconfig.json` | unchanged | nothing lint-specific in any of these repos; set `tsconfigPath` / `typeChecked` only if you want type-aware rules |

lobe-editor uses `remark.config.js`, `release.config.js`, `changelog.config.js` with `"type": "module"`; prefer lobe-ui's names.

The changelog config is the exception to "everything is ESM": conventional-changelog-gitmoji-config 1.5.2 (pulled in by semantic-release-config-gitmoji for the release notes) searches `changelog` with cosmiconfig 7, whose search places are `package.json`, `.changelogrc`, `.changelogrc.{json,yaml,yml,js,cjs}` and `changelog.config.{js,cjs}`. There is no `.mjs`, so lobe-ui's `.changelogrc.mjs` is never read and the release notes use the plugin defaults (verified: the search prints `null` in lobe-ui, fluent-emoji and lobe-lint). The file must be CommonJS, and `require('@lobehub/lint')` fails (ESM-only plugins), hence the `@lobehub/lint/changelog` entry.

The release config has the same problem on semantic-release 21. It depends on cosmiconfig `^8.0.0`, and `.mjs` support only arrived in cosmiconfig 8.2. What a repo gets depends on its lockfile (verified locally): lobe-icons and lobe-charts (pnpm lock) resolve cosmiconfig 8.0.0 and find no config, so semantic-release runs with its defaults; lobe-tts and fluent-emoji (bun lock) resolve 8.3.6 and read `.releaserc.mjs`; lobe-ui (semantic-release 25, cosmiconfig 9.0.2) reads it. bun in CI migrates `pnpm-lock.yaml` and keeps 8.0.0. `.releaserc.cjs` loads with every cosmiconfig version, so `migrate.mjs` writes that; with semantic-release >= 22 an existing `.releaserc.mjs` is left alone.

`@lobehub/lint` 2.1.5 exports: `defineConfig` (also as `eslint` and `defineEslintConfig`), `prettier`, `stylelint`, `commitlint`, `remarklint`, `changelog`, `semanticRelease`, `semanticReleaseMonoRepo`, `semanticReleaseOptions`, type `EslintOptions`. From 2.1.6 there are also the subpaths `@lobehub/lint/changelog`, `@lobehub/lint/release` and `@lobehub/lint/release-monorepo` (default exports, CommonJS and ESM) for `.changelogrc.cjs` / `.releaserc.cjs`.

## ESLint: before / after

lobe-tts `.eslintrc.js` (v1, abridged):

```js
const config = require('@lobehub/lint').eslint;

config.rules['no-param-reassign'] = 0;
config.rules['unicorn/no-array-callback-reference'] = 0;
config.rules['unicorn/no-array-for-each'] = 0;
config.rules['unicorn/no-useless-undefined'] = 0;
// + @lobehub/ui restrictedImports, deduped for ESLint 8
module.exports = config;
```

What `migrate.mjs` writes for it (tested on a clone):

```js
import { defineConfig } from '@lobehub/lint';
import { restrictedImports } from '@lobehub/ui/eslint';

export default defineConfig(
  {
    ignores: ['**/node_modules', '**/*.test.ts', '**/.react-router', '**/dist', '**/es', '**/.next' /* … */],
    react: true,
  },
  restrictedImports,
  { rules: { 'no-param-reassign': 0 } },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    rules: {
      'unicorn/no-anonymous-default-export': 'off',
      'unicorn/no-array-callback-reference': 0,
      'unicorn/no-array-for-each': 0,
      'unicorn/no-useless-undefined': 0,
    },
  },
  { files: ['**/*.{jsx,tsx}'], rules: { 'react-refresh/only-export-components': 'off' } },
);
```

The three unicorn rules are already `0` in v2, so these lines can be deleted. Keep blocks for plugin rules scoped with `files`: 2.1.5 registers react / react-hooks / react-refresh / @eslint-react only for `*.jsx` / `*.tsx`, perfectionist for `*.ts` / `*.tsx`, unicorn / import-x / simple-import-sort / regexp / unused-imports for JS and TS files. Only `@typescript-eslint` and `yml` are global. A rule turned on in a block without `files` fails on other file types with `could not find plugin "react"`.

lobe-ui `eslint.config.mjs` (v2, abridged) — options plus a few repo overrides:

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig(
  { ignores: ['dist', 'es' /* … */], react: true, regexp: false, typescript: true },
  {
    rules: {
      'no-undef': 'off',
      'unicorn/no-anonymous-default-export': 'off',
      // … more 'off' overrides
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: { 'react-refresh/only-export-components': 'off', 'react/self-closing-comp': 'error' },
  },
);
```

`unicorn/no-anonymous-default-export` (error in 2.1.5) and `react-refresh/only-export-components` (warn) are off in lobe-ui, lobe-editor and in what `migrate.mjs` writes: component libraries default-export anonymous components and mix constants with components.

## Ignore patterns

`.eslintignore` uses gitignore syntax relative to the repo root; flat `ignores` are minimatch globs. `migrate.mjs` converts:

| `.eslintignore` | `ignores` |
| --- | --- |
| `node_modules` (no slash) | `**/node_modules` |
| `dist/` | `**/dist/**` |
| `/foo/bar` or `a/b` (contains a slash) | `foo/bar` |
| `*.test.ts` | `**/*.test.ts` |
| `!.dumirc.ts` | `!**/.dumirc.ts` |

v2 already ignores `**/node_modules/**, **/dist/**, **/build/**, **/.next/**, **/coverage/**, **/.turbo/**, **/out/**, **/*.min.*, **/public/**`; duplicates are harmless. Remove umi / dumi entries (`.umi*`, `.dumi/tmp*`) once the repo no longer uses dumi. A bare name such as `'dist'` (lobe-ui) only matches at the root.

## Stylelint

```js
import { stylelint } from '@lobehub/lint';

export default {
  ...stylelint,
  rules: {
    ...stylelint.rules, // base first, so your overrides win
    'custom-property-pattern': null,
    'no-descending-specificity': null,
  },
};
```

v1 repos got this wrong both ways: lobe-charts replaced `rules` without spreading the base (dropping the rules the config sets directly), lobe-tts spread the base last (the base silently won over its own overrides). Review the result if your overrides now take effect for the first time.

## Old files per downstream repo (HEAD of each, read-only survey)

| Repo | v1 files |
| --- | --- |
| lobe-icons (`origin/master` 8eca3a6f) | `.changelogrc.js .commitlintrc.js .eslintignore .eslintrc.js .prettierrc.js .releaserc.js .remarkrc.js .stylelintrc.js` (+ `.i18nrc.cjs`, `.npmrc`, `.husky/*`) |
| lobe-charts (33e956f) | `.changelogrc.js .commitlintrc.js .eslintignore .eslintrc.js .prettierrc.js .releaserc.js .remarkrc.js .stylelintrc.js` (+ `.prettierignore`, `.editorconfig`, `.husky/*`) |
| lobe-tts | the same eight (+ `.i18nrc.js`, `.npmrc`, `.husky/*`) |
| fluent-emoji | the same eight, all one-line `module.exports = require('@lobehub/lint').X` (+ `.remarkignore`, `.prettierignore`) |

`.i18nrc.*` belongs to `@lobehub/i18n-cli`, not lint: leave it.
