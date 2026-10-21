# AGENTS.md

Guidance for AI coding agents working in this repository. Everything below is checked against the current code; if you find a mismatch, trust the code and fix this file.

## Overview

Lobe Lint is a pnpm monorepo that publishes LobeHub's shared lint configs (`@lobehub/*-config`), the `@lobehub/lint` meta package, and the `create-lobe-lint` setup CLI. Development needs Node.js 22+ (root `engines`) and pnpm 9 (`packageManager`).

| Path                                                         | What lives there                                                                                                                                                     |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/eslint-config`                                     | `defineConfig()` in `src/index.ts`; one module per concern in `src/configs/*.ts`; options in `src/types.ts`; file globs in `src/globs.ts`; fixture tests in `tests/` |
| `packages/{prettier,stylelint,commitlint,remarklint}-config` | A single `src/index.ts` that default-exports the config                                                                                                              |
| `packages/semantic-release-config`                           | `src/index.ts`, plus `src/monorepo.ts` and `src/changelog.ts` subpath exports                                                                                        |
| `packages/lint`                                              | `@lobehub/lint` meta package; `src/index.ts` re-exports every config                                                                                                 |
| `packages/create-lint`                                       | `create-lobe-lint` CLI: tool registry in `src/constants.ts`, config writers in `src/generators/`, tests in `tests/`                                                  |
| Root `*.config.js`, `.remarkrc.mjs`                          | The repo lints itself with its own workspace packages                                                                                                                |
| `.husky/`, `.github/workflows/`                              | Git hooks; CI (`test.yml`), npm publish (`release.yml`), PR previews (`pkg.pr.new.yml`)                                                                              |
| `docs.config.ts`, `docs/`                                    | Documentation site built with `@lobehub/docs-kit` (`siteUrl` `https://lint.lobehub.com`)                                                                             |
| `.agents/skills/`                                            | Project skills for agents (see Using Skills)                                                                                                                         |

## Using Skills

Project skills live in `.agents/skills/`. Read the whole `SKILL.md` (and the `reference/` files it points to) before doing the matching task:

| Skill                    | Use it when                                                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `using-docs-kit`         | Working on the docs site: `docs.config.ts`, pages under `docs/`, `lobedocs` commands, generated `llms.txt` / `skills.md`, build errors                                             |
| `building-landing-home`  | Changing the site home page `docs/home/home.tsx` (`@lobehub/ui/awesome` landing components)                                                                                        |
| `lobe-lint-v2-migration` | Upgrading a repo from @lobehub/lint 1.x to 2.x: `scripts/migrate.mjs` (config codemod), `scripts/default-export.mjs` (optional named-export codemod); page `docs/migration-v2.mdx` |

The skill files are kept exactly as authored: `.agents` is listed in `.remarkignore` and `.prettierignore`, so hooks do not reformat them. Do not edit them unless asked.

Other sources:

- **This file** for repo workflow: commands, where things live, how to add configs and rules.
- **Package READMEs** (`packages/*/README.md`) and the docs site pages for user-facing options and examples.
- **Source code** as the final word: `packages/eslint-config/src/types.ts` for ESLint options, `packages/create-lint/src/constants.ts` and `src/cli.ts` (`printHelp`) for CLI tools and flags.

## Writing Docs

**Where docs live**

- `README.md` (root): introduction and usage only, in this order: Why, Getting Started, AI-Powered Development, Packages, Local Development, Contributing, Links. Keep it short. Put options and configuration details in package READMEs and link to them.
- `packages/*/README.md`: per-package Features, Installation, Usage and option reference. Detailed config docs go here.
- Docs site (`@lobehub/docs-kit`, config in `docs.config.ts`):
  - `docs/home/home.tsx`: custom home page (`homePage`);
  - `docs/getting-started.mdx`, `docs/ai-agents.mdx`: guides (`publicDocs`, shown in the nav);
  - `docs/packages/<package-dir>/index.mdx`: one page per package (`atomDirs`), served at `/packages/<package-dir>`. docs-kit treats every `docs/**` page as a guide, so these have no sidebar entry; the home page and other pages link to them, and the frontmatter `category` shows up in `llms.txt`;
  - `/changelog` is generated from the root `CHANGELOG.md`.
  - Rule pages are generated, one per tool: `/rules/eslint`, `/rules/stylelint`, `/rules/prettier`, `/rules/commitlint`, `/rules/remarklint`, plus the index `/rules`. `pnpm docs:rules` (`scripts/generate-rules-data.ts`, run first by `docs:dev` and `docs:build`) imports each config from `packages/*/src`, resolves it with the tool's own API (ESLint `calculateConfigForFile` for several `defineConfig()` presets, `stylelint.resolveConfig`, `@commitlint/load`, Prettier `getSupportInfo`, remark presets expanded) and writes `docs/rules/data/<tool>.json`, `docs/rules/<tool>.mdx` and `docs/rules/index.mdx` (all gitignored; `docs.config.ts` publishes only the pages that exist). Each page imports only its own JSON and renders it with `docs/rules/RulesExplorer.tsx`, and carries a plain-text summary that becomes its own `skills/rules/<tool>.md` entry. The sidebar links to each tool page through `themeConfig.navItems`. Never hand-write rule lists; change the generator or the configs.
  - `pnpm docs:build` writes the static site to `dist/` together with agent-readable `llms.txt`, `skills.md` and `skills/**/*.md`, and fails on broken internal links. `.react-router/` (typegen output from `postinstall`) and `dist/` are gitignored.
- `CHANGELOG.md`: v1 entries were generated by the old semantic-release flow; v2 entries (v2.0.0 to v2.1.5) were backfilled by hand from the git tags and commits, in the same format. `pnpm release` (bumpp) does not update it, so add an entry for each new release, built only from real tags and commits. Do not rewrite existing entries unless asked.
- `AGENTS.md`: this file.

**What runs automatically.** On commit, lint-staged runs `remark --quiet --output --silently-ignore` and then `prettier --write` on staged `*.md` files (files listed in `.remarkignore` / `.prettierignore` are skipped). `.mdx` pages are not processed by remark; Prettier formats them in `pnpm prettier`. Remark (`@lobehub/remarklint-config`):

- rebuilds the list under a `#### TOC` heading (max depth 3), so add or rename headings and let it regenerate the list;
- sorts reference-style link definitions and removes unused ones;
- normalizes `-` bullets and `*` emphasis, and adds CJK/Latin spacing.

