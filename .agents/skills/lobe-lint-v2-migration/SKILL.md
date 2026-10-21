---
name: lobe-lint-v2-migration
description: >
  Upgrade a repo from @lobehub/lint 1.x (ESLint 8, .eslintrc / .eslintignore, Stylelint 15,
  CommonJS rc files) to @lobehub/lint 2.x (ESLint 10 flat config, *.config.mjs files), using
  lobe-ui as the template. A zero-dependency codemod rewrites the config files and package.json;
  this skill covers what is left. Trigger on: upgrade or migrate @lobehub/lint to v2, lobe-lint v2,
  ESLint 10 / flat config migration in a LobeHub repo, .eslintrc to eslint.config.mjs,
  "ERR_PACKAGE_PATH_NOT_EXPORTED" from a lint config, "Default export is not allowed",
  release notes ignoring .changelogrc.mjs, semantic-release ignoring .releaserc.mjs,
  升级 lobe-lint 2, 迁移 eslint flat config.
---

# lobe-lint v2 migration

v2 has no `.eslintrc` and no `.eslintignore`: one `eslint.config.mjs` built with `defineConfig(options, ...configs)`, and every other tool reads an ESM `*.config.mjs` / `.*rc.mjs` file, except the changelog and release configs: `.changelogrc.cjs` and `.releaserc.cjs` (CommonJS, see Rules). The reference v2 repo is lobe-ui. `scripts/migrate.mjs` does the mechanical part; the human guide is https://lint.lobehub.com/migration-v2. `<skill-dir>` below is the directory of this file. Sources and 2.1.5-vs-master differences: [reference/sources.md](reference/sources.md).

## Workflow

Work in order. Do not batch steps into one unverified change.

1. **Prechecks.** Clean worktree (`git status`; stop and ask if there are uncommitted changes you did not make). Node **>= 20.19** (`node -v`): ESLint 10 needs `^20.19.0 || ^22.13.0 || >=24`; the `>=18` in the 2.1.5 `engines` field is wrong. lobe-ui uses `>=22.22.0`. Note the package manager (lockfile, `packageManager`) and use it for every install.
2. **Inventory.** List the old files (`.eslintrc*`, `.eslintignore`, `.prettierrc*`, `.stylelintrc*`, `.commitlintrc*`, `.remarkrc*`, `.releaserc*`, `.changelogrc*`), the `lint*` scripts, `lint-staged` and `.husky/*`. Mapping: [reference/file-mapping.md](reference/file-mapping.md).
3. **Config codemod.** From the repo root:

   ```bash
   node <skill-dir>/scripts/migrate.mjs --dry-run .   # review the plan
   node <skill-dir>/scripts/migrate.mjs .
   ```

   It writes lobe-ui-style configs, carries custom rules / ignores / overrides, writes `.releaserc.cjs` and `.changelogrc.cjs` at the root and in every workspace package that has one (also replacing an existing `.changelogrc.mjs` and `.releaserc.mjs`; a custom `.releaserc.mjs` is only kept when `semantic-release` is >= 23), bumps `@lobehub/lint ^2.1.6`, `eslint ^10.12.0`, `stylelint ^16.26.1`, `prettier ^3.9.10`, drops `remark` from the Markdown `lint-staged` entry and `--ignore-path` from scripts. Anything it cannot port is a `TODO(lobe-lint v2 migration)` comment and is listed under "Needs a manual look". It never installs, commits or touches husky hooks. Re-running prints "Nothing to migrate".
4. **Install and load.** Install with the repo's package manager, format the new files with Prettier, then check both configs load:

   ```bash
   npx eslint --print-config src/index.ts > /dev/null && npx stylelint --print-config src/index.ts > /dev/null
   node <skill-dir>/scripts/check-release.mjs            # repo root + every workspace package with a release config (or pass dirs)
   ```

   `check-release.mjs` runs semantic-release's own `getConfig` (multi-semantic-release uses the same loader) and prints the semantic-release and cosmiconfig versions, the config file, the plugins and the commit-analyzer options. It exits 1 when semantic-release would run with its defaults. If the repo still has a `.releaserc.mjs` (or `release.config.mjs`), this check is required: `.mjs` is only read when the cosmiconfig that semantic-release resolves is >= 8.2, and that depends on the lockfile, not on `package.json`.

