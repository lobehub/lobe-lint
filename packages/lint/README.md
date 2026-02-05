<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/triangular-ruler.webp">

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
// eslint.config.js
import { defineConfig } from '@lobehub/lint';

export default defineConfig({
  react: 'next',
});
```

### Prettier

```js
// prettier.config.js
import { prettier } from '@lobehub/lint';

export default prettier;
```

### Stylelint

```js
// stylelint.config.js
import { stylelint } from '@lobehub/lint';

export default stylelint;
```

### Commitlint

```js
// commitlint.config.js
import { commitlint } from '@lobehub/lint';

export default commitlint;
```

### Remarklint

```js
// .remarkrc.js
import { remarklint } from '@lobehub/lint';

export default remarklint;
```

### Semantic Release

```js
// .releaserc.js
import { semanticRelease } from '@lobehub/lint';

export default semanticRelease;
```

For monorepo:

```js
import { semanticReleaseMonoRepo } from '@lobehub/lint';

export default semanticReleaseMonoRepo;
```

For changelog only:

```js
import { changelog } from '@lobehub/lint';

export default changelog;
```

## Exports

| Export                    | Type     | Description                      |
| ------------------------- | -------- | -------------------------------- |
| `defineConfig` / `eslint` | Function | ESLint config factory            |
| `defineEslintConfig`      | Function | Alias for defineConfig           |
| `prettier`                | Object   | Prettier config                  |
| `stylelint`               | Object   | Stylelint config                 |
| `commitlint`              | Object   | Commitlint config                |
| `remarklint`              | Object   | Remarklint config                |
| `semanticRelease`         | Object   | Semantic release config          |
| `semanticReleaseMonoRepo` | Object   | Monorepo semantic release config |
| `changelog`               | Object   | Changelog-only config            |

## Individual Packages

If you only need specific configurations, you can install them individually:

- `@lobehub/eslint-config` - ESLint configuration
- `@lobehub/prettier-config` - Prettier configuration
- `@lobehub/stylelint-config` - Stylelint configuration
- `@lobehub/commitlint-config` - Commitlint configuration
- `@lobehub/remarklint-config` - Remarklint configuration
- `@lobehub/semantic-release-config` - Semantic release configuration

## Requirements

- Node.js >= 18

## License

MIT © [LobeHub](https://github.com/lobehub)

<!-- LINK GROUP -->

[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/lint
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/lint?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/lint
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/lint?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
