<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-logo/assets/logo-3d.webp">
<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-logo/assets/split.svg">
<img height="120" src="https://raw.githubusercontent.com/lobehub/lobe-assets/master/packages/assets-emoji/assets/hammer-and-wrench.webp">

<h1>create-lobe-lint</h1>

CLI tool to setup LobeHub lint configurations

[Changelog](./CHANGELOG.md) · \[Report Bug]\[issues-link] · \[Request Feature]\[issues-link]

</div>

![](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<details>
<summary><kbd>Table of contents</kbd></summary>

#### TOC

- [Features](#features)
- [Usage](#usage)
- [Options](#options)
- [Examples](#examples)
- [Generated Files](#generated-files)
- [Requirements](#requirements)

####

</details>

## Features

- **Auto Detection** - Detects package manager, TypeScript, and React framework
- **Interactive Mode** - Guided setup with preset and manual options
- **Framework Support** - Next.js, Remix, Vite, Expo support
- **Flexible** - Generate configs for ESLint, Prettier, Stylelint, Commitlint, Remarklint, Semantic Release
- **Extras** - Optional ignore files, lint-staged with simple-git-hooks, and VSCode settings

## Usage

Run the CLI with npx:

```bash
npx create-lobe-lint
```

This will start an interactive setup process that:

1. Detects your project configuration
2. Asks which tools you want to configure
3. Offers ignore files, git hooks and VSCode settings
4. Generates the appropriate config files
5. Installs the required dependencies

## Options

| Option                | Alias | Description                                                             |
| --------------------- | ----- | ----------------------------------------------------------------------- |
| `--preset`            | `-p`  | Quick setup with preset tools (ESLint, Prettier, Stylelint, Commitlint) |
| `--manual`            | `-m`  | Manually select tools to configure                                      |
| `--eslint`            |       | Include ESLint configuration                                            |
| `--prettier`          |       | Include Prettier configuration                                          |
| `--stylelint`         |       | Include Stylelint configuration                                         |
| `--commitlint`        |       | Include Commitlint configuration                                        |
| `--remarklint`        |       | Include Remarklint configuration                                        |
| `--semantic-release`  |       | Include Semantic Release configuration                                  |
| `--react <framework>` |       | Set React framework (next/remix/vite/expo/true/false)                   |
| `--ignore-files`      |       | Generate ignore files (.prettierignore, .stylelintignore, etc.)         |
| `--no-ignore-files`   |       | Skip ignore files generation                                            |
| `--git-hooks`         |       | Configure lint-staged and simple-git-hooks                              |
| `--no-git-hooks`      |       | Skip git hooks configuration                                            |
| `--vscode`            |       | Generate VSCode settings to suppress disruptive ESLint auto-fix         |
| `--no-vscode`         |       | Skip VSCode settings generation                                         |
| `--install`           |       | Auto-install dependencies (default)                                     |
| `--no-install`        |       | Skip dependency installation                                            |
| `--yes`               | `-y`  | Skip confirmations                                                      |
| `--help`              | `-h`  | Show help                                                               |

## Examples

```bash
# Interactive mode
npx create-lobe-lint

# Quick setup with defaults
npx create-lobe-lint --preset -y

# Select specific tools
npx create-lobe-lint --eslint --prettier --react next

# Manual selection mode
npx create-lobe-lint --manual

# Skip dependency installation
npx create-lobe-lint --preset -y --no-install
```

## Generated Files

| Tool             | Config File             |
| ---------------- | ----------------------- |
| ESLint           | `eslint.config.mjs`     |
| Prettier         | `prettier.config.mjs`   |
| Stylelint        | `stylelint.config.mjs`  |
| Commitlint       | `commitlint.config.mjs` |
| Remarklint       | `.remarkrc.mjs`         |
| Semantic Release | `release.config.mjs`    |

Depending on your choices, it also writes ignore files (`.prettierignore`, `.stylelintignore`, `.remarkignore`), adds `lint-staged` and `simple-git-hooks` to `package.json`, and creates `.vscode/settings.json`.

## Requirements

- Node.js >= 20

---

#### 📝 License

Copyright © 2026 [LobeHub](https://github.com/lobehub). <br />
This project is MIT licensed.
