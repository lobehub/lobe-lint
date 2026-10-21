# Common errors

Each entry: the message you see, the cause, the fix. "Verified" means reproduced on lobe-ui, lobe-editor or a migrated clone of lobe-charts / lobe-icons with `@lobehub/lint` 2.1.5, ESLint 10.13.0, Node 24.

## Config does not load

**`Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in …/@eslint-react/eslint-plugin/package.json`** (verified)
The config is CommonJS (`.eslintrc.js`, `eslint.config.cjs`, `require('@lobehub/lint')`). The v2 dependency tree is ESM-only. Use `eslint.config.mjs` with `import`; same for every other config file.

**`Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './v4' is not defined by "exports" in …/zod-validation-error/package.json`** (verified with bun 1.3.14, pnpm 11.20, npm 11.17, Node 24.19)
Every config (`eslint`, `prettier`, `stylelint`, `commitlint`) fails to load, because `@lobehub/lint` imports eslint-plugin-react-hooks 7.1.1. It does `require('zod-validation-error/v4')` but accepts `zod-validation-error ^3.5.0 || ^4.0.0`, and 3.5.4 (the latest 3.x) dropped the `./v4` export (3.5.0 to 3.5.3 and 4.x have it). In 2.1.5 / 2.1.6, eslint-plugin-react-compiler (`^3.0.3`) is in the tree too, so a package manager that dedupes to one version picks 3.5.4 for both: a fresh `npm install` of 2.1.6 breaks, and so does any 2.1.5 → 2.1.6 upgrade with an existing `bun.lock` or `pnpm-lock.yaml`. A fresh bun or pnpm install can work or break depending on the rest of the tree. Check:

```bash
node --input-type=module -e "await import('@lobehub/lint'); console.log('ok')"
```

Fixed in `@lobehub/eslint-config` / `@lobehub/lint` 2.1.7: eslint-plugin-react-compiler is no longer a dependency (react-hooks 7 has the same compiler rules; `reactCompiler: true` now raises them to `error`), and `zod-validation-error ^4.0.2` is a direct dependency. A fresh install with bun, pnpm or npm then loads, even when the project itself also depends on eslint-plugin-react-compiler. A lockfile that already resolved react-hooks to 3.5.4 keeps it after the upgrade (bun and pnpm reuse the locked resolution), so refresh it once:

- pnpm: `pnpm update --depth Infinity zod-validation-error`, or delete `pnpm-lock.yaml` and reinstall.
- bun: delete `bun.lock` and run `bun install`. Do not run `bun update zod-validation-error`: it adds `zod-validation-error@^5` to your `package.json` and leaves react-hooks on 3.5.4.
- npm: `npm install` re-resolves it.

On 2.1.6 (before 2.1.7), pin it instead. Any of these works:

- bun / npm: `"overrides": { "zod-validation-error": "3.5.3" }` (3.5.3 satisfies both ranges and still has `./v4`). With pnpm this pin breaks another `zod-validation-error/v3` import; use the next line there.
- pnpm: in `pnpm-workspace.yaml`, `overrides: { 'eslint-plugin-react-hooks>zod-validation-error': ^4.0.2 }`.
- npm: `"overrides": { "eslint-plugin-react-hooks": { "zod-validation-error": "^4.0.2" } }`.

After upgrading to 2.1.7 you can drop the override. Run `install` again and then the check above. With bun, a lock that already holds 3.5.3 keeps it, so it stays fine. If the check fails, refresh the lockfile as described above.

**v1 code that does `config.rules['x'] = 0` fails**
v1 configs mutate `require('@lobehub/lint').eslint.rules`. In v2 `eslint` is `defineConfig`, a function with no `rules`. Pass overrides as config objects.

**`A configuration object specifies rule "react/self-closing-comp", but could not find plugin "react"`** (verified on lobe-icons)
A react / react-hooks / react-refresh / @eslint-react rule turned on in a block without `files`. 2.1.5 registers those plugins for `**/*.{jsx,tsx}` only. Move the rule into a `{ files: ['**/*.{jsx,tsx}'], rules: … }` block. Same for perfectionist (`*.ts`, `*.tsx`) and unicorn / import-x / simple-import-sort / regexp / unused-imports (JS and TS files).

**`Definition for rule 'sort-keys-fix/sort-keys-fix' was not found`** / **`… 'import/order' was not found`**
A disable comment or carried rule names a plugin v2 does not ship. `import/*` became `import-x/*` (`migrate.mjs` renames them). For other plugins delete the comment, or install the plugin and register it in a config block (lobe-ui did this for `eslint-plugin-sort-keys-fix`).