Line-length and write-good warnings do not block the commit.

**Conventions**

- Write in English and keep the LobeHub layout: header logos and shields, reference-style links under `<!-- LINK GROUP -->`, back-to-top blocks between sections.
- Only document options, flags and commands that exist in code. Check every link (no 404s).

**Keep docs in sync with code**

| You changed        | Also update                                                                                                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| An ESLint option   | JSDoc in `packages/eslint-config/src/types.ts`; "Full Options" and "Options Reference" in `packages/eslint-config/README.md`                                                  |
| A CLI tool or flag | `printHelp()` in `packages/create-lint/src/cli.ts`; Options and Generated Files in `packages/create-lint/README.md`                                                           |
| Added a package    | Packages table in root `README.md`; Exports and Individual Packages in `packages/lint/README.md`; the Overview table here; a new `docs/packages/<package-dir>/index.mdx` page |
| Any package README | The matching `docs/packages/<package-dir>/index.mdx` page, then run `pnpm docs:build`                                                                                         |

## Adding a New Config Package / Rule

### Add or change a rule in an existing config

1. Edit the config:
   - ESLint: the matching module in `packages/eslint-config/src/configs/<concern>.ts`.
   - Other tools: `packages/<tool>-config/src/index.ts`.

2. New ESLint plugin? Add it to `dependencies` in `packages/eslint-config/package.json`, and register it in `packages/eslint-config/scripts/generate-eslint-typegen.mjs`. That script runs as `prebuild` and generates `src/eslint-typegen.d.ts`, which is gitignored.

3. New ESLint option? Follow the YAML commit (`ae2afbd`):
   - add the field with JSDoc and `@default` to `Options` in `src/types.ts`;
   - destructure it with its default in `defineConfig()` in `src/index.ts`, and spread the module's result into the `configs` array;
   - have the module return `[]` when the option is off;
   - put new file globs in `src/globs.ts`.

4. Add fixtures (eslint-config): put files in `tests/fixtures/<concern>/valid/` or `invalid/`, then register each one in `tests/run-fixtures.test.ts`:

   - valid files: add the path to the "valid" list;
   - invalid files: add `[path, expectedRuleId]`.

   Fixtures are linted with `defineConfig({ ignores: [], react: true, typescript: true })`. Root `eslint.config.js` ignores `**/tests/fixtures/**`. See `288ca31` for the pattern.

5. If generated CLI output changes (for example lint-staged globs in `packages/create-lint/src/generators/git-hooks.ts`), update `packages/create-lint/tests/cli.test.ts` (see `3818f8d`).

6. Sync the docs (table above), then run the checks below.

### Add a new config package

1. Create `packages/<tool>-config/`, modeled on `packages/prettier-config`:
   - `package.json`:
     - name `@lobehub/<tool>-config`, with the same `version` as the other packages (they release in lockstep);
     - `"type": "module"`, and `exports` / `main` / `module` / `types` pointing into `dist`, with `"files": ["dist"]`;
     - scripts `build: tsdown`, `dev: tsdown --watch`, `type-check: tsc --noEmit`;
     - the tool in `peerDependencies`, plus `engines` and `publishConfig` (`access: public`).
   - `tsconfig.json` extending `../../tsconfig.base.json`, with `rootDir: ./src`, `outDir: ./dist`, `include: ["src"]`.
   - `src/index.ts` that default-exports the config. Config packages use a default export as their public API; the repo's `no-restricted-syntax` default-export rule only warns.
   - `README.md` in the same layout as the other package READMEs.
