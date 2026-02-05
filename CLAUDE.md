# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lobe Lint is a monorepo providing lint configurations for LobeHub projects:

- **@lobehub/eslint-config** - ESLint 9 Flat Config
- **@lobehub/prettier-config** - Prettier config
- **@lobehub/stylelint-config** - Stylelint config
- **@lobehub/commitlint-config** - Commitlint config (gitmoji style)
- **@lobehub/remarklint-config** - Remark/Markdown lint config
- **@lobehub/semantic-release-config** - Semantic release config
- **@lobehub/lint** - Meta package re-exporting all configs

## Commands

```bash
pnpm install    # Install dependencies
pnpm build      # Build all packages
pnpm dev        # Watch mode for all packages
pnpm lint       # Run ESLint on all packages
pnpm test       # Run tests (vitest)
pnpm type-check # TypeScript type checking
```

Build tool: tsdown (rolldown-based, tsup successor)

## Architecture

### ESLint Config (`packages/eslint-config`)

The main entry `defineConfig(options)` composes configs from `src/configs/`:

- `javascript.ts` - Base JS rules
- `typescript.ts` - TypeScript-eslint rules
- `react.ts` - React/hooks rules (supports next/remix/vite/expo)
- `react-native.ts` - React Native specific rules
- `next.ts` - Next.js specific rules
- `imports.ts` - Import sorting (simple-import-sort)
- `sorting.ts` - Object/interface key sorting (perfectionist)
- `stylistic.ts` - Code style rules (@stylistic/eslint-plugin)
- `a11y.ts` - Accessibility rules (jsx-a11y)
- `unicorn.ts` - Modern JS best practices
- `regexp.ts` - RegExp optimization
- `unused.ts` - Unused imports removal
- `ignores.ts` - Global ignore patterns

Config options are defined in `src/types.ts`. Each config module returns `FlatConfigArray` and checks its enable flag.

### Meta Package (`packages/lint`)

Re-exports all configs for convenient single-package installation:

```ts
import {
  eslint,
  prettier,
  stylelint,
  commitlint,
  remarklint,
  semanticRelease,
} from '@lobehub/lint';
```

## Key Conventions

- ESM only (no CommonJS)
- Node.js 18+ required
- All packages share root `tsdown.config.ts`
- Uses gitmoji commit style (`:sparkles:`, `:bug:`, etc.)
