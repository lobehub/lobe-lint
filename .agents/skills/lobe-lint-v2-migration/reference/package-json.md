# package.json, hooks and tsconfig

## Versions

| Package | v1 repos | v2 (lobe-ui) | Peer range in 2.1.5 |
| --- | --- | --- | --- |
| `@lobehub/lint` | `^1.26.3` | `^2.1.5` (`migrate.mjs` writes `^2.1.6`: first release with `@lobehub/lint/changelog` and the 2.1.5 autofix fixes) | |
| `eslint` | `^8.57.1` | `^10.12.0` | `^10.0.0` |
| `stylelint` | `^15.11.0` | `^16.26.1` | `>=16` (lobe-editor uses 17, which needs Node 20.19) |
| `prettier` | `^3.x` | `^3.9.10` | `>=3` |
| `@commitlint/cli` | | `^21.2.3` | `>=19` |
| `remark-cli` / `remark` | `^12` / `^15` | `^12.0.1` | `remark-cli >=12`, `remark >=15` |
| `semantic-release` | `^21` | `^25.0.9` | `>=21` |
| `typescript` | `^5.9` | `^6.0.3` | `>=5`, optional |
| `husky` / `lint-staged` | `^9` / `^16` | `^9.1.7` / `^17.6.0` | |

`migrate.mjs` bumps only the first four. Bump the others only if their peer range is not met. `@lobehub/lint` brings every plugin it needs; do not add ESLint plugins yourself unless a config or a disable comment references one v2 does not ship (lobe-ui added `eslint-plugin-sort-keys-fix` for old `// eslint-disable sort-keys-fix/...` comments, then registered it in a config block).

Keep `.npmrc` `public-hoist-pattern` entries if the repo has them (pnpm): editors and `npx eslint` resolve plugins from the root.

`engines.node`: raise to at least `>=20.19` (lobe-ui: `>=22.22.0`) if it is lower. `migrate.mjs` reports it and does not change it.

## Scripts

The lint scripts are identical in lobe-ui (v2) and lobe-charts (v1); only eslintrc-only flags go away.

```json
{
  "lint": "eslint \"{src,tests}/**/*.{js,jsx,ts,tsx}\" --fix",
  "lint:md": "remark . --quiet --frail --output",
  "lint:style": "stylelint \"{src,tests}/**/*.{js,jsx,ts,tsx}\" --fix",
  "prettier": "prettier -c --write --no-error-on-unmatched-pattern \"**/**\""
}
```

| v1 flag | v2 |
| --- | --- |
| `--ignore-path .eslintignore` | delete; `ignores` lives in `eslint.config.mjs` |
| `--no-eslintrc`, `--env`, `--rulesdir`, `--resolve-plugins-relative-to` | not supported by flat config; move into the config |
| `--ext .ts,.tsx` | works again since ESLint 9.21, but put the extensions in the glob like lobe-ui |

Keep the repo's own globs (lobe-tts lints `{src,api,lib}`).

## lint-staged

lobe-ui (v2):

```json
{
  "*.{md,mdx}": ["prettier --write --no-error-on-unmatched-pattern"],
  "*.json": ["prettier --write --no-error-on-unmatched-pattern"],
  "*.{js,jsx}": ["prettier --write", "stylelint --fix", "eslint --fix"],
  "*.{ts,tsx}": ["prettier --parser=typescript --write", "stylelint --fix", "eslint --fix"]
}
```

v1 repos run `remark --quiet --output --` (fluent-emoji: `--silently-ignore`) before Prettier on `*.md`. v2 drops it from the hook; Markdown is still checked by `lint:md`. `migrate.mjs` removes the remark command and renames `*.md` to `*.{md,mdx}`. Other entries (lobe-tts `*.{mjs,cjs}`) stay.

## Husky hooks

The hooks do not reference config file names, so they need no change. Keep repo steps exactly:

| Repo | pre-commit |
| --- | --- |
| lobe-ui (v2) | `npm run type-check`, `npm run lint:circular`, `npx --no-install lint-staged` |
| lobe-editor (v2) | same, type-check skipped when `$CI` is `true` |
| lobe-icons (v1) | `npm run build:toc`, `git add .`, `npm run type-check`, `npm run lint:circular`, `npx --no-install lint-staged` |
| lobe-charts (v1) | `npm run type-check`, `npm run lint:circular`, `npx --no-install lint-staged` |
| lobe-tts (v1) | `npm run lint:circular`, `npx --no-install lint-staged` |

commit-msg everywhere: `npx --no -- commitlint --edit ${1}`. It reads `commitlint.config.mjs` (checked with `npx commitlint --print-config` on the migrated clones).

lobe-icons' `git add .` stages every change in the worktree, not only the ones lint-staged touched. That is the repo's choice; keep it, but commit from a clean worktree.

## tsconfig

Nothing lint-specific in lobe-ui, lobe-editor or the four v1 repos (`paths` aliases such as `@/*`, `exclude: [".react-router"]`). Leave it. Type-aware linting is opt-in: `defineConfig({ typeChecked: true, tsconfigPath: './tsconfig.json' })`.

## @lobehub/ui ESLint rules

`@lobehub/ui/eslint` (ESM only, `./eslint` subpath since @lobehub/ui 5.17.1) exports flat config objects:

| Export | Content | Since |
| --- | --- | --- |
| `restrictedImports` | `no-restricted-imports` paths. In 6.0.0: `antd`, `antd-style`, `antd/*`, `rc-*`, `@rc-component/*`, `@ant-design/*`. From 6.4.1: only `thinking-orbs` (use `Spin variant="network"`) | 5.17.1 |
| `subpathRules` | `@lobehub/ui/no-base-ui-subpath: error` (no `@lobehub/ui/base-ui` imports) | 6.0.0 |
| `formSchemaRules` | `@lobehub/ui/no-inline-form-schema: warn` | 5.56.0 |
| default | array of all three | |

Use them as configs, not by poking at `.rules`:

```js
import { defineConfig } from '@lobehub/lint';
import { formSchemaRules, restrictedImports, subpathRules } from '@lobehub/ui/eslint';

export default defineConfig({ react: true }, restrictedImports, subpathRules, formSchemaRules);
```

The v1 workaround (`require('./node_modules/@lobehub/ui/es/eslint/index.mjs')` plus deduping `paths`) is not needed. `restrictedImports` sets the whole `no-restricted-imports` rule: put your own paths in a later block that repeats its paths, or they replace each other.