2. Wire it into the monorepo:
   - `pnpm-workspace.yaml` already covers `packages/*`.
   - The root `tsdown.config.ts` (entry `src/index.ts`, ESM + CJS) is shared by packages that do not have their own. Extra entries go in the build script, as in `semantic-release-config`.
   - Add the package to `references` in the root `tsconfig.json`.
3. Add it to the meta package:
   - `"@lobehub/<tool>-config": "workspace:*"` in `packages/lint/package.json`;
   - a named re-export in `packages/lint/src/index.ts`;
   - `packages/lint/README.md`.
4. Register it in `create-lobe-lint` (`packages/create-lint/src`):
   - `types.ts`: add the tool to the `ConfigTool` union and a flag to `CliOptions`.
   - `constants.ts`:
     - a `CONFIG_META` entry (`package`, `peerDependencies`, `configFile`);
     - an `ALL_TOOLS` entry;
     - `EXISTING_CONFIG_PATTERNS`;
     - `PRESET_TOOLS` only if it should be on by default.
   - `generators/<tool>.ts` with `generate<Tool>Config()` and `get<Tool>Dependencies()`, wired into the switches in `generators/index.ts`.
   - Flags:
     - `index.ts`: the `mri` boolean list and the options mapping;
     - `cli.ts`: `hasToolFlags()`, `getSelectionsFromFlags()` and `printHelp()`.
   - Optional:
     - a `LINT_STAGED_RULES` entry in `generators/git-hooks.ts` (the `Record<ConfigTool, …>` type makes this required);
     - `TOOLS_WITH_IGNORE_FILES` in `cli.ts` together with `IGNORE_CONFIG` in `generators/ignore-files.ts`.
   - Tests in `packages/create-lint/tests/`.
5. Document it (table above), then run `pnpm install` and the checks below.

### Release

All packages share one version. A maintainer runs `pnpm release`, which runs bumpp: it bumps every package, commits `:bookmark: chore(release): v<version>` and tags `v<version>`. Pushing a `v*` tag triggers `.github/workflows/release.yml`, which builds and runs `pnpm -r publish`; tags that contain `-` publish under the npm `beta` tag. PRs get preview builds from `pkg.pr.new.yml`. The root `release.config.js` is left over from the semantic-release flow; no workflow runs it. Agents must not bump versions, run `pnpm release` or push tags unless asked.

## Conventions & Checks

**Commands** (root `package.json` scripts):

| Command                         | What it does                                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`                  | Install workspace dependencies                                                                                                   |
| `pnpm build`                    | Build all packages with tsdown. Run it before `type-check`: `@lobehub/lint` resolves sibling packages through their `dist` types |
| `pnpm type-check`               | `tsc --noEmit` in every package                                                                                                  |
| `pnpm test`                     | Vitest in `eslint-config` (fixtures) and `create-lint` (CLI and E2E)                                                             |
| `pnpm lint` / `pnpm lint:style` | ESLint / Stylelint on `packages/*/src` (with `--fix`)                                                                            |
| `pnpm lint:md`                  | Remark on all Markdown (rewrites files)                                                                                          |
| `pnpm prettier`                 | Prettier `--write` on every file. This is repo-wide, so prefer formatting only the files you touched                             |
| `pnpm dev`                      | Watch-build all packages                                                                                                         |
| `pnpm docs:dev`                 | Run the docs site locally (`lobedocs dev`)                                                                                       |
| `pnpm docs:build`               | Build the docs site into `dist/` (`lobedocs build`), including `llms.txt` and `skills.md`; `postinstall` runs `lobedocs typegen` |

**Before you commit:** run `pnpm build`, `pnpm type-check` and `pnpm test`.

**Git hooks** (husky):

- pre-commit runs `npm run type-check`, then lint-staged (Prettier, ESLint, Stylelint and Remark on staged files);
- commit-msg runs commitlint.

Never use `--no-verify`. If a hook fails, fix the cause and commit again. Hooks need `node` on `PATH` (for example, a login shell with nvm loaded).

**Commit messages** use gitmoji plus conventional commits, `<emoji> <type>(<scope>): <subject>`:

- keep the scope lowercase, usually the package directory: `✨ feat(eslint-config): add YAML support to ESLint configuration`, `🔧 chore(eslint-config): update dependencies to latest versions`, `📝 docs: update README`;
- mark breaking changes with `!`: `✨ feat(eslint-config)!: ban default export`.

**Downstream impact.** Every config ships to all LobeHub projects, so a new `error` rule can break their CI.

- Prefer auto-fixable rules. Use `warn` or put the rule behind an option when adoption is uncertain.
- Mark breaking changes with `!` and document them in the package README.
