<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/triangular-ruler.webp">

<h1>@lobehub/commitlint-config</h1>

Commitlint configuration for LobeHub projects

[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-license-shield]][github-license-link]

</div>

## Features

- Gitmoji commit convention
- Enforces consistent commit message format
- Compatible with semantic-release

## Installation

```bash
pnpm add -D @lobehub/commitlint-config @commitlint/cli
```

## Usage

Create `commitlint.config.js` (or `.commitlintrc.js`) in your project root:

```js
import config from '@lobehub/commitlint-config';

export default config;
```

Or for CommonJS:

```js
module.exports = require('@lobehub/commitlint-config').default;
```

## Commit Format

```
:emoji: type(scope): subject

body

footer
```

### Examples

```
:sparkles: feat(auth): add OAuth2 support

Implement OAuth2 authentication flow with Google and GitHub providers.

Closes #123
```

```
:bug: fix(api): resolve race condition in data fetching
```

```
:memo: docs: update installation guide
```

## Setting Up Git Hooks

With Husky:

```bash
pnpm add -D husky
pnpm husky init
echo "pnpm commitlint --edit \$1" > .husky/commit-msg
```

## Requirements

- Node.js >= 18
- @commitlint/cli >= 19.0.0

## License

MIT © [LobeHub](https://github.com/lobehub)

<!-- LINK GROUP -->

[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/commitlint-config
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/commitlint-config?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/commitlint-config
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/commitlint-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
