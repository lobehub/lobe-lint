# Default exports

## What v2 does

`@lobehub/eslint-config` 2.1.5 (commit `63c720e`, "BREAKING: ban default export") adds:

```js
'no-restricted-syntax': ['warn', { selector: 'ExportDefaultDeclaration', message: 'Default export is not allowed. Use named exports instead.' }]
```

It is off for `**/*.config.{js,mjs,ts,mts,cjs,cts}` and the Next.js app files (`**/app/**/{page,layout,loading,error,not-found,template,default}.{js,jsx,ts,tsx}`, `**/app/**/route.{js,ts}`, `**/app/**/{opengraph-image,twitter-image,apple-icon,icon}.{js,jsx,ts,tsx}`, `**/app/**/{sitemap,robots,manifest}.{js,ts}`). It is **not** off for docs-kit demos (`**/demos/**`) or the docs home page, which must default-export.

## The upgrade does not require changing default exports

The rule is a warning; lint passes with 0 errors while it reports. Pick one and say which in your summary.

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

If you later convert to named exports by hand, note that it is a breaking change for consumers that default-import deep paths (`import Ace from '@lobehub/icons/es/Ace'`, any wildcard `exports` subpath); do it in a major release with a changelog entry.
