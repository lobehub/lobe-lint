# Common errors

Each entry: the message you see, the cause, the fix. "Verified" means reproduced on lobe-ui, lobe-editor or a migrated clone of lobe-charts / lobe-icons with `@lobehub/lint` 2.1.5, ESLint 10.13.0, Node 24.

## Config does not load

**`Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in …/@eslint-react/eslint-plugin/package.json`** (verified)
The config is CommonJS (`.eslintrc.js`, `eslint.config.cjs`, `require('@lobehub/lint')`). The v2 dependency tree is ESM-only. Use `eslint.config.mjs` with `import`; same for every other config file.

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
New in the Stylelint 16 config (lobe-charts: 54 errors). `stylelint --fix` rewrites them; review the diff on RTL-sensitive layouts.

## Autofix breaks the build

**`TS2206: The 'type' modifier cannot be used on a named import when 'import type' is used`** and **`TS1361: 'useMemo' cannot be used as a value because it was imported using 'import type'`** after `eslint --fix` (verified on lobe-charts)
The `@typescript-eslint/consistent-type-imports` fix in 2.1.5 can turn a mixed import into `import type { type CSSProperties, MouseEvent, useMemo } from 'react'`. Repro on a migrated lobe-charts clone:

```tsx
// src/__r.tsx
import { type CSSProperties, forwardRef, MouseEvent, useMemo } from 'react';

export const A = forwardRef<HTMLDivElement, { s: CSSProperties; o: (e: MouseEvent) => void }>((p, ref) => {
  const v = useMemo(() => p.s, [p.s]);
  return <div onClick={p.o} ref={ref} style={v} />;
});
```

`npx eslint src/__r.tsx --fix-dry-run -f json` outputs `import type { type CSSProperties, MouseEvent, useMemo } from 'react';`. Run type-check right after every `--fix`, fix such imports by hand (`import { type CSSProperties, type MouseEvent, useMemo } from 'react'`), and report it upstream (below).

**`@eslint-react/no-forward-ref` autofix**
Rewrites `forwardRef` to a `ref` prop (React 19 style). Fine for React 19 apps; a library that still supports React 18 should turn the rule off and say so in a comment.

## Reporting a lobe-lint bug

Open an issue at https://github.com/lobehub/lobe-lint/issues with:

1. The exact error text (copy, do not paraphrase), including the ESLint / Stylelint banner line.
2. `node -v`, `npx eslint --version`, the resolved `@lobehub/lint` version (`npm ls @lobehub/lint` / `pnpm why @lobehub/lint`).
3. A one-command repro: the smallest file plus the command, e.g. `npx eslint src/__r.tsx --fix-dry-run -f json`.
4. Your local workaround, so maintainers know what to remove after the fix.
