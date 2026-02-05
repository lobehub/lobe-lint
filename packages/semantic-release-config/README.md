<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/triangular-ruler.webp">

<h1>@lobehub/semantic-release-config</h1>

Semantic release configuration for LobeHub projects

[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-license-shield]][github-license-link]

</div>

## Features

- Gitmoji commit convention
- Automated versioning and changelog
- GitHub releases
- NPM publishing
- Monorepo support

## Installation

```bash
pnpm add -D @lobehub/semantic-release-config semantic-release
```

## Usage

### Standard Project

Create `.releaserc.js` in your project root:

```js
import config from '@lobehub/semantic-release-config';

export default config;
```

### Monorepo

```js
import config from '@lobehub/semantic-release-config/monorepo';

export default config;
```

### Changelog Only

For generating changelog without releasing:

```js
import config from '@lobehub/semantic-release-config/changelog';

export default config;
```

## Exports

| Export                                       | Description               |
| -------------------------------------------- | ------------------------- |
| `@lobehub/semantic-release-config`           | Standard release config   |
| `@lobehub/semantic-release-config/monorepo`  | Monorepo release config   |
| `@lobehub/semantic-release-config/changelog` | Changelog generation only |

## GitHub Actions

```yaml
name: Release

on:
  push:
    branches: [master, main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: pnpm/action-setup@v2

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm build

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: pnpm semantic-release
```

## Extending

```js
import config, { options } from '@lobehub/semantic-release-config';

export default {
  ...config,
  branches: ['main', 'next'],
};
```

## Requirements

- Node.js >= 18
- semantic-release >= 21.0.0

## License

MIT © [LobeHub](https://github.com/lobehub)

<!-- LINK GROUP -->

[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/semantic-release-config
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/semantic-release-config?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/semantic-release-config
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/semantic-release-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
