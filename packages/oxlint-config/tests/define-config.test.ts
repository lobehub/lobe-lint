import fs from 'node:fs';

import { describe, expect, it } from 'vitest';

import { defineConfig } from '../dist/index.mjs';
import pkg from '../package.json';

const ruleNames = (config: ReturnType<typeof defineConfig>) =>
  new Set((config.overrides ?? []).flatMap((override) => Object.keys(override.rules ?? {})));

const jsPluginNames = (config: ReturnType<typeof defineConfig>) =>
  new Set(
    (config.overrides ?? []).flatMap((override) =>
      (override.jsPlugins ?? []).map((entry) => (typeof entry === 'string' ? entry : entry.name)),
    ),
  );

describe('defineConfig', () => {
  it('enables TypeScript, import sorting and key sorting by default', () => {
    const config = defineConfig();
    const rules = ruleNames(config);

    expect(rules).toContain('typescript/consistent-type-imports');
    expect(rules).toContain('simple-import-sort/imports');
    expect(rules).toContain('perfectionist/sort-interfaces');
    expect(jsPluginNames(config)).not.toContain('@eslint-react');
    expect(config.options).toEqual({ reportUnusedDisableDirectives: 'warn' });
  });

  it('turns off TypeScript, import sorting and key sorting on request', () => {
    const rules = ruleNames(
      defineConfig({ sortImports: false, sortKeys: false, typescript: false }),
    );

    expect(rules).not.toContain('typescript/consistent-type-imports');
    expect(rules).not.toContain('simple-import-sort/imports');
    expect(rules).not.toContain('perfectionist/sort-interfaces');
  });

  it('adds React, Next.js, React Native and a11y layers', () => {
    const config = defineConfig({ a11y: true, next: true, react: 'next', reactNative: true });
    const rules = ruleNames(config);

    expect(jsPluginNames(config)).toEqual(
      new Set([
        '@eslint-react',
        'lobe',
        'perfectionist',
        'react-js',
        'react-native',
        'simple-import-sort',
      ]),
    );
    expect([...rules].some((rule) => rule.startsWith('nextjs/'))).toBe(true);
    expect([...rules].some((rule) => rule.startsWith('jsx-a11y/'))).toBe(true);
    expect([...rules].some((rule) => rule.startsWith('react-native/'))).toBe(true);
  });

  it('adds the bundled StyleX plugin only when stylex is on', () => {
    expect(jsPluginNames(defineConfig())).not.toContain('@stylexjs');

    const config = defineConfig({ stylex: true });
    expect(jsPluginNames(config)).toContain('@stylexjs');
    expect(ruleNames(config)).toContain('@stylexjs/valid-styles');
  });

  it('skips a11y without react', () => {
    const rules = ruleNames(defineConfig({ a11y: true }));
    expect([...rules].some((rule) => rule.startsWith('jsx-a11y/'))).toBe(false);
  });

  it('allows Next.js route exports only for react: "next"', () => {
    const allowExportNames = (react: 'next' | true) =>
      JSON.stringify(
        defineConfig({ react }).overrides?.find((o) => o.rules?.['react/only-export-components'])
          ?.rules?.['react/only-export-components'],
      );

    expect(allowExportNames('next')).toContain('generateMetadata');
    expect(allowExportNames(true)).not.toContain('generateMetadata');
  });

  it('enables type-aware linting with typeChecked', () => {
    const config = defineConfig({ typeChecked: true });

    expect(config.options?.typeAware).toBe(true);
    expect(ruleNames(config)).toContain('typescript/no-floating-promises');
  });

  it('anchors slash-less ignores to the config root like ESLint flat config', () => {
    const config = defineConfig({
      ignores: ['*.test.ts', 'coverage/', 'src/generated/**', '**/fixtures/**', '!keep.ts'],
    });

    expect(config.ignorePatterns?.slice(-5)).toEqual([
      '/*.test.ts',
      '/coverage/',
      'src/generated/**',
      '**/fixtures/**',
      '!/keep.ts',
    ]);
  });

  it('appends ignores and user overrides last', () => {
    const userOverride = { files: ['**/*.ts'], rules: { 'no-console': 'off' as const } };
    const config = defineConfig({ ignores: ['generated/**'] }, userOverride);

    expect(config.ignorePatterns).toContain('generated/**');
    expect(config.overrides?.at(-1)).toEqual(userOverride);
  });

  it('points every JS plugin at a built file', () => {
    const config = defineConfig({ a11y: true, next: true, react: true, reactNative: true });
    const specifiers = (config.overrides ?? []).flatMap((override) =>
      (override.jsPlugins ?? []).map((entry) =>
        typeof entry === 'string' ? entry : entry.specifier,
      ),
    );

    expect(specifiers.length).toBeGreaterThan(0);
    for (const specifier of specifiers) expect(fs.existsSync(specifier)).toBe(true);
  });
});

describe('package manifest', () => {
  it('has no runtime dependencies', () => {
    expect((pkg as { dependencies?: object }).dependencies).toBeUndefined();
  });

  it('only peers on oxlint and optionally oxlint-tsgolint', () => {
    expect(Object.keys(pkg.peerDependencies)).toEqual(['oxlint', 'oxlint-tsgolint']);
    expect(pkg.peerDependenciesMeta['oxlint-tsgolint'].optional).toBe(true);
  });
});
