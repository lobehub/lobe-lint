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
      ['typescript/valid/types.ts'],
      ['typescript/valid/type-imports.ts'],
      ['react/valid/component.tsx'],
      ['react/valid/sorted-props.tsx'],
      ['sorting/valid/sorted-keys.ts'],
      ['sorting/valid/sorted-enum.ts'],
      ['imports/valid/type-imports.tsx'],
      ['imports/valid/sorted-imports.ts'],
      ['unicorn/valid/best-practices.ts'],
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
      ['javascript/invalid/unused-var.js', 'unused-imports/no-unused-vars'],
      ['typescript/invalid/missing-type-import.ts', '@typescript-eslint/consistent-type-imports'],
      ['react/invalid/unsorted-props.tsx', '@stylistic/jsx-sort-props'],
      ['imports/invalid/duplicate.ts', 'import-x/no-duplicates'],
      ['imports/invalid/unused-import.ts', 'unused-imports/no-unused-imports'],
      ['imports/invalid/unsorted-imports.ts', 'simple-import-sort/imports'],
      ['sorting/invalid/unsorted-keys.ts', 'perfectionist/sort-interfaces'],
      ['sorting/invalid/unsorted-enum.ts', 'perfectionist/sort-enums'],
      ['unicorn/invalid/anonymous-default-export.ts', 'unicorn/no-anonymous-default-export'],
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