**Install warns about engines, or ESLint crashes on an old Node**
ESLint 10 supports only Node `^20.19.0 || ^22.13.0 || >=24`. The `>=18` in `@lobehub/*` 2.1.5 `engines` is wrong; upgrade Node.

**ESLint rejects `--ignore-path`, `--no-eslintrc`, `--env`, `--rulesdir`, `--resolve-plugins-relative-to`**
eslintrc-only CLI flags, unsupported with flat config. Remove them from scripts and hooks.

## New errors after the config loads

**`Unused eslint-disable directive`** (error)
2.1.5 sets `linterOptions.reportUnusedDisableDirectives: 'error'`. `eslint --fix` deletes them.

**Default export warnings: `Default export is not allowed. Use named exports instead.`**
`no-restricted-syntax`, severity `warn`. Not an upgrade blocker; see [default-export.md](default-export.md).

**`unicorn/no-anonymous-default-export`** (error)
`export default () => …` / `export default memo(() => …)`. lobe-ui and lobe-editor turn it off; so does `migrate.mjs`.

**`@typescript-eslint/consistent-type-imports`, `simple-import-sort/imports`, `perfectionist/sort-*`, `object-shorthand`**
The bulk of the errors on a fresh migration (lobe-charts: 144 + 34 + 2 + 3 of 195; lobe-icons: 29 + 25 + 10 of 66). All autofixable.

**`no-console`** (error since 2.1.0)
Not autofixable. Remove debug output; for intentional output (CLIs, scripts) disable on the line with a reason: `// eslint-disable-next-line no-console -- CLI output`.

**`no-undef` on globals in TS files**
lobe-ui turns `no-undef` off; TypeScript already reports undefined names.

**Stylelint: `Unexpected "border-bottom" property. Use "border-block-end"` (`liberty/use-logical-spec`)**
New in the Stylelint 16 config (lobe-charts: 54 errors). `stylelint --fix` rewrites them; review the diff on RTL-sensitive layouts. On 2.1.5 its fix lowercases `${…}` interpolations in `transition` values; see below.

## Autofix breaks the build

All of these are fixed in `@lobehub/lint` 2.1.6. After upgrading, run `eslint --fix` (and `stylelint --fix`) again, then `prettier --write`, then type-check. Code already broken by a 2.1.5 fix is not repaired automatically: fix it by hand as described.

**`TS2206: The 'type' modifier cannot be used on a named import when 'import type' is used`** and **`TS1361: 'useMemo' cannot be used as a value because it was imported using 'import type'`** after `eslint --fix` (verified on lobe-charts and in the lobe-lint fixtures)
Two fixers interact. `@typescript-eslint/consistent-type-imports` (`fixStyle: 'separate-type-imports'`) moves type-only names into a new `import type { MouseEvent } from 'react'`. `import-x/no-duplicates` then sees it next to `import { type CSSProperties, forwardRef, useMemo } from 'react'`; without `prefer-inline` it puts every import that has an inline `type` specifier in the same group as `import type`, and its fix merges them into `import type { type CSSProperties, MouseEvent, useMemo }`. Same with `import { ElementType, createElement }` + `import { type HTMLAttributes }` → `import type { ElementType, type HTMLAttributes }`. Repro:

```tsx
// src/__r.tsx
import { type CSSProperties, forwardRef, MouseEvent, useMemo } from 'react';

export const A = forwardRef<HTMLDivElement, { s: CSSProperties; o: (e: MouseEvent) => void }>((p, ref) => {
  const v = useMemo(() => p.s, [p.s]);
  return <div onClick={p.o} ref={ref} style={v} />;
});
```

`npx eslint src/__r.tsx --fix-dry-run -f json` outputs `import type { type CSSProperties, forwardRef, MouseEvent, useMemo } from 'react';` on 2.1.5. 2.1.6 wraps `import-x/no-duplicates` (same rule id): a mixed import is grouped with the value imports, and `import { type A }` is merged into `import type { … }` without the inline keyword. Output: `import type { MouseEvent } from 'react';` + `import { type CSSProperties, forwardRef, useMemo } from 'react';`. On 2.1.5, turn the rule off while running `--fix` (`{ rules: { 'import-x/no-duplicates': 'off' } }`), and fix broken imports by hand: drop the inline `type` keywords inside `import type { … }` and move value names (`forwardRef`, `useMemo`, `createElement`) back to a value import.

