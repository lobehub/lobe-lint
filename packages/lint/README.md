<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-logo/assets/logo-3d.webp">
<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-logo/assets/split.svg">
<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-emoji/assets/triangular-ruler.webp">

<h1>@lobehub/lint</h1>

Meta package that re-exports all LobeHub lint configurations

[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-license-shield]][github-license-link]

</div>

## Overview

This is a convenience package that re-exports all LobeHub lint configurations. Install this single package to get access to all lint configs.

## Installation

```bash
pnpm add -D @lobehub/lint
```

You'll also need to install the peer dependencies:

```bash
pnpm add -D eslint prettier stylelint @commitlint/cli remark-cli semantic-release typescript
```

## Usage

### ESLint

```js
// eslint.config.mjs
import { defineConfig } from '@lobehub/lint';

export default defineConfig({
  react: 'next',
});
```

### Prettier

```js
// prettier.config.mjs
import { prettier } from '@lobehub/lint';

export default prettier;
```

### Stylelint

```js
// stylelint.config.mjs
import { stylelint } from '@lobehub/lint';

export default stylelint;
```

### Commitlint

```js
// commitlint.config.mjs
import { commitlint } from '@lobehub/lint';

export default commitlint;
```

### Remarklint

```js
// .remarkrc.mjs
import { remarklint } from '@lobehub/lint';

export default remarklint;
```

### Semantic Release

```js
// release.config.mjs
import { semanticRelease } from '@lobehub/lint';

export default semanticRelease;
```

For monorepo:

```js
import { semanticReleaseMonoRepo } from '@lobehub/lint';

export default semanticReleaseMonoRepo;
```

`changelog` is not a release config: it holds the gitmoji changelog formatting options (`addBackToTop`, `showAuthor`, `scopeDisplayName`, etc.).

### Changelog

conventional-changelog-gitmoji-config reads `.changelogrc*` with cosmiconfig 7, which only loads CommonJS and never reads `.changelogrc.mjs`. Use the CommonJS-safe subpath (the root `@lobehub/lint` entry cannot be `require()`d):

```js
// .changelogrc.cjs
module.exports = require('@lobehub/lint/changelog');
```

semantic-release 21 / 22 with cosmiconfig 8.0 / 8.1 (as some pnpm lockfiles resolve it) does not read `.releaserc.mjs` either. Use `.releaserc.cjs` there, or semantic-release 23+:

```js
// .releaserc.cjs
module.exports = require('@lobehub/lint/release'); // or '@lobehub/lint/release-monorepo'
```

## Exports

| Export                    | Type     | Description                             |
| ------------------------- | -------- | --------------------------------------- |
| `defineConfig` / `eslint` | Function | ESLint config factory                   |
| `defineEslintConfig`      | Function | Alias for defineConfig                  |
| `prettier`                | Object   | Prettier config                         |
| `stylelint`               | Object   | Stylelint config                        |
| `commitlint`              | Object   | Commitlint config                       |
| `remarklint`              | Object   | Remarklint config                       |
| `semanticRelease`         | Object   | Semantic release config                 |
| `semanticReleaseOptions`  | Object   | Options used to build `semanticRelease` |
| `semanticReleaseMonoRepo` | Object   | Monorepo semantic release config        |
| `changelog`               | Object   | Changelog formatting options            |

`@lobehub/lint/changelog`, `@lobehub/lint/release` and `@lobehub/lint/release-monorepo` default-export `changelog`, `semanticRelease` and `semanticReleaseMonoRepo` and can be loaded with `require()`.
\| `EslintOptions` | Type | ESLint `defineConfig()` options |

## Individual Packages

If you only need specific configurations, you can install them individually:

- `@lobehub/eslint-config` - ESLint configuration
- `@lobehub/prettier-config` - Prettier configuration
- `@lobehub/stylelint-config` - Stylelint configuration
- `@lobehub/commitlint-config` - Commitlint configuration
- `@lobehub/remarklint-config` - Remarklint configuration
- `@lobehub/semantic-release-config` - Semantic release configuration

## Requirements

- Node.js >= 20.18 (`@lobehub/remarklint-config` requires `>=20.18`; the other packages require `>=18`)
- ESLint 10 needs Node.js `^20.19.0 || ^22.13.0 || >=24`

## License

MIT © [LobeHub](https://github.com/lobehub)

<!-- LINK GROUP -->

[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/lint
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/lint?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/lint
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/lint?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
