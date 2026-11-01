import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { PLUGIN_NAMES } from '../src/plugin-names';
import { type PluginKey } from '../src/types';
import { lint, PACKAGE_ROOT, pluginErrors } from './utils';

const PLUGIN_DIR = path.join(PACKAGE_ROOT, 'dist/plugins');
const KEYS = Object.keys(PLUGIN_NAMES) as PluginKey[];

const TYPE_AWARE_RULES = new Set(
  [
    'no-implicit-children',
    'no-implicit-key',
    'no-implicit-ref',
    'no-leaked-conditional-rendering',
    'no-unused-props',
  ].flatMap((rule) => [`@eslint-react/${rule}`, `@eslint-react/x-${rule}`]),
);

const loadRules = async (key: PluginKey) => {
  const plugin = (await import(path.join(PLUGIN_DIR, `${key}.mjs`))).default as {
    rules: Record<string, unknown>;
  };
  return Object.keys(plugin.rules).map((rule) => `${PLUGIN_NAMES[key]}/${rule}`);
};

describe('bundled plugins', () => {
  it.each(KEYS)('%s does not bundle the TypeScript compiler', (key) => {
    const source = fs.readFileSync(path.join(PLUGIN_DIR, `${key}.mjs`), 'utf8');
    expect(source).not.toMatch(/typescript\/lib\/(typescript|tsserverlibrary)\.js/);
  });

  it('runs every rule without typescript or eslint installed', async () => {
    const rules = (await Promise.all(KEYS.map(loadRules)))
      .flat()
      .filter((rule) => !TYPE_AWARE_RULES.has(rule));
    expect(rules.length).toBeGreaterThan(150);

    const { diagnostics, files } = lint(
      {
        categories: { correctness: 'off' },
        jsPlugins: KEYS.map((key) => ({
          name: PLUGIN_NAMES[key],
          specifier: path.join(PLUGIN_DIR, `${key}.mjs`),
        })),
        rules: Object.fromEntries(rules.map((rule) => [rule, 'warn'])),
      },
      ['.'],
    );

    expect(files).toBeGreaterThan(40);
    expect(pluginErrors(diagnostics)).toEqual([]);
  });

  it('ships a third-party license notice', () => {
    const notice = fs.readFileSync(path.join(PACKAGE_ROOT, 'dist/THIRD_PARTY_LICENSES.md'), 'utf8');
    for (const name of [
      '@eslint-react/eslint-plugin',
      'eslint-plugin-perfectionist',
      'eslint-plugin-react',
    ]) {
      expect(notice).toContain(`## ${name}@`);
    }
  });
});
