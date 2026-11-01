import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { defineConfig } from '../dist/index.mjs';
import { lint, PACKAGE_ROOT, pluginErrors } from './utils';

const RESTRICTED = ['error', { paths: [{ message: 'Load it lazily.', name: 'heavy-lib' }] }];

const lintSources = (config: ReturnType<typeof defineConfig>, sources: Record<string, string>) =>
  lint(config, Object.keys(sources), { sources }).diagnostics;

describe('bundled eslint-core plugin', () => {
  it('reports static imports but keeps import() as a lazy-loading seam', () => {
    const config = defineConfig(
      { sortImports: false },
      {
        files: ['**/*.ts'],
        jsPlugins: ['eslint-core'],
        rules: { 'eslint-core/no-restricted-imports': RESTRICTED },
      },
    );
    const diagnostics = lintSources(config, {
      'src/dynamic.ts': "export const load = () => import('heavy-lib');\n",
      'src/static.ts': "import heavy from 'heavy-lib';\n\nexport const value = heavy;\n",
    });
    const restricted = diagnostics.filter((d) => d.code === 'eslint-core(no-restricted-imports)');

    expect(pluginErrors(diagnostics)).toEqual([]);
    expect(restricted.map((d) => d.filename)).toEqual(['src/static.ts']);
  });

  it('runs no-restricted-syntax with esquery selectors', () => {
    const config = defineConfig(
      {},
      {
        files: ['**/*.ts'],
        jsPlugins: ['eslint-core'],
        rules: {
          'eslint-core/no-restricted-syntax': [
            'error',
            {
              message: 'No uppercase labels.',
              selector: "Property[key.name='textTransform'][value.value='uppercase']",
            },
          ],
        },
      },
    );
    const diagnostics = lintSources(config, {
      'src/style.ts': "export const style = { textTransform: 'uppercase' };\n",
    });

    expect(diagnostics.map((d) => d.message)).toContain('No uppercase labels.');
  });

  it('lets a local plugin re-export a bundled rule under its own name', () => {
    const corePlugin = path.join(PACKAGE_ROOT, 'dist/plugins/eslint-core.mjs');
    const config = defineConfig(
      { sortImports: false },
      {
        files: ['**/*.ts'],
        jsPlugins: ['eslint-core', { name: 'guard', specifier: './fixtures/guard.mjs' }],
        rules: {
          'eslint-core/no-restricted-imports': RESTRICTED,
          'guard/no-legacy': [
            'error',
            { paths: [{ message: 'Use the new API.', name: 'legacy-lib' }] },
          ],
        },
      },
    );
    const diagnostics = lintSources(config, {
      'guard.mjs': `import core from ${JSON.stringify(corePlugin)};\nexport default { meta: { name: 'guard' }, rules: { 'no-legacy': core.rules['no-restricted-imports'] } };\n`,
      'src/both.ts':
        "import heavy from 'heavy-lib';\nimport legacy from 'legacy-lib';\n\nexport const value = [heavy, legacy];\n",
    });

    expect(pluginErrors(diagnostics)).toEqual([]);
    expect(diagnostics.map((d) => d.code)).toEqual(
      expect.arrayContaining(['eslint-core(no-restricted-imports)', 'guard(no-legacy)']),
    );
  });
});