5. **Manual leftovers.** Resolve every TODO and note: rules from plugins v2 does not ship, `@lobehub/ui/eslint` rules, hooks with repo-specific steps, `engines`. Details: [reference/package-json.md](reference/package-json.md), errors: [reference/errors.md](reference/errors.md).
6. **Fix, in this order.** `eslint --fix` and `stylelint --fix` on the lint globs, then `prettier --write` on the same files (ESLint fixers do not format, so fixed imports can look like `import type {Foo }`), then **type-check immediately** (2.1.5 autofixes can produce invalid imports and untyped props, see errors.md), then fix the remaining errors by hand. A rule you disable locally gets a reason: `// eslint-disable-next-line no-console -- CLI output`. A rule you turn off for the whole repo goes in `eslint.config.mjs` with a comment saying why.
7. **Default exports.** v2 warns on `export default` (`no-restricted-syntax`, severity `warn`). The upgrade does not require changing them: keep the warnings, or turn the rule off in `eslint.config.mjs`. Examples: [reference/default-export.md](reference/default-export.md).
8. **Verify** (see Done when) and commit through the hooks.

## Rules

- Configs are ESM (`.mjs`, or `.js` with `"type": "module"`). Never `require('@lobehub/lint')`: it throws `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- Two exceptions stay CommonJS, because the tool that reads them silently ignores `.mjs` and falls back to its defaults:
  - the changelog config: conventional-changelog-gitmoji-config (release notes) uses cosmiconfig 7, which never looks at `.changelogrc.mjs`. Use `.changelogrc.cjs` with `module.exports = require('@lobehub/lint/changelog');`.
  - the release config: semantic-release 21 and 22 accept cosmiconfig `^8.0.0`, and 8.0 / 8.1 (what `pnpm-lock.yaml` pins in lobe-icons and lobe-charts; bun in CI migrates that lock and keeps it) do not read `.releaserc.mjs`, so the release runs with the angular defaults and gitmoji commits never release. Use `.releaserc.cjs` with `module.exports = require('@lobehub/lint/release');` (`release-monorepo` for `semanticReleaseMonoRepo`). It loads with every cosmiconfig version. Only semantic-release >= 23 (cosmiconfig `^9`, lobe-ui uses 25) is guaranteed to read `.mjs`.

  Both entries are new in `@lobehub/lint` 2.1.6 (the version that fixes this); on 2.1.5 see the workarounds in errors.md. Workspace packages re-export the root file: `module.exports = require('../../.changelogrc.cjs');`. After a release config change, check the next Release log: with the lobe config it loads plugins from `@semantic-release/changelog` and `@semantic-release/git`; the defaults load only `@semantic-release/npm` and `@semantic-release/github` (that is what lobe-icons run 39600210901 shows).
- Use `defineConfig` from `@lobehub/lint` (or `@lobehub/eslint-config`). In v2 the `eslint` export is that function, not a config object; do not mutate `.rules` on it.
- Keep repo-specific hook steps (`build:toc`, `git add .`, `lint:circular`, CI guards). Only the lint commands change.
- Do not turn rules off to reach zero without a reason. Do not downgrade errors to warnings in bulk.
- Do not edit `node_modules` or patch `@lobehub/*` packages. If lobe-lint itself is wrong (crash, invalid autofix, false positive), report it to the lobe-lint maintainers (https://github.com/lobehub/lobe-lint/issues) with the exact error text, `node -v`, `npx eslint --version`, the `@lobehub/lint` version and a one-command repro, then work around it locally with a commented override.
- Report what you could not migrate, with file and reason, instead of leaving a silent TODO.

## Done when

- No v1 config file is left; `migrate.mjs --dry-run` prints "Nothing to migrate" and no `TODO(lobe-lint v2 migration)` remains.
- `lint`, `lint:style`, `type-check`, `test` and `build` pass with **0 errors** (warnings, including default-export ones, are allowed).
- A commit runs the pre-commit hook (lint-staged) and the commit-msg hook (commitlint) without `--no-verify`.
- Your summary lists every rule you turned off or kept from v1, every local disable, and any lobe-lint bug you reported.
