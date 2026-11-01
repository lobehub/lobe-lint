import { describe, expect, it } from 'vitest';

import { defineConfig } from '../dist/index.mjs';
import { lint, pluginErrors } from './utils';

const config = defineConfig({ react: true, typescript: true });

const VALID = [
  'javascript/valid/basic.js',
  'javascript/valid/vite.config.ts',
  'javascript/valid/object-shorthand.ts',
  'javascript/valid/destructuring-shorthand.ts',
  'typescript/valid/types.ts',
  'typescript/valid/type-imports.ts',
  'react/valid/component.tsx',
  'react/valid/sorted-props.tsx',
  'sorting/valid/sorted-keys.ts',
  'sorting/valid/sorted-enum.ts',
  'imports/valid/type-imports.tsx',
  'imports/valid/sorted-imports.ts',
  'unicorn/valid/error-prevention.ts',
  'unicorn/valid/code-cleanliness.ts',
  'unicorn/valid/modern-apis.ts',
];

const INVALID: [file: string, code: string][] = [
  ['javascript/invalid/unused-var.js', 'eslint(no-unused-vars)'],
  ['javascript/invalid/default-export.ts', 'eslint(no-restricted-exports)'],
  ['javascript/invalid/object-shorthand.ts', 'eslint(object-shorthand)'],
  ['javascript/invalid/no-useless-rename.ts', 'eslint(no-useless-rename)'],
  ['typescript/invalid/missing-type-import.ts', 'typescript(consistent-type-imports)'],
  ['react/invalid/unsorted-props.tsx', 'react-js(jsx-sort-props)'],
  ['imports/invalid/duplicate.ts', 'import(no-duplicates)'],
  ['imports/invalid/unused-import.ts', 'eslint(no-unused-vars)'],
  ['imports/invalid/unsorted-imports.ts', 'simple-import-sort(imports)'],
  ['sorting/invalid/unsorted-keys.ts', 'perfectionist(sort-interfaces)'],
  ['sorting/invalid/unsorted-enum.ts', 'perfectionist(sort-enums)'],
  ['unicorn/invalid/anonymous-default-export.ts', 'unicorn(no-anonymous-default-export)'],
  ['unicorn/invalid/error-message.ts', 'unicorn(error-message)'],
  ['unicorn/invalid/new-for-builtins.ts', 'unicorn(new-for-builtins)'],
  ['unicorn/invalid/no-instanceof-builtins.ts', 'unicorn(no-instanceof-builtins)'],
  ['unicorn/invalid/no-new-array.ts', 'unicorn(no-new-array)'],
  ['unicorn/invalid/throw-new-error.ts', 'unicorn(throw-new-error)'],
  ['unicorn/invalid/no-thenable.ts', 'unicorn(no-thenable)'],
  [
    'unicorn/invalid/no-single-promise-in-promise-methods.ts',
    'unicorn(no-single-promise-in-promise-methods)',
  ],
  ['unicorn/invalid/no-zero-fractions.ts', 'unicorn(no-zero-fractions)'],
  ['unicorn/invalid/number-literal-case.ts', 'unicorn(number-literal-case)'],
  ['unicorn/invalid/no-useless-spread.ts', 'unicorn(no-useless-spread)'],
  ['unicorn/invalid/prefer-includes.ts', 'unicorn(prefer-includes)'],
  ['unicorn/invalid/prefer-array-find.ts', 'unicorn(prefer-array-find)'],
  ['unicorn/invalid/prefer-array-some.ts', 'unicorn(prefer-array-some)'],
  ['unicorn/invalid/prefer-at.ts', 'unicorn(prefer-at)'],
  ['unicorn/invalid/prefer-node-protocol.ts', 'unicorn(prefer-node-protocol)'],
];

describe('eslint-config fixtures under oxlint', () => {
  const { diagnostics, files } = lint(config, [...VALID, ...INVALID.map(([file]) => file)]);
  const byFile = (file: string) => diagnostics.filter((d) => d.filename === file);

  it('lints every fixture without JS plugin errors', () => {
    expect(files).toBe(VALID.length + INVALID.length);
    expect(pluginErrors(diagnostics)).toEqual([]);
  });

  it.each(VALID)('%s has no errors', (file) => {
    expect(byFile(file).filter((d) => d.severity === 'error')).toEqual([]);
  });

  it.each(INVALID)('%s reports %s', (file, code) => {
    expect(byFile(file).map((d) => d.code)).toContain(code);
  });
});

describe('stylex fixtures under oxlint', () => {
  const STYLEX_INVALID = [
    ['stylex/invalid/unknown-property.tsx', '@stylexjs(valid-styles)'],
    ['stylex/invalid/multi-value-shorthand.tsx', '@stylexjs(valid-shorthands)'],
    ['stylex/invalid/unused-style.tsx', '@stylexjs(no-unused)'],
  ];
  const files = ['stylex/valid/styles.tsx', ...STYLEX_INVALID.map(([file]) => file)];
  const { diagnostics } = lint(defineConfig({ react: true, stylex: true }), files);
  const codesIn = (file: string, severity?: string) =>
    diagnostics
      .filter((d) => d.filename === file && (!severity || d.severity === severity))
      .map((d) => d.code);

  it('runs the bundled StyleX plugin without errors', () => {
    expect(pluginErrors(diagnostics)).toEqual([]);
    expect(codesIn('stylex/valid/styles.tsx', 'error')).toEqual([]);
  });

  it.each(STYLEX_INVALID)('%s reports %s', (file, code) => {
    expect(codesIn(file)).toContain(code);
  });

  it('is off by default', () => {
    const { diagnostics: defaults } = lint(config, ['stylex/invalid/unknown-property.tsx']);
    expect(defaults.filter((d) => d.code?.startsWith('@stylexjs'))).toEqual([]);
  });
});
