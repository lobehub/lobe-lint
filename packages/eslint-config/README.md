<a name="readme-top"></a>

<div align="center">

<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-logo/1.0.0/files/assets/logo-3d.webp">
<img height="120" src="https://gw.alipayobjects.com/zos/kitchen/qJ3l3EPsdW/split.svg">
<img height="120" src="https://registry.npmmirror.com/@lobehub/assets-emoji/1.3.0/files/assets/triangular-ruler.webp">

<h1>@lobehub/eslint-config</h1>

ESLint Flat Config configuration for LobeHub projects

[![][npm-release-shield]][npm-release-link]
[![][npm-downloads-shield]][npm-downloads-link]
[![][github-license-shield]][github-license-link]

</div>

## Features

- ESLint 9+ Flat Config
- TypeScript support with type-aware rules
- React / React Native / Next.js / Remix support
- Next.js ESLint rules (`@next/eslint-plugin-next`)
- Import sorting with `simple-import-sort`
- Interface and enum key sorting with `perfectionist`
- Unicorn best practices
- Accessibility rules (jsx-a11y)
- React Compiler support
- Optional MDX support (`eslint-plugin-mdx`)

## Installation

```bash
pnpm add -D @lobehub/eslint-config eslint typescript
```

## Usage

Create `eslint.config.js` (or `eslint.config.mjs`) in your project root:

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig();
```

### With React (Next.js)

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  react: 'next',
  next: true,
});
```

### With React Native

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  react: 'expo',
  reactNative: true,
});
```

### With MDX

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  mdx: true,
});
```

**ESLint 10:** `eslint-plugin-mdx@3.6.2` uses deprecated `context.getFilename()` and breaks. This repo ships a pnpm patch. In your project root, add to `package.json`:

```json
{
  "pnpm": {
    "patchedDependencies": {
      "eslint-plugin-mdx@3.6.2": "patches/eslint-plugin-mdx@3.6.2.patch"
    }
  }
}
```

Then copy [patches/eslint-plugin-mdx@3.6.2.patch](https://github.com/lobehub/lobe-lint/blob/master/patches/eslint-plugin-mdx@3.6.2.patch) into your `patches/` folder and run `pnpm install`. Once [eslint-plugin-mdx](https://github.com/mdx-js/eslint-mdx) releases a version with ESLint 10 support, you can remove the patch.

### With Type-Checked Rules

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  typescript: 'strict',
  typeChecked: true,
});
```

### With Experimental Decorators

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  parserOptions: {
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
  },
});
```

### Full Options

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig({
  // TypeScript support: true | false | 'strict'
  typescript: true,

  // Enable type-aware rules (requires tsconfig)
  typeChecked: false,

  // Custom tsconfig path
  tsconfigPath: './tsconfig.json',

  // React support: true | false | 'next' | 'remix' | 'vite' | 'expo'
  react: false,

  // React Native support
  reactNative: false,

  // React Compiler rules
  reactCompiler: false,

  // Accessibility rules (requires react)
  a11y: false,

  // Import sorting
  sortImports: true,

  // Interface and enum key sorting
  sortKeys: true,

  // Stylistic rules (jsx-sort-props, etc.)
  stylistic: true,

  // Regexp optimization rules
  regexp: true,

  // MDX support (requires eslint-plugin-mdx, eslint-mdx; ESLint 10 needs patch above)
  mdx: false,

  // Additional ignore patterns
  ignores: ['**/dist/**'],
});
```

### Custom Rule Overrides

Use rest parameters to add custom configurations with higher priority:

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig(
  { react: 'next' },
  // Global rule overrides
  {
    rules: {
      'no-console': 'warn',
    },
  },
  // File-specific overrides
  {
    files: ['**/test/**', '**/*.test.ts', '**/*.spec.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/scripts/**'],
    rules: {
      'unicorn/no-process-exit': 'off',
    },
  },
);
```

### Complex Configuration Example

```js
import { defineConfig } from '@lobehub/eslint-config';

export default defineConfig(
  {
    react: 'next',
    typescript: 'strict',
  },
  // Relax rules for test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/test/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  // Relax rules for scripts
  {
    files: ['scripts/**'],
    rules: {
      'no-console': 'off',
      'unicorn/no-process-exit': 'off',
    },
  },
  // Relax rules for config files
  {
    files: ['*.config.ts', '*.config.js'],
    rules: {
      'unicorn/no-anonymous-default-export': 'off',
    },
  },
);
```

## Options Reference

| Option          | Type                                               | Default | Description                           |
| --------------- | -------------------------------------------------- | ------- | ------------------------------------- |
| `typescript`    | `boolean \| 'strict'`                              | `true`  | Enable TypeScript rules               |
| `typeChecked`   | `boolean`                                          | `false` | Enable type-aware rules               |
| `tsconfigPath`  | `string \| string[]`                               | -       | Custom tsconfig path                  |
| `parserOptions` | `ParserOptions`                                    | -       | TypeScript parser options             |
| `react`         | `boolean \| 'next' \| 'remix' \| 'vite' \| 'expo'` | `false` | Enable React rules                    |
| `reactNative`   | `boolean`                                          | `false` | Enable React Native rules             |
| `reactCompiler` | `boolean`                                          | `false` | Enable React Compiler rules           |
| `next`          | `boolean`                                          | `false` | Enable Next.js ESLint rules           |
| `mdx`           | `boolean`                                          | `false` | Enable MDX rules (see ESLint 10 note) |
| `a11y`          | `boolean`                                          | `false` | Enable accessibility rules            |
| `sortImports`   | `boolean`                                          | `true`  | Enable import sorting                 |
| `sortKeys`      | `boolean`                                          | `true`  | Enable interface/enum/jsx sorting     |
| `stylistic`     | `boolean`                                          | `true`  | Enable stylistic rules                |
| `regexp`        | `boolean`                                          | `true`  | Enable regexp rules                   |
| `ignores`       | `string[]`                                         | `[]`    | Additional ignore patterns            |

## API

```ts
function defineConfig(options?: Options, ...configs: FlatConfig[]): FlatConfigArray;
```

- `options` - Configuration options (see table above)
- `...configs` - Additional flat configs to append (highest priority)

## Requirements

- Node.js >= 18
- ESLint >= 9.0.0
- TypeScript >= 5.0.0 (optional)

## License

MIT © [LobeHub](https://github.com/lobehub)

<!-- LINK GROUP -->

[github-license-link]: https://github.com/lobehub/lobe-lint/blob/master/LICENSE
[github-license-shield]: https://img.shields.io/github/license/lobehub/lobe-lint?color=white&labelColor=black&style=flat-square
[npm-downloads-link]: https://www.npmjs.com/package/@lobehub/eslint-config
[npm-downloads-shield]: https://img.shields.io/npm/dt/@lobehub/eslint-config?labelColor=black&style=flat-square
[npm-release-link]: https://www.npmjs.com/package/@lobehub/eslint-config
[npm-release-shield]: https://img.shields.io/npm/v/@lobehub/eslint-config?color=369eff&labelColor=black&logo=npm&logoColor=white&style=flat-square
