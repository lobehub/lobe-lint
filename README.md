<a name="readme-top"></a>

<div align="center">

<img width="160" src="https://raw.githubusercontent.com/lobehub/.github/main/profile/Logo.webp">

<h1>Lobe Lint</h1>

ESlint config, Prettier config, Remark config for LobeHub

[Changelog](./CHANGELOG.md) · [Report Bug][issues-url] · [Request Feature][issues-url]

<!-- SHIELD GROUP -->

[![release][release-shield]][release-url]
[![releaseDate][release-date-shield]][release-date-url]
[![ciTest][ci-test-shield]][ci-test-url]
[![ciRelease][ci-release-shield]][ci-release-url] <br/>
[![contributors][contributors-shield]][contributors-url]
[![forks][forks-shield]][forks-url]
[![stargazers][stargazers-shield]][stargazers-url]
[![issues][issues-shield]][issues-url]

</div>

![](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [📦 Installation](#-installation)

- [🤯 Usage](#-usage)

  - [.npmrc](#npmrc)
  - [ESlint](#eslint)
  - [Stylelint](#stylelint)
  - [Commitlint](#commitlint)
  - [Changelog](#changelog)
  - [Remark](#remark)
  - [Prettier](#prettier)
  - [Semantic Release](#semantic-release)

- [⌨️ Local Development](#️-local-development)

- [🤝 Contributing](#-contributing)

####

</details>

## 📦 Installation

To install Lobe Lint, run the following command:

```bash
pnpm add @lobehub/lint -D
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤯 Usage

### .npmrc

```text
public-hoist-pattern[]=*@umijs/lint*
public-hoist-pattern[]=*remark*
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*stylelint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=*commitlint*
public-hoist-pattern[]=*postcss*
public-hoist-pattern[]=*semantic-release*
```

### ESlint

config can be found at `./src/eslint/index.ts`

```js
// .eslintrc.js

module.exports = require('@lobehub/lint/dist/eslint');
```

### Stylelint

config can be found at `./src/stylelint/index.ts`

```js
// .stylelintrc.js

module.exports = require('@lobehub/lint/dist/stylelint');
```

### Commitlint

config can be found at `./src/commitlint/index.ts`

```js
// .commitlintrc.js

module.exports = require('@lobehub/lint/dist/commitlint');
```

### Changelog

config can be found at `./src/changelog/index.ts`

```js
// .changelogrc.js

module.exports = require('@lobehub/lint/dist/commitlint');
```

### Remark

config can be found at `./src/remarklint/index.ts`

```js
// .remarkrc.js

module.exports = require('@lobehub/lint/dist/remarklint');
```

### Prettier

config can be found at `./src/prettier/index.ts`

```js
// .prettierrc.js

module.exports = require('@lobehub/lint/dist/prettier');
```

### Semantic Release

config can be found at `./src/semantic-release/index.ts`

```js
// .releaserc.js

module.exports = require('@lobehub/lint/dist/semantic-release');
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## ⌨️ Local Development

You can use Gitpod for online development:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)][gitpod-url]

Or clone it for local development:

```bash
$ git clone https://github.com/lobehub/lobe-lint.git
$ cd lobehub/lint
$ npm install
$ npm start
```

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤝 Contributing

<!-- CONTRIBUTION GROUP -->

> 📊 Total: <kbd>**1**</kbd>

<a href="https://github.com/canisminor1990" title="canisminor1990">
  <img src="https://avatars.githubusercontent.com/u/17870709?v=4" width="50" />
</a>

<!-- CONTRIBUTION END -->

<div align="right">

[![][back-to-top]](#readme-top)

</div>

---

#### 📝 License

Copyright © 2023 [CanisMinor][profile-url]. <br />
This project is [MIT](./LICENSE) licensed.

<!-- LINK GROUP -->

[profile-url]: https://github.com/canisminor1990
[gitpod-url]: https://gitpod.io/#https://github.com/lobehub/lobe-lint

<!-- SHIELD LINK GROUP -->

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square

<!-- release -->

[release-shield]: https://img.shields.io/npm/v/@lobehub/lint?label=%F0%9F%A4%AF%20NPM
[release-url]: https://www.npmjs.com/package/@lobehub/lint

<!-- releaseDate -->

[release-date-shield]: https://img.shields.io/github/release-date/lobehub/lobe-lint?style=flat
[release-date-url]: https://github.com/lobehub/lobe-lint/releases

<!-- ciTest -->

[ci-test-shield]: https://github.com/lobehub/lobe-lint/workflows/Test%20CI/badge.svg
[ci-test-url]: https://github.com/lobehub/lobe-lint/actions/workflows/test.yml

<!-- ciRelease -->

[ci-release-shield]: https://github.com/lobehub/lobe-lint/workflows/Build%20and%20Release/badge.svg
[ci-release-url]: https://github.com/lobehub/lobe-lint/actions/workflows/release.yml

<!-- contributors -->

[contributors-shield]: https://img.shields.io/github/contributors/lobehub/lobe-lint.svg?style=flat
[contributors-url]: https://github.com/lobehub/lobe-lint/graphs/contributors

<!-- forks -->

[forks-shield]: https://img.shields.io/github/forks/lobehub/lobe-lint.svg?style=flat
[forks-url]: https://github.com/lobehub/lobe-lint/network/members

<!-- stargazers -->

[stargazers-shield]: https://img.shields.io/github/stars/lobehub/lobe-lint.svg?style=flat
[stargazers-url]: https://github.com/lobehub/lobe-lint/stargazers

<!-- issues -->

[issues-shield]: https://img.shields.io/github/issues/lobehub/lobe-lint.svg?style=flat
[issues-url]: https://github.com/lobehub/lobe-lint/issues/new/choose
