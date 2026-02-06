<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/triangular-ruler.webp">

<h1>Lobe Lint</h1>

ESLint, Prettier, Stylelint, Commitlint, Remarklint, and Semantic Release configs for LobeHub

[Changelog](./CHANGELOG.md) · [Report Bug][issues-link] · [Request Feature][issues-link]

<!-- SHIELD GROUP -->

[![][npm-release-shield]][npm-release-link]
[![][discord-shield]][discord-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-releasedate-shield]][github-releasedate-link]
[![][github-action-test-shield]][github-action-test-link]
[![][github-action-release-shield]][github-action-release-link]<br/>
[![][github-contributors-shield]][github-contributors-link]
[![][github-forks-shield]][github-forks-link]
[![][github-stars-shield]][github-stars-link]
[![][github-issues-shield]][github-issues-link]
[![][github-license-shield]][github-license-link]

</div>

![](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [Features](#features)
- [Packages](#packages)
- [Installation](#installation)
- [Quick Start (CLI)](#quick-start-cli)
- [Usage](#usage)
  - [ESLint](#eslint)
  - [Prettier](#prettier)
  - [Stylelint](#stylelint)
  - [Commitlint](#commitlint)
  - [Remarklint](#remarklint)
  - [Semantic Release](#semantic-release)
- [Migration from v1](#migration-from-v1)
  - [Breaking Changes](#breaking-changes)
  - [Migration Steps](#migration-steps)
- [Local Development](#local-development)
- [Contributing](#contributing)

####

</details>

## Features

- **ESM-first** - Modern ES Modules support
- **ESLint 9 Flat Config** - Latest ESLint configuration format
- **TypeScript** - Full TypeScript support with type-aware rules
- **React/Next.js/Remix** - React ecosystem support
- **React Native** - Mobile development support
- **Monorepo** - Modular packages for flexible usage

## Packages

| Package                                                                | Version                                             | Description                |
| ---------------------------------------------------------------------- | --------------------------------------------------- | -------------------------- |
| [@lobehub/eslint-config](./packages/eslint-config)                     | [![][eslint-npm-shield]][eslint-npm-link]           | ESLint Flat Config         |
| [@lobehub/prettier-config](./packages/prettier-config)                 | [![][prettier-npm-shield]][prettier-npm-link]       | Prettier config            |
| [@lobehub/stylelint-config](./packages/stylelint-config)               | [![][stylelint-npm-shield]][stylelint-npm-link]     | Stylelint config           |
| [@lobehub/commitlint-config](./packages/commitlint-config)             | [![][commitlint-npm-shield]][commitlint-npm-link]   | Commitlint config          |
| [@lobehub/remarklint-config](./packages/remarklint-config)             | [![][remarklint-npm-shield]][remarklint-npm-link]   | Remarklint config          |
| [@lobehub/semantic-release-config](./packages/semantic-release-config) | [![][semantic-npm-shield]][semantic-npm-link]       | Semantic release config    |
| [@lobehub/lint](./packages/lint)                                       | [![][npm-release-shield]][npm-release-link]         | Meta package (all configs) |
| [create-lobe-lint](./packages/create-lint)                             | [![][create-lint-npm-shield]][create-lint-npm-link] | CLI setup tool             |

## Installation

Install the meta package for all configs:

[![][bun-shield]][bun-link]

```bash
bun add -D @lobehub/lint
```

Or install individual packages as needed:

```bash
# ESLint only
bun add -D @lobehub/eslint-config eslint typescript

# Prettier only
bun add -D @lobehub/prettier-config prettier
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## Quick Start (CLI)

The fastest way to set up LobeHub lint configs in your project is using the CLI tool:

```bash
npx create-lobe-lint
```

This will start an interactive setup that auto-detects your project configuration (package manager, TypeScript, React framework) and generates the appropriate config files.

```bash
# Quick setup with preset defaults
npx create-lobe-lint --preset -y

# Select specific tools with framework
npx create-lobe-lint --eslint --prettier --react next

# Manual selection mode
npx create-lobe-lint --manual
```

See [create-lobe-lint](./packages/create-lint) for full options and documentation.

## Usage

### ESLint

Create `eslint.config.mjs`:

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  // Enable React with Next.js support
  react: 'next',
  // Enable TypeScript strict mode
  typescript: 'strict',
});
```

See [@lobehub/eslint-config](./packages/eslint-config) for full options.

### Prettier

Create `prettier.config.mjs`:

```js
import { prettier } from '@lobehub/lint';

export default prettier;
```

### Stylelint

Create `stylelint.config.mjs`:

```js
import { stylelint } from '@lobehub/lint';

export default stylelint;
```

### Commitlint

Create `commitlint.config.mjs`:

```js
import { commitlint } from '@lobehub/lint';

export default commitlint;
```

### Remarklint

Create `.remarkrc.mjs`:

```js
import { remarklint } from '@lobehub/lint';

export default remarklint;
```

### Semantic Release

Create `.releaserc.mjs`:

```js
import { semanticRelease } from '@lobehub/lint';

export default semanticRelease;
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## Migration from v1

### Breaking Changes

- **ESM only** - CommonJS is no longer supported
- **ESLint 9** - Requires ESLint 9+ with Flat Config
- **Node.js 18** - Requires Node.js 18+

### Migration Steps

1. Update your config files to use ESM syntax (`.mjs` extension or `"type": "module"`)
2. Replace `.eslintrc.js` with `eslint.config.mjs`
3. Update imports:

**Before (v1):**

```js
module.exports = require('@lobehub/lint').eslint;
```

**After (v2):**

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  react: true,
});
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## Local Development

You can use Github Codespaces for online development:

[![][codespaces-shield]][codespaces-link]

Or clone it for local development:

```bash
git clone https://github.com/lobehub/lobe-lint.git
cd lobe-lint
pnpm install
pnpm build
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## Contributing

Contributions of all types are more than welcome, if you are interested in contributing code, feel free to check out our GitHub [Issues][github-issues-link] to get stuck in to show us what you're made of.

[![][pr-welcome-shield]][pr-welcome-link]

[![][contributors-contrib]][contributors-url]

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

#### 📝 License

Copyright © 2026 [LobeHub][profile-link]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square
[bun-link]: https://bun.sh
[bun-shield]: https://img.shields.io/badge/-speedup%20with%20bun-black?logo=bun&style=for-the-badge
[codespaces-link]: https://codespaces.new/lobehub/lobe-lint
[codespaces-shield]: https://github.com/codespaces/badge.svg
[commitlint-npm-link]: https://www.npmjs.com/package/@lobehub/commitlint-config
[commitlint-npm-shield]: https://img.shields.io/npm/v/@lobehub/commitlint-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[contributors-contrib]: https://contrib.rocks/image?repo=lobehub/lobe-lint
[contributors-url]: https://github.com/lobehub/lobe-lint/graphs/contributors
[create-lint-npm-link]: https://www.npmjs.com/package/create-lobe-lint
[create-lint-npm-shield]: https://img.shields.io/npm/v/create-lobe-lint?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[discord-link]: https://discord.gg/AYFPHvv2jT
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=flat-square
[eslint-npm-link]: https://www.npmjs.com/package/@lobehub/eslint-config
[eslint-npm-shield]: https://img.shields.io/npm/v/@lobehub/eslint-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[github-action-release-link]: https://github.com/lobehub/lobe-lint/actions/workflows/release.yml
[github-action-release-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-lint/release.yml?label=release&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-action-test-link]: https://github.com/lobehub/lobe-lint/actions/workflows/test.yml
[github-action-test-shield]: https://img.shields.io/github/actions/workflow/status/lobehub/lobe-lint/test.yml?label=test&labelColor=black&logo=githubactions&logoColor=white&style=flat-square
[github-contributors-link]: https://github.com/lobehub/lobe-lint/graphs/contributors
[github-contributors-shield]: https://img.shields.io/github/contributors/lobehub/lobe-lint?color=c4f042&labelColor=black&style=flat-square
[github-forks-link]: https://github.com/lobehub/lobe-lint/network/members
[github-forks-shield]: https://img.shields.io/github/forks/lobehub/lobe-lint?color=8ae8ff&labelColor=black&style=flat-square
[github-issues-link]: https://github.com/lobehub/lobe-lint/issues
[github-issues-shield]: https://img.shields.io/github/issues/lobehub/lobe-lint?color=ff80eb&labelColor=black&style=flat-square
[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[github-releasedate-link]: https://github.com/lobehub/lobe-lint/releases
[github-releasedate-shield]: https://img.shields.io/github/release-date/lobehub/lobe-lint?labelColor=black&style=flat-square
[github-stars-link]: https://github.com/lobehub/lobe-lint/network/stargazers
[github-stars-shield]: https://img.shields.io/github/stars/lobehub/lobe-lint?color=ffcb47&labelColor=black&style=flat-square
[issues-link]: https://github.com/lobehub/lobe-lint/issues/new/choose
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/lint
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/lint?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/lint
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/lint?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[pr-welcome-link]: https://github.com/lobehub/lobe-lint/pulls
[pr-welcome-shield]: https://img.shields.io/badge/🤯_pr_welcome-%E2%86%92-ffcb47?labelColor=black&style=for-the-badge
[prettier-npm-link]: https://www.npmjs.com/package/@lobehub/prettier-config
[prettier-npm-shield]: https://img.shields.io/npm/v/@lobehub/prettier-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[profile-link]: https://github.com/lobehub
[remarklint-npm-link]: https://www.npmjs.com/package/@lobehub/remarklint-config
[remarklint-npm-shield]: https://img.shields.io/npm/v/@lobehub/remarklint-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[semantic-npm-link]: https://www.npmjs.com/package/@lobehub/semantic-release-config
[semantic-npm-shield]: https://img.shields.io/npm/v/@lobehub/semantic-release-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
[stylelint-npm-link]: https://www.npmjs.com/package/@lobehub/stylelint-config
[stylelint-npm-shield]: https://img.shields.io/npm/v/@lobehub/stylelint-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
