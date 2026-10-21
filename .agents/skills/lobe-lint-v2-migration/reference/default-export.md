# Default exports

## What v2 does

`@lobehub/eslint-config` 2.1.5 (commit `63c720e`, "BREAKING: ban default export") adds:

```js
'no-restricted-syntax': ['warn', { selector: 'ExportDefaultDeclaration', message: 'Default export is not allowed. Use named exports instead.' }]
```

It is off for `**/*.config.{js,mjs,ts,mts,cjs,cts}` and the Next.js app files (`**/app/**/{page,layout,loading,error,not-found,template,default}.{js,jsx,ts,tsx}`, `**/app/**/route.{js,ts}`, `**/app/**/{opengraph-image,twitter-image,apple-icon,icon}.{js,jsx,ts,tsx}`, `**/app/**/{sitemap,robots,manifest}.{js,ts}`). It is **not** off for docs-kit demos (`**/demos/**`) or the docs home page, which must default-export.

## The upgrade does not require changing default exports

The rule is a warning; lint passes with 0 errors while it reports. Pick one and say which in your summary:

1. **Keep the warnings.** Nothing to do.
2. **Turn the rule off** in `eslint.config.mjs`, with a comment:

   ```js
   export default defineConfig(
     { react: true },
     {
       // This library default-exports one component per module; consumers deep-import them.
       rules: { 'no-restricted-syntax': 'off' },
     },
   );
   ```

   If the repo sets `no-restricted-syntax` itself with other selectors, do not turn the rule off. Re-declare it with only your selectors; a later block replaces the whole option list, so the `ExportDefaultDeclaration` entry is gone:

   ```js
   {
     rules: {
       'no-restricted-syntax': [
         'error',
         { selector: "CallExpression[callee.name='eval']", message: 'No eval.' },
       ],
     },
   },
   ```

   To keep the rule but exempt framework files (lobe-ui does this for docs-kit route files and `docs/home/home.tsx`), use a `files` block: `{ files: ['**/demos/**', 'docs/home/home.tsx'], rules: { 'no-restricted-syntax': 'off' } }`.
3. **Convert to named exports** with the codemod below.

## Converting: `scripts/default-export.mjs`

ts-morph based; needs one install in the scripts directory:

```bash
npm install --prefix <skill-dir>/scripts
node <skill-dir>/scripts/default-export.mjs --dry-run .   # report only
node <skill-dir>/scripts/default-export.mjs .
```

| Option | Effect |
| --- | --- |
| `--dry-run` | print the report, write nothing |
| `--ignore <glob>` | keep default exports in matching files (repeatable) |
| `--keep-public-entry` | default: a package entry (`main` / `module` / `exports`, mapped `es/` → `src/`) keeps its own default export and is listed |
| `--no-keep-public-entry` | convert the entry too (breaking for consumers) |
| `--tsconfig <file>` | project file used for `paths` aliases (default `tsconfig.json`) |

What it converts: `export default function / class` (named or anonymous), `const X …; export default X`, `export default <expression>` (named after the file, or the directory for `index` files, PascalCase for components), `export { x as default }`, barrel `export { default } from` and `export { default as X } from`. Importers are rewritten project-wide, including tsconfig `paths` aliases, `import X, { y }`, `import { default as X }`, `(await import('./x')).default`, `.then((m) => m.default)`, `lazy(() => import('./x'))` / `dynamic(() => import('./x'))` and `import X from` lines in `.mdx`. Third-party default imports are never touched; `?demo` imports keep their default.

Always skipped (kept as `export default`): the 2.1.5 exemption globs above, `**/demos/**`, the docs-kit `homePage`, `*.d.ts`, `dist` / `es` / `lib`. Files that re-export a converted module from a kept file become `export { Name as default } from …`.

Public names do not change: `export { default as AreaChart } from './AreaChart'` becomes `export { AreaChart } from './AreaChart'`.

The report lists converted modules, skipped files, kept entries and **manual fixes**: `export =`, name clashes, dynamic imports it could not rewrite, `vi.mock` / `jest.mock` factories that return `default`, and converted modules with no importer in the project (likely loaded by a framework or a consumer's deep import; restore with `--ignore`). A second run converts nothing.

Tested on clean clones (`@lobehub/lint` 2.1.5 config from `migrate.mjs`):

| Repo | Converted | Files changed | Default-export warnings before → after | tsc / test / build after |
| --- | --- | --- | --- | --- |
| lobe-charts 33e956f | 42 modules | 49 | 127 → 86 (all in `demos/`) | pass / 24 tests pass / pass |
| lobe-icons 8eca3a6f | 2002 modules | 2353 | 2016 → 20 (all in `demos/`) | pass / 15 tests pass / pass |

**Library warning.** Converting is a breaking change for consumers that default-import deep paths (`import Ace from '@lobehub/icons/es/Ace'`, any wildcard `exports` subpath). The codemod prints a note when `exports` has wildcards. In a library, either keep default exports (option 1 or 2) or convert in a major release with a changelog entry.
