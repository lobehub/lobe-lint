import { defineConfig } from 'eslint/config';

import { GLOB_CJS, GLOB_CJS_CONFIG_FILES } from '../globs';

/**
 * CommonJS files may `require()`: `.releaserc.cjs` / `.changelogrc.cjs` must stay CommonJS because
 * semantic-release (cosmiconfig < 8.2) and conventional-changelog (cosmiconfig 7) never read `.mjs`.
 * typescript-eslint's recommended config enables `no-require-imports` for every file, so these
 * files failed `eslint --fix` in lint-staged.
 */
export function commonjs() {
  return defineConfig([
    {
      files: GLOB_CJS,
      languageOptions: {
        parserOptions: { sourceType: 'commonjs' },
        sourceType: 'commonjs',
      },
    },
    {
      files: [...GLOB_CJS, ...GLOB_CJS_CONFIG_FILES],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        // deprecated predecessor of no-require-imports; off in case a user config enables it
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ]);
}
