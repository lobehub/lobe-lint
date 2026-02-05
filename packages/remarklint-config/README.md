<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/triangular-ruler.webp">

<h1>@lobehub/remarklint-config</h1>

Remarklint configuration for LobeHub projects

[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-license-shield]][github-license-link]

</div>

## Features

- Markdown style guide enforcement
- GFM (GitHub Flavored Markdown) support
- Frontmatter support
- TOC (Table of Contents) generation
- CJK text formatting with pangu
- Write-good writing style suggestions
- Unused definition cleanup

## Installation

```bash
pnpm add -D @lobehub/remarklint-config remark-cli
```

## Usage

Create `.remarkrc.js` in your project root:

```js
import config from '@lobehub/remarklint-config';

export default config;
```

Or for CommonJS:

```js
module.exports = require('@lobehub/remarklint-config').default;
```

### Run

```bash
# Check
pnpm remark . --quiet

# Fix
pnpm remark . --output
```

### NPM Scripts

```json
{
  "scripts": {
    "lint:md": "remark . --quiet",
    "lint:md:fix": "remark . --output"
  }
}
```

## Included Plugins

### Presets

- `remark-preset-lint-consistent` - Consistent style
- `remark-preset-lint-recommended` - Recommended rules
- `remark-preset-lint-markdown-style-guide` - Style guide

### Features

- `remark-gfm` - GitHub Flavored Markdown
- `remark-frontmatter` - YAML frontmatter
- `remark-toc` - Table of Contents
- `remark-pangu` - CJK text spacing

### Linting

- `remark-lint-*` - Various lint rules
- `remark-lint-write-good` - Writing style suggestions

### Transformers

- `remark-remove-unused-definitions` - Cleanup
- `remark-sort-definitions` - Sort definitions

## Requirements

- Node.js >= 18
- remark >= 15.0.0
- remark-cli >= 12.0.0

## License

MIT © [LobeHub](https://github.com/lobehub)

<!-- LINK GROUP -->

[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/remarklint-config
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/remarklint-config?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/remarklint-config
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/remarklint-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
