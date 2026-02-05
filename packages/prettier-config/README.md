<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/triangular-ruler.webp">

<h1>@lobehub/prettier-config</h1>

Prettier configuration for LobeHub projects

[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-license-shield]][github-license-link]

</div>

## Features

- Sensible defaults for modern JavaScript/TypeScript projects
- Shell script formatting (`prettier-plugin-sh`)
- Package.json sorting (`prettier-plugin-packagejson`)
- JSON sorting (`prettier-plugin-sort-json`)

## Installation

```bash
pnpm add -D @lobehub/prettier-config prettier
```

## Usage

Create `prettier.config.js` (or `prettier.config.mjs`) in your project root:

```js
import config from '@lobehub/prettier-config';

export default config;
```

Or add to your `package.json`:

```json
{
  "prettier": "@lobehub/prettier-config"
}
```

## Configuration

The config includes:

```js
{
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  printWidth: 100,
  proseWrap: 'never',
  quoteProps: 'consistent',
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  plugins: [
    'prettier-plugin-sh',
    'prettier-plugin-packagejson',
    'prettier-plugin-sort-json',
  ],
}
```

### Extending the Config

```js
import config from '@lobehub/prettier-config';

export default {
  ...config,
  printWidth: 120,
};
```

## Requirements

- Node.js >= 18
- Prettier >= 3.0.0

## License

MIT © [LobeHub](https://github.com/lobehub)

<!-- LINK GROUP -->

[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/prettier-config
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/prettier-config?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/prettier-config
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/prettier-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
