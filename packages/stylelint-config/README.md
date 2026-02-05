<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/triangular-ruler.webp">

<h1>@lobehub/stylelint-config</h1>

Stylelint configuration for LobeHub projects

[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-license-shield]][github-license-link]

</div>

## Features

- Standard stylelint rules
- Property ordering with `stylelint-config-clean-order`
- Less support
- CSS-in-JS support (styled-components, emotion, etc.)
- Logical properties enforcement

## Installation

```bash
pnpm add -D @lobehub/stylelint-config stylelint
```

## Usage

Create `stylelint.config.js` (or `.stylelintrc.js`) in your project root:

```js
import config from '@lobehub/stylelint-config';

export default config;
```

Or for CommonJS:

```js
module.exports = require('@lobehub/stylelint-config').default;
```

## Supported File Types

- `.css` - Standard CSS files
- `.less` - Less preprocessor files
- `.js`, `.jsx`, `.ts`, `.tsx` - CSS-in-JS (styled-components, emotion)

## Configuration

The config extends:

- `stylelint-config-standard`
- `stylelint-config-recommended`
- `stylelint-config-clean-order`

And includes:

- `stylelint-less` for Less support
- `postcss-styled-syntax` for CSS-in-JS
- `stylelint-use-logical-spec` for logical properties

### Extending the Config

```js
import config from '@lobehub/stylelint-config';

export default {
  ...config,
  rules: {
    ...config.rules,
    'color-hex-length': 'long',
  },
};
```

## Requirements

- Node.js >= 18
- Stylelint >= 16.0.0

## License

MIT © [LobeHub](https://github.com/lobehub)

<!-- LINK GROUP -->

[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/stylelint-config
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/stylelint-config?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/stylelint-config
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/stylelint-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
