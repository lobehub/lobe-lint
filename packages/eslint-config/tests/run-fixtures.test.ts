import path from 'node:path';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

import { defineConfig } from '../src';

const fixturesDir = path.join(__dirname, 'fixtures');

describe('ESLint Config Fixtures', () => {
  const config = defineConfig({
    ignores: [],
    react: true,
    typescript: true,
  });

  const eslint = new ESLint({
    cwd: fixturesDir,
    overrideConfig: config as any,
    overrideConfigFile: true,
  });

  describe('valid fixtures should pass', () => {
    it.each([
      ['javascript/valid/basic.js'],
      ['javascript/valid/vite.config.ts'],
      ['javascript/valid/object-shorthand.ts'],
      ['javascript/valid/destructuring-shorthand.ts'],
      ['typescript/valid/types.ts'],
      ['typescript/valid/type-imports.ts'],
      ['react/valid/component.tsx'],
      ['react/valid/sorted-props.tsx'],
      ['sorting/valid/sorted-keys.ts'],
      ['sorting/valid/sorted-enum.ts'],
      ['imports/valid/type-imports.tsx'],
      ['imports/valid/sorted-imports.ts'],
      // Unicorn valid fixtures
      ['unicorn/valid/error-prevention.ts'],
      ['unicorn/valid/code-cleanliness.ts'],
      ['unicorn/valid/modern-apis.ts'],
    ])('%s', async (file) => {
      const filePath = path.join(fixturesDir, file);
      const results = await eslint.lintFiles(filePath);
      const errors = results[0]?.messages.filter((m) => m.severity === 2) ?? [];

      if (errors.length > 0) {
        console.log('Errors found in valid fixture:', file);
        console.log(errors);
      }

      expect(errors.length).toBe(0);
    });
  });

  describe('invalid fixtures should fail', () => {
    it.each([
      // JavaScript
      ['javascript/invalid/unused-var.js', 'unused-imports/no-unused-vars'],
      ['javascript/invalid/default-export.ts', 'no-restricted-syntax'],
      ['javascript/invalid/object-shorthand.ts', 'object-shorthand'],
      ['javascript/invalid/no-useless-rename.ts', 'no-useless-rename'],
      // TypeScript
      ['typescript/invalid/missing-type-import.ts', '@typescript-eslint/consistent-type-imports'],
      // React
      ['react/invalid/unsorted-props.tsx', 'react/jsx-sort-props'],
      // Imports
      ['imports/invalid/duplicate.ts', 'import-x/no-duplicates'],
      ['imports/invalid/unused-import.ts', 'unused-imports/no-unused-imports'],
      ['imports/invalid/unsorted-imports.ts', 'simple-import-sort/imports'],
      // Sorting
      ['sorting/invalid/unsorted-keys.ts', 'perfectionist/sort-interfaces'],
      ['sorting/invalid/unsorted-enum.ts', 'perfectionist/sort-enums'],
      // Unicorn - Error Prevention
      ['unicorn/invalid/anonymous-default-export.ts', 'unicorn/no-anonymous-default-export'],
      ['unicorn/invalid/error-message.ts', 'unicorn/error-message'],
      ['unicorn/invalid/new-for-builtins.ts', 'unicorn/new-for-builtins'],
      ['unicorn/invalid/no-instanceof-builtins.ts', 'unicorn/no-instanceof-builtins'],
      ['unicorn/invalid/no-new-array.ts', 'unicorn/no-new-array'],
      ['unicorn/invalid/throw-new-error.ts', 'unicorn/throw-new-error'],
      ['unicorn/invalid/no-thenable.ts', 'unicorn/no-thenable'],
      [
        'unicorn/invalid/no-single-promise-in-promise-methods.ts',
        'unicorn/no-single-promise-in-promise-methods',
      ],
      // Unicorn - Code Cleanliness
      ['unicorn/invalid/no-zero-fractions.ts', 'unicorn/no-zero-fractions'],
      ['unicorn/invalid/number-literal-case.ts', 'unicorn/number-literal-case'],
      ['unicorn/invalid/no-useless-spread.ts', 'unicorn/no-useless-spread'],
      // Unicorn - Modern APIs
      ['unicorn/invalid/prefer-includes.ts', 'unicorn/prefer-includes'],
      ['unicorn/invalid/prefer-array-find.ts', 'unicorn/prefer-array-find'],
      ['unicorn/invalid/prefer-array-some.ts', 'unicorn/prefer-array-some'],
      ['unicorn/invalid/prefer-at.ts', 'unicorn/prefer-at'],
      ['unicorn/invalid/prefer-node-protocol.ts', 'unicorn/prefer-node-protocol'],
    ])('%s should have %s error', async (file, expectedRule) => {
      const filePath = path.join(fixturesDir, file);
      const results = await eslint.lintFiles(filePath);
      const errors = results[0]?.messages ?? [];

      const hasExpectedError = errors.some((m) => m.ruleId === expectedRule);

      if (!hasExpectedError) {
        console.log('Expected error not found:', expectedRule);
        console.log(
          'Found errors:',
          errors.map((e) => e.ruleId),
        );
      }

      expect(hasExpectedError).toBe(true);
    });
  });
});