**Fixed imports are badly formatted: `import type {EdgeSpeechPayload }`, `import { genSSML,type SsmlOptions }`**
Not a config problem: ESLint fixers splice text and never format (`eslint-config-prettier` only turns formatting rules off). Run Prettier after every `eslint --fix`: `npx prettier --write <same files>`. lint-staged does this when it runs `prettier --write` after `eslint --fix` on staged files.

**`@eslint-react/no-forward-ref` rewrote `forwardRef` and now `TS7031: Binding element 'ref' implicitly has an 'any' type` / `React.RefObject<T | null>` errors**
2.1.5 ships `@eslint-react/eslint-plugin` 2.x, where this rule is an autofix (verified with 2.12.4). It turns `forwardRef<HTMLDivElement, P>((props, ref) => …)` into `({ ref, ...props }: P & { ref?: React.RefObject<HTMLDivElement | null> }) => …` (callers that pass a callback ref or a `Ref<T>` stop type-checking, and `React` must be in scope) and `forwardRef((props: any, ref) => …)` into an untyped `({ ref, ...props }) => …` (TS7031); the `forwardRef` import is left behind. 2.1.6 ships 5.x, where it is a warning with a suggestion only; `--fix` leaves `forwardRef` alone. Already-rewritten code: type the prop as `ref?: React.Ref<T>` (`({ ref, ...props }: Props & { ref?: React.Ref<HTMLDivElement> })`), or restore `forwardRef`. A library that still supports React 18 keeps `forwardRef` and turns the rule off with a comment.

**Stylelint `--fix` lowercases CSS-in-JS interpolations: `${cssVar.motionEaseInOut}` → `${cssvar.motioneaseinout}`** (verified on lobe-charts `33e956f` `src/BenchmarkScatterChart/styles.ts`)
`liberty/use-logical-spec` (stylelint-use-logical-spec 5.0.1, the latest) lowercases the whole value of `transition`, `transition-property` and `will-change` before replacing `left` / `top` with logical names, so the fix also lowercases interpolations and custom properties (`var(--myVar)`). Repro: `git show 33e956f:src/BenchmarkScatterChart/styles.ts | npx stylelint --stdin-filename src/BenchmarkScatterChart/styles.ts` prints `Use "inset-inline-start 0.4s ${cssvar.motioneaseinout}, …"`. 2.1.6 wraps the rule (same name) so interpolations and mixed-case identifiers survive the fix and the message. On 2.1.5, exclude those properties in `stylelint.config.mjs` and convert them by hand:

```js
rules: {
  ...stylelint.rules,
  // stylelint-use-logical-spec lowercases ${…} interpolations in these values (fixed in 2.1.6)
  'liberty/use-logical-spec': [true, { except: ['float', /^((min|max)-)?(height|width)$/i, /^transition(-property)?$/i, 'will-change'] }],
},
```

## Releases

**Release notes ignore the changelog options (no author, no back-to-top, default headings); `.changelogrc.mjs` is never read** (verified on lobe-ui, fluent-emoji)
conventional-changelog-gitmoji-config 1.5.2 loads the config with `cosmiconfigSync('changelog')` from cosmiconfig 7, which has no `.mjs` search place. Repro from the repo root:

```bash
node -e "const r=require('module').createRequire(process.cwd()+'/node_modules/conventional-changelog-gitmoji-config/lib/customConfig.js');console.log(r('cosmiconfig').cosmiconfigSync('changelog').search(process.cwd()))"
```

It prints `null` with `.changelogrc.mjs`. Use `.changelogrc.cjs` (`migrate.mjs` writes it):

```js
module.exports = require('@lobehub/lint/changelog');
```

`@lobehub/lint/changelog` is new in 2.1.6. Do not write `require('@lobehub/lint').changelog`: the root entry throws `ERR_PACKAGE_PATH_NOT_EXPORTED` (see "Config does not load"). On 2.1.5, resolve the options package through `@lobehub/lint` (resolving does not load the root entry):

```js
module.exports = require(
  require.resolve('@lobehub/semantic-release-config/changelog', { paths: [require.resolve('@lobehub/lint')] }),
);
```

In a monorepo, each workspace package with its own changelog config re-exports the root one: `module.exports = require('../../.changelogrc.cjs');`. A v1 `packages/*/.changelogrc.js` that does `require('../../.changelogrc')` breaks as soon as the root `.changelogrc.js` is deleted; `migrate.mjs` rewrites those too.

