<a name="readme-top"></a>

<div align="center">

![](https://github.com/user-attachments/assets/c4d1392d-835e-4d5f-821d-9e7c86e4f0f2)

<h1>Lobe Lint</h1>

<h3>Lint, Format and Commit the LobeHub Way</h3>

Shared ESLint, Prettier, Stylelint, Commitlint, Remarklint and semantic-release configs from LobeHub, plus the `create-lobe-lint` CLI that sets them up. Use them in LobeHub projects or in any JavaScript and TypeScript project that wants the same conventions.

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

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [Why Lobe Lint?](#why-lobe-lint)
- [Getting Started](#getting-started)
  - [Manual Setup](#manual-setup)
- [🤖 AI-Powered Development](#-ai-powered-development)
- [Packages](#packages)
- [Local Development](#local-development)
- [Contributing](#contributing)
- [🔗 Links](#-links)

####

</details>

## Why Lobe Lint?

Lobe Lint is the code style toolkit behind every LobeHub project: one set of ESLint, Prettier, Stylelint, Commitlint, Remarklint and Semantic Release configs you can add to any project in a minute.

- **One command setup** - Add linting, formatting and commit checks with `npx create-lobe-lint`
- **Works with your stack** - JavaScript, TypeScript, React, Next.js, Remix, Vite and Expo / React Native
- **All or just what you need** - Get every config from `@lobehub/lint`, or install only the ones you use
- **Sensible defaults, easy overrides** - Start from LobeHub's conventions and add your own rules on top
- **Clean history** - Gitmoji commit checks, plus automated versions and changelogs
- **Agent-friendly** - Non-interactive setup a coding agent can run in one step

## Getting Started

Run the setup CLI in your project root:

```bash
npx create-lobe-lint
```

It detects your package manager, TypeScript and React framework, asks which tools you want, writes the config files and installs the dependencies. Use `npx create-lobe-lint --preset -y` to accept the recommended setup without prompts. See [create-lobe-lint](./packages/create-lint) for all options.

### Manual Setup

Prefer to wire things up yourself? Install a config with its tool:

[![][bun-shield]][bun-link]

```bash
bun add -D @lobehub/eslint-config eslint typescript@^6
bun add -D @lobehub/prettier-config prettier
```

Then create `eslint.config.mjs`:

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  react: true, // or 'next' / 'remix' / 'vite' / 'expo'
});
```

And `prettier.config.mjs`:

```js
export { default } from '@lobehub/prettier-config';
```

The other tools follow the same pattern. See each package's README in [Packages](#packages) for options and examples.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## 🤖 AI-Powered Development

Hand the setup to your coding agent. Copy this prompt:

```text
Set up LobeHub lint in this project: run `npx create-lobe-lint --preset -y`, then run ESLint and Prettier on the codebase and fix the reported problems until both pass.
```

| Resource                                                                   | What it gives your agent                                                                     |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [create-lobe-lint](./packages/create-lint)                                 | Non-interactive setup with `--preset -y`; add `--no-install` to skip installing dependencies |
| [@lobehub/eslint-config](./packages/eslint-config)                         | Every `defineConfig()` option, with override examples                                        |
| [AGENTS.md](./AGENTS.md)                                                   | Commands, architecture and conventions for agents working on this repository                 |
| [lobe-lint-v2-migration](./.agents/skills/lobe-lint-v2-migration/SKILL.md) | Read before upgrading a repo from v1 to v2: steps and a config migration codemod             |

Each tool reads one config file (`eslint.config.mjs`, `prettier.config.mjs`, `stylelint.config.mjs`, `commitlint.config.mjs`, `.remarkrc.mjs`, `release.config.mjs`) that re-exports the matching `@lobehub/*-config` package.

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## Packages

| Package                                                                | What it's for                                           |
| ---------------------------------------------------------------------- | ------------------------------------------------------- |
| [@lobehub/eslint-config](./packages/eslint-config)                     | ESLint flat config for JavaScript, TypeScript and React |
| [@lobehub/prettier-config](./packages/prettier-config)                 | Code formatting                                         |
| [@lobehub/stylelint-config](./packages/stylelint-config)               | CSS, Less and CSS-in-JS styles                          |
| [@lobehub/commitlint-config](./packages/commitlint-config)             | Gitmoji commit messages                                 |
| [@lobehub/remarklint-config](./packages/remarklint-config)             | Markdown linting                                        |
| [@lobehub/semantic-release-config](./packages/semantic-release-config) | Automated versions and changelogs                       |
| [@lobehub/lint](./packages/lint)                                       | All configs in one package                              |
| [create-lobe-lint](./packages/create-lint)                             | One-command setup CLI                                   |

<div align="right">

[![][back-to-top]](#readme-top)

</div>

## Local Development

You can use Github Codespaces for online development:

[![][codespaces-shield]][codespaces-link]

Or clone it for local development (requires Node.js 22+ and pnpm):

```bash
git clone https://github.com/lobehub/lobe-lint.git
cd lobe-lint
pnpm install
pnpm build
pnpm test
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

## 🔗 Links

- [🍭 Lobe UI](https://github.com/lobehub/lobe-ui) - React component library for AI apps
- [🥨 Lobe Icons](https://github.com/lobehub/lobe-icons) - AI / LLM brand logos and icons
- [📊 Lobe Charts](https://github.com/lobehub/lobe-charts) - React chart component library
- [✒️ Lobe Editor](https://github.com/lobehub/lobe-editor) - Lexical-based rich text editor for React, with Markdown, plugins and a chat composer
- [🎤 Lobe TTS](https://github.com/lobehub/lobe-tts) - TTS / STT speech library
- [📐 Lobe Lint](https://github.com/lobehub/lobe-lint) - ESLint, Prettier, Stylelint, Commitlint and more lint configs
- [😀 Fluent Emoji](https://github.com/lobehub/fluent-emoji) - Fluent Emoji asset library

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
[contributors-contrib]: https://contrib.rocks/image?repo=lobehub/lobe-lint
[contributors-url]: https://github.com/lobehub/lobe-lint/graphs/contributors
[discord-link]: https://discord.gg/AYFPHvv2jT
[discord-shield]: https://img.shields.io/discord/1127171173982154893?color=5865F2&label=discord&labelColor=black&logo=discord&logoColor=white&style=flat-square
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
[profile-link]: https://github.com/lobehub
