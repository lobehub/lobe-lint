# Sources and version notes

Every rule in this skill comes from one of these. When the lobe-lint `master` branch and the published 2.1.5 package differ, **2.1.5 wins**: downstream repos install it from npm.

| Source | Used for |
| --- | --- |
| npm `@lobehub/lint@2.1.5`, `@lobehub/eslint-config@2.1.5` and siblings (tarballs) | exports, `defineConfig` options, rule severities, plugin scoping, exemption globs, peer ranges |
| lobe-lint repo: `packages/*/src`, READMEs, `docs/`, `CHANGELOG.md` | intent of each change (2.0.0 flat config, 2.1.0 console rules, 2.1.5 default-export ban `63c720e`) |
| lobe-ui `7c4ddb28`, upgrade commit `5c0fab48` | canonical v2 file set, configs, scripts, lint-staged, hooks, devDependency versions |
| lobe-ui `src/eslint/index.ts` and history | `@lobehub/ui/eslint` exports and when they appeared |
| lobe-editor upgrade commit `064c107` | second v2 example (`"type": "module"` names, global `no-restricted-syntax: off`, CI guard in pre-commit) |
| lobe-icons, lobe-charts, lobe-tts, fluent-emoji (read-only) | v1 file sets and the cases the codemods must handle |
| ESLint docs (migration guide, CLI, v9.21.0 release) | removed CLI flags, `--ext` re-added in 9.21 |
| Clones in `/tmp` migrated with the scripts | every "verified" item and the numbers in default-export.md |

## `@lobehub/lint` 2.1.5 vs lobe-lint `master` (after the tag)

| Area | 2.1.5 (npm) | master |
| --- | --- | --- |
| `mdx` option, `eslint-mdx` / `eslint-plugin-mdx` | absent | added (`70bca28`) |
| `@eslint-react/eslint-plugin` | `^2.12.4` | `^5.8.1` |
| `eslint-plugin-react-hooks` | `5.2.0` | `7.1.1` |
| `eslint-plugin-unicorn` | `^63` | `^64` |
| `eslint-config-prettier` | `^9.1.2` | `^10.1.8` |
| `eslint-plugin-simple-import-sort` | `^12.1.1` | `^13` |
| prettier-config plugins (`packagejson`, `sh`) | `^2.5.6`, `^0.14.0` | `^3.0.2`, `^0.18.1` |
| remarklint `remark-sort-definitions` / `remove-unused-definitions` | `^2` | `^3` |
| `engines.node` | `>=18` in every package (wrong for ESLint 10) | remarklint `>=20.18`, create-lint `>=20` |
| dist file names | `.js` / `.d.ts` | `.mjs` / `.d.mts` |

Do not use master-only options (`mdx`) until a release ships them. npm dist-tags at the time of writing: `latest` 2.1.5, `beta` 2.0.0-beta.10.