**Release job succeeds but never releases gitmoji commits: only `@semantic-release/npm` / `@semantic-release/github` plugins are loaded (no `@semantic-release/changelog` / `@semantic-release/git`) and `✨ feat(…)` → `The commit should not trigger a release`** (verified on lobe-icons run 39600210901, commit `4cb27b21`)
semantic-release did not find `.releaserc.mjs` and ran with its defaults (angular rules, default plugins). semantic-release 21 and 22 depend on cosmiconfig `^8.0.0` (23+ on `^9`); only cosmiconfig >= 8.2 loads `.mjs`. multi-semantic-release loads each package's config through the same `getConfig`. lobe-icons' `pnpm-lock.yaml` pins cosmiconfig 8.0.0 for it, and `bun i` in CI migrates that lockfile, so CI gets 8.0.0 too. lobe-tts (no pnpm lock pinning 8.0.0, so it resolves 8.3.6) and fluent-emoji (8.3.6) do read the file (lobe-tts released v6.0.1 from `⬆️` / `🎨` commits, which the angular defaults would not release). Check what a repo gets, with semantic-release's own `getConfig` (from the repo root after installing; pass a package dir for a workspace package):

```bash
node <skill-dir>/scripts/check-release.mjs
```

It prints the resolved semantic-release and cosmiconfig versions, the config files, the plugins and the commit-analyzer options, warns when a `.mjs` config meets cosmiconfig < 8.2, and exits 1 (`FAIL: semantic-release runs with its defaults`) when `@semantic-release/changelog` / `@semantic-release/git` are missing. Verified: lobe-icons (cosmiconfig 8.0.0, `.releaserc.mjs`) fails; lobe-tts and fluent-emoji (8.3.6) and lobe-ui (9.0.2) pass; a lobe-icons clone with `.releaserc.cjs` passes on 8.0.0. Without the skill, the cosmiconfig version alone:

```bash
node -e "const p=require('fs').realpathSync('node_modules/semantic-release/package.json');console.log(require('module').createRequire(p)('cosmiconfig/package.json').version)"
```

If the repo keeps `.releaserc.mjs`, that version must be >= 8.2 (re-check after every lockfile refresh). Fixed in `@lobehub/lint` 2.1.6. Fix (pick one):

- `.releaserc.cjs` with `module.exports = require('@lobehub/lint/release');` (`@lobehub/lint/release-monorepo` for the monorepo config; `@lobehub/lint` >= 2.1.6). Works with every cosmiconfig 8 / 9. `migrate.mjs` (2.1.6) writes it and deletes `.releaserc.mjs`. On 2.1.5: `module.exports = require(require.resolve('@lobehub/semantic-release-config', { paths: [require.resolve('@lobehub/lint')] })).default;`.
- Or upgrade `semantic-release` to `>=23` (lobe-ui uses 25), which uses cosmiconfig 9. Refreshing the lockfile so it resolves cosmiconfig >= 8.2 also works, but nothing keeps it there. Check that other release tooling (`@qiwi/multi-semantic-release`, overrides of `@semantic-release/*`) still works with it.

Re-run the check above, then look at the next Release log: it must load `@semantic-release/changelog` and `@semantic-release/git` (lobe-tts run 39597781603 does). Commits that were skipped are released by the next run (semantic-release analyzes every commit since the last tag).

## Install warnings

**`bun install`: `warn: incorrect peer dependency "eslint@10.13.0"` (four times)** (verified on lobe-tts `bun.lock`)
Plugins whose `peerDependencies.eslint` stops at 9 although they run on ESLint 10. With 2.1.5: `eslint-plugin-react@7.37.5` (`^9.7`), `eslint-plugin-jsx-a11y@6.10.2` (`^9`), `eslint-plugin-react-native@5.0.0` (`^9`) and `eslint-plugin-react-hooks@5.2.0` (`^9`). 2.1.6 moves react-hooks to 7.1.1 (supports `^10`), which removes one warning. The other three are the latest releases of those plugins; no version declares ESLint 10 yet. The warnings are only about the declared range: lobe-lint lints itself and runs its fixture tests with `eslint-plugin-react` on ESLint 10.13.0, and `jsx-a11y` / `react-native` rules only run when the `a11y` / `reactNative` options are on. Ignore the warnings until upstream widens the ranges; do not pin ESLint 9 for them.

## Reporting a lobe-lint bug

Open an issue at https://github.com/lobehub/lobe-lint/issues with:

1. The exact error text (copy, do not paraphrase), including the ESLint / Stylelint banner line.
2. `node -v`, `npx eslint --version`, the resolved `@lobehub/lint` version (`npm ls @lobehub/lint` / `pnpm why @lobehub/lint`).
3. A one-command repro: the smallest file plus the command, e.g. `npx eslint src/__r.tsx --fix-dry-run -f json`.
4. Your local workaround, so maintainers know what to remove after the fix.
