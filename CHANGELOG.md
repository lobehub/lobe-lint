<a name="readme-top"></a>

# Changelog

### [Version 2.1.6](https://github.com/lobehub/lobe-lint/compare/v2.1.5...v2.1.6)

<sup>Released on **2026-10-21**</sup>

#### ✨ Features

- **lint**: Add commonjs `@lobehub/lint/release` and `@lobehub/lint/release-monorepo` entries.
- **lint**: Add commonjs `@lobehub/lint/changelog` entry.
- **misc**: ESLint 10, toolchain bump, and MDX plugin patch.
- **eslint-config**: Add MDX support to ESLint configuration.

#### 🐛 Bug Fixes

- **eslint-config**: Stop import-x/no-duplicates from merging into invalid type imports.
- **stylelint-config**: Keep css-in-js interpolations when fixing logical properties.
- **skill**: Always write `.releaserc.cjs` and verify it with getConfig.
- **skill**: Write `.changelogrc.cjs` and migrate workspace packages.
- **deps**: Upgrade dependencies and adapt eslint-config.

#### 📝 Documentation

- **misc**: Add docs site with rules explorer and refresh docs.
- **misc**: Add lobe-lint v2 migration skill.
- **skill**: Document semantic-release ignoring `.releaserc.mjs`, 2.1.5 autofixes, release notes and peer warnings.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **lint**: Add commonjs @lobehub/lint/release entries ([4f5d2a8](https://github.com/lobehub/lobe-lint/commit/4f5d2a8))
- **lint**: Add commonjs @lobehub/lint/changelog entry ([7eb9d7e](https://github.com/lobehub/lobe-lint/commit/7eb9d7e))
- **misc**: ESLint 10, toolchain bump, and MDX plugin patch ([73813e4](https://github.com/lobehub/lobe-lint/commit/73813e4))
- **eslint-config**: Add MDX support to ESLint configuration ([70bca28](https://github.com/lobehub/lobe-lint/commit/70bca28))

#### What's fixed

- **eslint-config**: Stop import-x/no-duplicates from merging into invalid type imports ([0a1dc91](https://github.com/lobehub/lobe-lint/commit/0a1dc91))
- **stylelint-config**: Keep css-in-js interpolations when fixing logical properties ([67c5269](https://github.com/lobehub/lobe-lint/commit/67c5269))
- **skill**: Always write .releaserc.cjs and verify it with getConfig ([f7fbacc](https://github.com/lobehub/lobe-lint/commit/f7fbacc))
- **skill**: Write .releaserc.cjs when semantic-release is below 22 ([d1b6c74](https://github.com/lobehub/lobe-lint/commit/d1b6c74))
- **skill**: Write .changelogrc.cjs and migrate workspace packages ([09db266](https://github.com/lobehub/lobe-lint/commit/09db266))
- **deps**: Upgrade dependencies and adapt eslint-config ([a25a984](https://github.com/lobehub/lobe-lint/commit/a25a984))

#### Documentation

- **misc**: Check the resolved cosmiconfig before keeping .releaserc.mjs ([90570ed](https://github.com/lobehub/lobe-lint/commit/90570ed))
- **skill**: Document semantic-release ignoring .releaserc.mjs ([5a88f33](https://github.com/lobehub/lobe-lint/commit/5a88f33))
- **skill**: Document 2.1.5 autofix, release-notes and peer warnings ([2d6bd56](https://github.com/lobehub/lobe-lint/commit/2d6bd56))
- **misc**: Drop default-export codemod from v2 migration skill ([180a0d6](https://github.com/lobehub/lobe-lint/commit/180a0d6))
- **misc**: Add lobe-lint v2 migration skill ([add4f16](https://github.com/lobehub/lobe-lint/commit/add4f16))
- **misc**: Add docs site with rules explorer and refresh docs ([66c0e8f](https://github.com/lobehub/lobe-lint/commit/66c0e8f))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 2.1.5](https://github.com/lobehub/lobe-lint/compare/v2.1.4...v2.1.5)

<sup>Released on **2026-02-14**</sup>

#### ⚠ BREAKING CHANGES

- **eslint-config**: Ban default export.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint-config**: Ban default export ([63c720e](https://github.com/lobehub/lobe-lint/commit/63c720e))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 2.1.4](https://github.com/lobehub/lobe-lint/compare/v2.1.3...v2.1.4)

<sup>Released on **2026-02-13**</sup>

#### 🔧 Chores

- **eslint-config**: Change fixStyle option for TypeScript configuration from inline-type-imports to separate-type-imports.
- **eslint-config**: Update dependencies to latest versions.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Chores

- **eslint-config**: Change fixStyle option for TypeScript configuration from inline-type-imports to separate-type-imports ([9bfcb3d](https://github.com/lobehub/lobe-lint/commit/9bfcb3d))
- **eslint-config**: Update dependencies to latest versions ([648c330](https://github.com/lobehub/lobe-lint/commit/648c330))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 2.1.3](https://github.com/lobehub/lobe-lint/compare/v2.1.2...v2.1.3)

<sup>Released on **2026-02-12**</sup>

#### ✨ Features

- **eslint-config**: Add new ESLint rules for object shorthand and useless rename.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint-config**: Add new ESLint rules for object shorthand and useless rename ([288ca31](https://github.com/lobehub/lobe-lint/commit/288ca31))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 2.1.2](https://github.com/lobehub/lobe-lint/compare/v2.1.1...v2.1.2)

<sup>Released on **2026-02-12**</sup>

#### ✨ Features

- **git-hooks**: Add YAML file support to ESLint linting rules.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **git-hooks**: Add YAML file support to ESLint linting rules ([3818f8d](https://github.com/lobehub/lobe-lint/commit/3818f8d))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 2.1.1](https://github.com/lobehub/lobe-lint/compare/v2.1.0...v2.1.1)

<sup>Released on **2026-02-11**</sup>

#### ✨ Features

- **eslint-config**: Add YAML support to ESLint configuration.
- **eslint-config**: Add ESLint type generation scripts and update configuration.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint-config**: Add YAML support to ESLint configuration ([ae2afbd](https://github.com/lobehub/lobe-lint/commit/ae2afbd))
- **eslint-config**: Add ESLint type generation scripts and update configuration ([33464af](https://github.com/lobehub/lobe-lint/commit/33464af))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 2.1.0](https://github.com/lobehub/lobe-lint/compare/v2.0.3...v2.1.0)

<sup>Released on **2026-02-11**</sup>

#### ✨ Features

- **eslint-config**: Enhance console logging rules and update glob patterns.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint-config**: Enhance console logging rules and update glob patterns ([e6131a1](https://github.com/lobehub/lobe-lint/commit/e6131a1))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 2.0.3](https://github.com/lobehub/lobe-lint/compare/v2.0.2...v2.0.3)

<sup>Released on **2026-02-10**</sup>

#### 🔧 Chores

- **eslint-config**: Disable consistent-type-specifier-style rule.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Chores

- **eslint-config**: Disable consistent-type-specifier-style rule ([dc20cc5](https://github.com/lobehub/lobe-lint/commit/dc20cc5))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 2.0.2](https://github.com/lobehub/lobe-lint/compare/v2.0.1...v2.0.2)

<sup>Released on **2026-02-09**</sup>

#### ✨ Features

- **eslint-config**: Disable various unicorn rules for improved flexibility.
- **create-lint**: Add ignore files generation with interactive option.

#### 🐛 Bug Fixes

- **misc**: Use inline type imports in test fixtures to match eslint config.

#### 📝 Documentation

- **misc**: Fix link formatting and remove redundant back-to-top sections in README.
- **misc**: Fix link formatting and remove redundant back-to-top sections in README.
- **misc**: Add LICENSE file and fix formatting in README.
- **misc**: Clean up README by removing shield section.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint-config**: Disable various unicorn rules for improved flexibility ([ea84f0b](https://github.com/lobehub/lobe-lint/commit/ea84f0b))
- **create-lint**: Add ignore files generation with interactive option ([c681a72](https://github.com/lobehub/lobe-lint/commit/c681a72))

#### What's fixed

- **misc**: Use inline type imports in test fixtures to match eslint config ([b66ad55](https://github.com/lobehub/lobe-lint/commit/b66ad55))

#### Documentation

- **misc**: Fix link formatting and remove redundant back-to-top sections in README ([812743a](https://github.com/lobehub/lobe-lint/commit/812743a))
- **misc**: Fix link formatting and remove redundant back-to-top sections in README ([3e3afc3](https://github.com/lobehub/lobe-lint/commit/3e3afc3))
- **misc**: Add LICENSE file and fix formatting in README ([3b1ccc5](https://github.com/lobehub/lobe-lint/commit/3b1ccc5))
- **misc**: Clean up README by removing shield section ([e9e69ac](https://github.com/lobehub/lobe-lint/commit/e9e69ac))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 2.0.1](https://github.com/lobehub/lobe-lint/compare/v2.0.0...v2.0.1)

<sup>Released on **2026-02-06**</sup>

#### ✨ Features

- **misc**: Add VSCode settings support to CLI and update README.

#### 📝 Documentation

- **misc**: Add Quick Start section for CLI tool in README.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Add VSCode settings support to CLI and update README ([2622dd8](https://github.com/lobehub/lobe-lint/commit/2622dd8))

#### Documentation

- **misc**: Add Quick Start section for CLI tool in README ([0fbc471](https://github.com/lobehub/lobe-lint/commit/0fbc471))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 2.0.0](https://github.com/lobehub/lobe-lint/compare/v1.26.3...v2.0.0)

<sup>Released on **2026-02-05**</sup>

Includes the `v2.0.0-beta.1` to `v2.0.0-beta.10` pre-releases.

#### ⚠ BREAKING CHANGES

- **misc**: v2 - Migrate to monorepo with ESLint 9 flat config.

#### ✨ Features

- **misc**: Add git hooks configuration support to create-lint.

#### 🔧 Chores

- **misc**: Enhance dependency installation logging in CLI.
- **misc**: Update ESLint import and TypeScript configurations for inline type imports.
- **misc**: Revise ESLint unicorn configuration and add new test fixtures.
- **misc**: Update ESLint unicorn configuration to disable require-module-specifiers rule.
- **misc**: Add ESLint comments configuration to enhance linting rules.
- **misc**: Update ESLint unicorn configuration to prefer immutable array methods.
- **misc**: Remove 'no-missing-end-of-source-newline' rule from stylelint configuration.
- **misc**: Update ESLint React configuration to disable no-leaked-conditional-rendering rule.
- **misc**: Enhance ESLint configuration to include glob patterns for config files.
- **misc**: Update GitHub Actions workflow to use pnpm for dependency management.
- **misc**: Update import paths to include file extensions in semantic-release-config.
- **misc**: Update release workflow to conditionally publish with beta tag and adjust branch filter in test workflow.
- **misc**: Refactor release script in package.json to include commit message and tag formatting.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Add git hooks configuration support to create-lint ([10f5cf2](https://github.com/lobehub/lobe-lint/commit/10f5cf2))
- **misc**: v2 - Migrate to monorepo with ESLint 9 flat config ([5420303](https://github.com/lobehub/lobe-lint/commit/5420303)) ([#80](https://github.com/lobehub/lobe-lint/pull/80))

#### Chores

- **misc**: Enhance dependency installation logging in CLI ([914caa6](https://github.com/lobehub/lobe-lint/commit/914caa6))
- **misc**: Update ESLint import and TypeScript configurations for inline type imports ([5af5ba7](https://github.com/lobehub/lobe-lint/commit/5af5ba7))
- **misc**: Revise ESLint unicorn configuration and add new test fixtures ([47c98d8](https://github.com/lobehub/lobe-lint/commit/47c98d8))
- **misc**: Update ESLint unicorn configuration to disable require-module-specifiers rule ([87f56f5](https://github.com/lobehub/lobe-lint/commit/87f56f5))
- **misc**: Add ESLint comments configuration to enhance linting rules ([488cc7e](https://github.com/lobehub/lobe-lint/commit/488cc7e))
- **misc**: Update ESLint unicorn configuration to prefer immutable array methods ([fffa19b](https://github.com/lobehub/lobe-lint/commit/fffa19b))
- **misc**: Remove 'no-missing-end-of-source-newline' rule from stylelint configuration ([4384444](https://github.com/lobehub/lobe-lint/commit/4384444))
- **misc**: Update ESLint React configuration to disable no-leaked-conditional-rendering rule ([aaf2c16](https://github.com/lobehub/lobe-lint/commit/aaf2c16))
- **misc**: Enhance ESLint configuration to include glob patterns for config files ([cfc7a48](https://github.com/lobehub/lobe-lint/commit/cfc7a48))
- **misc**: Update GitHub Actions workflow to use pnpm for dependency management ([3b28ec7](https://github.com/lobehub/lobe-lint/commit/3b28ec7))
- **misc**: Update import paths to include file extensions in semantic-release-config ([7b66fe7](https://github.com/lobehub/lobe-lint/commit/7b66fe7))
- **misc**: Update release workflow to conditionally publish with beta tag and adjust branch filter in test workflow ([adc151a](https://github.com/lobehub/lobe-lint/commit/adc151a))
- **misc**: Refactor release script in package.json to include commit message and tag formatting ([033aa8b](https://github.com/lobehub/lobe-lint/commit/033aa8b))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.26.3](https://github.com/lobehub/lobe-lint/compare/v1.26.2...v1.26.3)

<sup>Released on **2025-11-24**</sup>

#### 🐛 Bug Fixes

- **misc**: Lock stylelint-config-clean-order.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Lock stylelint-config-clean-order ([94fdd95](https://github.com/lobehub/lobe-lint/commit/94fdd95))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.26.2](https://github.com/lobehub/lobe-lint/compare/v1.26.1...v1.26.2)

<sup>Released on **2025-05-27**</sup>

#### 💄 Styles

- **misc**: Update eslint rule.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Styles

- **misc**: Update eslint rule ([164daa0](https://github.com/lobehub/lobe-lint/commit/164daa0))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.26.1](https://github.com/lobehub/lobe-lint/compare/v1.26.0...v1.26.1)

<sup>Released on **2025-04-02**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix jsx.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix jsx ([84bb801](https://github.com/lobehub/lobe-lint/commit/84bb801))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.26.0](https://github.com/lobehub/lobe-lint/compare/v1.25.7...v1.26.0)

<sup>Released on **2025-04-02**</sup>

#### ✨ Features

- **misc**: Support decorators in prettier.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Support decorators in prettier ([dc17b98](https://github.com/lobehub/lobe-lint/commit/dc17b98))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.25.7](https://github.com/lobehub/lobe-lint/compare/v1.25.6...v1.25.7)

<sup>Released on **2025-01-31**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix deps.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix deps ([97595b3](https://github.com/lobehub/lobe-lint/commit/97595b3))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.25.6](https://github.com/lobehub/lobe-lint/compare/v1.25.5...v1.25.6)

<sup>Released on **2025-01-31**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix deps.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix deps ([167c501](https://github.com/lobehub/lobe-lint/commit/167c501))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.25.5](https://github.com/lobehub/lobe-lint/compare/v1.25.4...v1.25.5)

<sup>Released on **2025-01-09**</sup>

#### 💄 Styles

- **misc**: Update react/self-closing-comp.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Styles

- **misc**: Update react/self-closing-comp ([de3850c](https://github.com/lobehub/lobe-lint/commit/de3850c))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.25.4](https://github.com/lobehub/lobe-lint/compare/v1.25.3...v1.25.4)

<sup>Released on **2025-01-09**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix json order.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix json order ([d8463ae](https://github.com/lobehub/lobe-lint/commit/d8463ae))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.25.3](https://github.com/lobehub/lobe-lint/compare/v1.25.2...v1.25.3)

<sup>Released on **2025-01-07**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix @typescript-eslint/eslint-plugin.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix @typescript-eslint/eslint-plugin ([7c4a12e](https://github.com/lobehub/lobe-lint/commit/7c4a12e))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.25.2](https://github.com/lobehub/lobe-lint/compare/v1.25.1...v1.25.2)

<sup>Released on **2025-01-07**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix eslint.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix eslint ([9e73db0](https://github.com/lobehub/lobe-lint/commit/9e73db0))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.25.1](https://github.com/lobehub/lobe-lint/compare/v1.25.0...v1.25.1)

<sup>Released on **2025-01-07**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix eslint.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix eslint ([562abca](https://github.com/lobehub/lobe-lint/commit/562abca))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.25.0](https://github.com/lobehub/lobe-lint/compare/v1.24.4...v1.25.0)

<sup>Released on **2025-01-07**</sup>

#### ✨ Features

- **misc**: Update Remark.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Update Remark ([78eec46](https://github.com/lobehub/lobe-lint/commit/78eec46))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.24.4](https://github.com/lobehub/lobe-lint/compare/v1.24.3...v1.24.4)

<sup>Released on **2024-08-09**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix eslint-plugin-unused-imports.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix eslint-plugin-unused-imports ([8bf0f43](https://github.com/lobehub/lobe-lint/commit/8bf0f43))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.24.3](https://github.com/lobehub/lobe-lint/compare/v1.24.2...v1.24.3)

<sup>Released on **2024-07-01**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix eslint.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix eslint ([e97b167](https://github.com/lobehub/lobe-lint/commit/e97b167))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.24.2](https://github.com/lobehub/lobe-lint/compare/v1.24.1...v1.24.2)

<sup>Released on **2024-07-01**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix stylelint.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix stylelint ([13b8d9c](https://github.com/lobehub/lobe-lint/commit/13b8d9c))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.24.1](https://github.com/lobehub/lobe-lint/compare/v1.24.0...v1.24.1)

<sup>Released on **2024-07-01**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix stylelint.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix stylelint ([a64d63e](https://github.com/lobehub/lobe-lint/commit/a64d63e))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.24.0](https://github.com/lobehub/lobe-lint/compare/v1.23.4...v1.24.0)

<sup>Released on **2024-07-01**</sup>

#### ✨ Features

- **misc**: Add stylelint-use-logical-spec.

#### 🐛 Bug Fixes

- **misc**: Fix deps.

#### 💄 Styles

- **misc**: Update value-no-vendor-prefix in stylelint.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Add stylelint-use-logical-spec ([861ecb8](https://github.com/lobehub/lobe-lint/commit/861ecb8))

#### What's fixed

- **misc**: Fix deps ([08169dd](https://github.com/lobehub/lobe-lint/commit/08169dd))

#### Styles

- **misc**: Update value-no-vendor-prefix in stylelint ([050b93f](https://github.com/lobehub/lobe-lint/commit/050b93f))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.23.4](https://github.com/lobehub/lobe-lint/compare/v1.23.3...v1.23.4)

<sup>Released on **2024-04-30**</sup>

#### 🐛 Bug Fixes

- **misc**: Lock [@typescript-eslint](https://github.com/typescript-eslint).

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Lock [@typescript-eslint](https://github.com/typescript-eslint) ([00c796f](https://github.com/lobehub/lobe-lint/commit/00c796f))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.23.3](https://github.com/lobehub/lobe-lint/compare/v1.23.2...v1.23.3)

<sup>Released on **2024-04-08**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix eslint rule.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix eslint rule ([8e82b19](https://github.com/lobehub/lobe-lint/commit/8e82b19))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.23.2](https://github.com/lobehub/lobe-lint/compare/v1.23.1...v1.23.2)

<sup>Released on **2024-04-08**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix eslint config.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix eslint config ([13a80a4](https://github.com/lobehub/lobe-lint/commit/13a80a4))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.23.1](https://github.com/lobehub/lobe-lint/compare/v1.23.0...v1.23.1)

<sup>Released on **2024-04-08**</sup>

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.23.0](https://github.com/lobehub/lobe-lint/compare/v1.22.0...v1.23.0)

<sup>Released on **2024-04-03**</sup>

#### ✨ Features

- **misc**: Update deps.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Update deps ([82db000](https://github.com/lobehub/lobe-lint/commit/82db000))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.22.0](https://github.com/lobehub/lobe-lint/compare/v1.21.0...v1.22.0)

<sup>Released on **2024-03-05**</sup>

#### ✨ Features

- **misc**: Update changelog config.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Update changelog config ([0080ab9](https://github.com/lobehub/lobe-lint/commit/0080ab9))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.21.0](https://github.com/lobehub/lobe-lint/compare/v1.20.0...v1.21.0)

<sup>Released on **2023-11-16**</sup>

#### ✨ Features

- **misc**: Add new function "remarkGfmHighlight" for modifying "blockquote" nodes.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Add new function "remarkGfmHighlight" for modifying "blockquote" nodes ([e0cd845](https://github.com/lobehub/lobe-lint/commit/e0cd845))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.20.0](https://github.com/lobehub/lobe-lint/compare/v1.19.0...v1.20.0)

<sup>Released on **2023-11-16**</sup>

#### ✨ Features

- **misc**: Add function to highlight specific blockquote nodes in Markdown.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Add function to highlight specific blockquote nodes in Markdown ([a17a894](https://github.com/lobehub/lobe-lint/commit/a17a894))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.19.0](https://github.com/lobehub/lobe-lint/compare/v1.18.1...v1.19.0)

<sup>Released on **2023-11-16**</sup>

#### ✨ Features

- **misc**: Update dependencies and modify code in TypeScript files.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Update dependencies and modify code in TypeScript files ([0786757](https://github.com/lobehub/lobe-lint/commit/0786757))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.18.1](https://github.com/lobehub/lobe-lint/compare/v1.18.0...v1.18.1)

<sup>Released on **2023-09-21**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix remark-gfm deps.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix remark-gfm deps ([1e1408f](https://github.com/lobehub/lobe-lint/commit/1e1408f))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.18.0](https://github.com/lobehub/lobe-lint/compare/v1.17.0...v1.18.0)

<sup>Released on **2023-09-17**</sup>

#### ✨ Features

- **misc**: Update remark setting.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Update remark setting ([c457ae0](https://github.com/lobehub/lobe-lint/commit/c457ae0))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.17.0](https://github.com/lobehub/lobe-lint/compare/v1.16.0...v1.17.0)

<sup>Released on **2023-09-05**</sup>

#### ✨ Features

- **misc**: Update remark plugins.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Update remark plugins ([25232f8](https://github.com/lobehub/lobe-lint/commit/25232f8))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.16.0](https://github.com/lobehub/lobe-lint/compare/v1.15.2...v1.16.0)

<sup>Released on **2023-09-04**</sup>

#### ✨ Features

- **misc**: Update eslint with umiji/lint.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Update eslint with umiji/lint ([fe602c3](https://github.com/lobehub/lobe-lint/commit/fe602c3))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.15.2](https://github.com/lobehub/lobe-lint/compare/v1.15.1...v1.15.2)

<sup>Released on **2023-08-25**</sup>

#### 🐛 Bug Fixes

- **misc**: Fix error.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Fix error ([570fcd4](https://github.com/lobehub/lobe-lint/commit/570fcd4))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.15.1](https://github.com/lobehub/lobe-lint/compare/v1.15.0...v1.15.1)

<sup>Released on **2023-08-25**</sup>

#### 💄 Styles

- **misc**: Update ESLint rules for TypeScript project.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Styles

- **misc**: Update ESLint rules for TypeScript project ([56314d0](https://github.com/lobehub/lobe-lint/commit/56314d0))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.15.0](https://github.com/lobehub/lobe-lint/compare/v1.14.0...v1.15.0)

<sup>Released on **2023-08-25**</sup>

#### ✨ Features

- **misc**: Add new dependencies and update ESLint configuration.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Add new dependencies and update ESLint configuration ([1d92c16](https://github.com/lobehub/lobe-lint/commit/1d92c16))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.14.0](https://github.com/lobehub/lobe-lint/compare/v1.13.0...v1.14.0)

<sup>Released on **2023-08-25**</sup>

#### ✨ Features

- **misc**: Add TypeScript, Jest, and React dependencies and plugins.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Add TypeScript, Jest, and React dependencies and plugins ([898dbc9](https://github.com/lobehub/lobe-lint/commit/898dbc9))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.13.0](https://github.com/lobehub/lobe-lint/compare/v1.12.0...v1.13.0)

<sup>Released on **2023-07-13**</sup>

#### ✨ Features

- **misc**: Add export statement for semanticReleaseMonoRepo, modify options object and export in semantic-release/index.ts, and create semantic-release/monorepo.ts file with imported options and new configuration object.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Add export statement for semanticReleaseMonoRepo, modify options object and export in semantic-release/index.ts, and create semantic-release/monorepo.ts file with imported options and new configuration object ([e46cd6c](https://github.com/lobehub/lobe-lint/commit/e46cd6c))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.12.0](https://github.com/lobehub/lobe-lint/compare/v1.11.0...v1.12.0)

<sup>Released on **2023-07-09**</sup>

#### ✨ Features

- **eslint**: Add "unicorn/switch-case-braces" rule with warning level.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint**: Add "unicorn/switch-case-braces" rule with warning level ([3dddf3d](https://github.com/lobehub/lobe-lint/commit/3dddf3d))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.11.0](https://github.com/lobehub/lobe-lint/compare/v1.10.0...v1.11.0)

<sup>Released on **2023-07-09**</sup>

#### ✨ Features

- **misc**: Update prettier dependency and add eslint rules.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Update prettier dependency and add eslint rules ([1715d85](https://github.com/lobehub/lobe-lint/commit/1715d85))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.10.0](https://github.com/lobehub/lobe-lint/compare/v1.9.0...v1.10.0)

<sup>Released on **2023-07-09**</sup>

#### ✨ Features

- **eslint**: Add warnings for "no-empty", "unicorn/explicit-length-check", and "unicorn/no-empty-file" rules.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint**: Add warnings for "no-empty", "unicorn/explicit-length-check", and "unicorn/no-empty-file" rules ([51c8ce6](https://github.com/lobehub/lobe-lint/commit/51c8ce6))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.9.0](https://github.com/lobehub/lobe-lint/compare/v1.8.2...v1.9.0)

<sup>Released on **2023-07-08**</sup>

#### ✨ Features

- **eslint**: Update coding conventions rules in "index.ts".

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint**: Update coding conventions rules in "index.ts" ([aee57d1](https://github.com/lobehub/lobe-lint/commit/aee57d1))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.8.2](https://github.com/lobehub/lobe-lint/compare/v1.8.1...v1.8.2)

<sup>Released on **2023-07-07**</sup>

#### 🐛 Bug Fixes

- **eslint**: Rm env from abbreviations.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **eslint**: Rm env from abbreviations ([2d04f48](https://github.com/lobehub/lobe-lint/commit/2d04f48))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.8.1](https://github.com/lobehub/lobe-lint/compare/v1.8.0...v1.8.1)

<sup>Released on **2023-07-07**</sup>

#### 🐛 Bug Fixes

- **eslint**: Add ProcessEnv to abbreviations list.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **eslint**: Add ProcessEnv to abbreviations list ([1a471a6](https://github.com/lobehub/lobe-lint/commit/1a471a6))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.8.0](https://github.com/lobehub/lobe-lint/compare/v1.7.5...v1.8.0)

<sup>Released on **2023-06-16**</sup>

#### ✨ Features

- **eslint**: Add new rules for unicorn/no-array-for-each and unicorn/no-null, update eslint config.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint**: Add new rules for unicorn/no-array-for-each and unicorn/no-null ([124cd9c](https://github.com/lobehub/lobe-lint/commit/124cd9c))
- **eslint**: Update eslint config ([58594d6](https://github.com/lobehub/lobe-lint/commit/58594d6))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.7.5](https://github.com/lobehub/lobe-lint/compare/v1.7.4...v1.7.5)

<sup>Released on **2023-06-16**</sup>

#### ♻ Code Refactoring

- **eslint**: Update unicorn/prevent-abbreviations rule.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Code refactoring

- **eslint**: Update unicorn/prevent-abbreviations rule ([054255a](https://github.com/lobehub/lobe-lint/commit/054255a))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.7.4](https://github.com/lobehub/lobe-lint/compare/v1.7.3...v1.7.4)

<sup>Released on **2023-06-16**</sup>

#### ♻ Code Refactoring

- **eslint**: Remove custom abbreviation rule.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Code refactoring

- **eslint**: Remove custom abbreviation rule ([7301e47](https://github.com/lobehub/lobe-lint/commit/7301e47))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.7.3](https://github.com/lobehub/lobe-lint/compare/v1.7.2...v1.7.3)

<sup>Released on **2023-06-16**</sup>

#### 💄 Styles

- **prettier**: Add new Prettier rules.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Styles

- **prettier**: Add new Prettier rules ([6eaf48f](https://github.com/lobehub/lobe-lint/commit/6eaf48f))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.7.2](https://github.com/lobehub/lobe-lint/compare/v1.7.1...v1.7.2)

<sup>Released on **2023-06-16**</sup>

#### 💄 Styles

- **eslint**: Update eslint rules for unicorn/prevent-abbreviations.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Styles

- **eslint**: Update eslint rules for unicorn/prevent-abbreviations ([847d6a2](https://github.com/lobehub/lobe-lint/commit/847d6a2))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.7.1](https://github.com/lobehub/lobe-lint/compare/v1.7.0...v1.7.1)

<sup>Released on **2023-06-16**</sup>

#### ♻ Code Refactoring

- **eslint**: Update ESLint rules and remove unused rules.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Code refactoring

- **eslint**: Update ESLint rules and remove unused rules ([f8009fe](https://github.com/lobehub/lobe-lint/commit/f8009fe))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.7.0](https://github.com/lobehub/lobe-lint/compare/v1.6.1...v1.7.0)

<sup>Released on **2023-06-16**</sup>

#### ✨ Features

- **eslint**: Add eslint-plugin-unicorn and related rules.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint**: Add eslint-plugin-unicorn and related rules ([90c6ddd](https://github.com/lobehub/lobe-lint/commit/90c6ddd))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.6.1](https://github.com/lobehub/lobe-lint/compare/v1.6.0...v1.6.1)

<sup>Released on **2023-06-16**</sup>

#### ♻ Code Refactoring

- **eslint-config**: Remove unused eslint plugins and rules.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Code refactoring

- **eslint-config**: Remove unused eslint plugins and rules ([4568381](https://github.com/lobehub/lobe-lint/commit/4568381))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## [Version 1.6.0](https://github.com/lobehub/lobe-lint/compare/v1.5.1...v1.6.0)

<sup>Released on **2023-06-16**</sup>

#### ✨ Features

- **eslint**: Add new plugins and rules.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint**: Add new plugins and rules ([d73cee2](https://github.com/lobehub/lobe-lint/commit/d73cee2))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### [Version 1.5.1](https://github.com/lobehub/lobe-lint/compare/v1.5.0...v1.5.1)

<sup>Released on **2023-06-13**</sup>

#### 🐛 Bug Fixes

- **changelog**: Fix changelog config typo.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **changelog**: Fix changelog config typo ([75fb106](https://github.com/lobehub/lobe-lint/commit/75fb106))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## Version 1.5.0

<sup>Released on **2023-06-11**</sup>

#### ✨ Features

- **changelog**: Add displayTypes options.
- **config**: Add release rules for minor, patch and major releases based on commit type.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **changelog**: Add displayTypes options ([16faf66](https://github.com/lobehub/lobe-lint/commit/16faf66))
- **config**: Add release rules for minor, patch and major releases based on commit type ([61224b6](https://github.com/lobehub/lobe-lint/commit/61224b6))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## Version 1.4.0

<sup>Released on **2023-06-11**</sup>

#### ♻ Code Refactoring

- **misc**: Update config files to import from dist directory.

#### ✨ Features

- **config**: Add release rules for minor, patch and major releases based on commit type.
- **semantic-release**: Update configs.
- **misc**: Update config, update config \[force release].

#### 🐛 Bug Fixes

- **semantic-release**: Fix semantic-release config.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Code refactoring

- **misc**: Update config files to import from dist directory ([dac1221](https://github.com/lobehub/lobe-lint/commit/dac1221))

#### What's improved

- **config**: Add release rules for minor, patch and major releases based on commit type ([dabb122](https://github.com/lobehub/lobe-lint/commit/dabb122))
- **semantic-release**: Update configs ([738941a](https://github.com/lobehub/lobe-lint/commit/738941a))
- **misc**: Update config ([2f282fa](https://github.com/lobehub/lobe-lint/commit/2f282fa))
- **misc**: Update config \[force release] ([96a8483](https://github.com/lobehub/lobe-lint/commit/96a8483))

#### What's fixed

- **semantic-release**: Fix semantic-release config ([43a4858](https://github.com/lobehub/lobe-lint/commit/43a4858))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## Version 1.3.0

<sup>Released on **2023-06-10**</sup>

#### ✨ Features

- **misc**: Update changelog config.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Update changelog config ([158674c](https://github.com/lobehub/lobe-lint/commit/158674c))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### Version 1.2.1

<sup>Released on **2023-06-09**</sup>

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## Version 1.2.0

<sup>Released on **2023-06-09**</sup>

#### ✨ Features

- **eslint**: Add eslint-plugin-unused-imports.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **eslint**: Add eslint-plugin-unused-imports ([0eb0f4d](https://github.com/lobehub/lobe-lint/commit/0eb0f4d))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### Version 1.1.2

<sup>Released on **2023-06-08**</sup>

#### 💄 Styles

- **misc**: Add image file extensions to .prettierignore and add download count badge to README.md.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Styles

- **misc**: Add image file extensions to .prettierignore and add download count badge to README.md ([555c532](https://github.com/lobehub/lobe-lint/commit/555c532))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### Version 1.1.1

<sup>Released on **2023-06-08**</sup>

#### 💄 Styles

- **misc**: Prettier.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### Styles

- **misc**: Prettier ([93e7a39](https://github.com/lobehub/lobe-lint/commit/93e7a39))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## Version 1.1.0

<sup>Released on **2023-06-08**</sup>

#### ✨ Features

- **ignore**: Better ignore file.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **ignore**: Better ignore file ([aa7f702](https://github.com/lobehub/lobe-lint/commit/aa7f702))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

### Version 1.0.1

<sup>Released on **2023-06-06**</sup>

#### 🐛 Bug Fixes

- **misc**: Prettier.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's fixed

- **misc**: Prettier ([f2eb10d](https://github.com/lobehub/lobe-lint/commit/f2eb10d))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>

## Version 1.0.0

<sup>Released on **2023-06-06**</sup>

#### ✨ Features

- **misc**: Add lints config.

<br/>

<details>
<summary><kbd>Improvements and Fixes</kbd></summary>

#### What's improved

- **misc**: Add lints config ([3e56232](https://github.com/lobehub/lobe-lint/commit/3e56232))

</details>

<div align="right">

[![](https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square)](#readme-top)

</div>
