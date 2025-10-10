import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import * as importPlugin from 'eslint-plugin-import';
import * as jestPlugin from 'eslint-plugin-jest';
import * as reactPlugin from 'eslint-plugin-react';
import * as reactHooksPlugin from 'eslint-plugin-react-hooks';
import * as simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import * as sortKeysFixPlugin from 'eslint-plugin-sort-keys-fix';
import * as typescriptSortKeysPlugin from 'eslint-plugin-typescript-sort-keys';
import * as unicornPlugin from 'eslint-plugin-unicorn';
import * as unusedImportsPlugin from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

// Base rules from @umijs/lint
const baseRules: Record<string, any> = {
  // eslint built-in rules
  'array-callback-return': 2,
  'eqeqeq': 2,
  'for-direction': 2,
  'guard-for-in': 2,
  'no-async-promise-executor': 2,
  'no-case-declarations': 2,
  'no-debugger': 2,
  'no-delete-var': 2,
  'no-dupe-else-if': 2,
  'no-duplicate-case': 2,
  'no-eval': 2,
  'no-ex-assign': 2,
  'no-global-assign': 2,
  'no-invalid-regexp': 2,
  'no-native-reassign': 2,
  'no-param-reassign': 2,
  'no-promise-executor-return': 2,
  'no-self-assign': 2,
  'no-self-compare': 2,
  'no-shadow-restricted-names': 2,
  'no-sparse-arrays': 2,
  'no-unsafe-finally': 2,
  'no-unused-labels': 2,
  'no-useless-catch': 2,
  'no-useless-escape': 2,
  'no-var': 2,
  'no-with': 2,
  // React rules from @umijs/lint
  'react-hooks/rules-of-hooks': 2,
  'react/button-has-type': 2,
  'react/jsx-key': 2,
  'react/jsx-no-comment-textnodes': 2,
  'react/jsx-no-duplicate-props': 2,
  'react/jsx-no-target-blank': 2,
  'react/jsx-no-undef': 2,
  'react/jsx-uses-react': 2,
  'react/jsx-uses-vars': 2,
  'react/no-children-prop': 2,
  'react/no-danger-with-children': 2,
  'react/no-deprecated': 2,
  'react/no-direct-mutation-state': 2,
  'react/no-find-dom-node': 2,
  'react/no-is-mounted': 2,
  'react/no-render-return-value': 2,
  'react/no-string-refs': 2,
  'react/no-unescaped-entities': 2,
  'react/no-unknown-property': 2,
  'react/require-render-return': 2,
  'require-yield': 2,
  'use-isnan': 2,
};

// TypeScript rules from @umijs/lint (updated for typescript-eslint v8)
const typescriptRules: Record<string, any> = {
  // '@typescript-eslint/ban-types': 2, // Removed in v8, use @typescript-eslint/no-restricted-types instead
  '@typescript-eslint/no-confusing-non-null-assertion': 2,
  '@typescript-eslint/no-dupe-class-members': 2,
  // '@typescript-eslint/no-empty-interface': 2, // Removed in v8
  '@typescript-eslint/no-invalid-this': 2,
  '@typescript-eslint/no-loop-func': 2,
  '@typescript-eslint/no-misused-new': 2,
  '@typescript-eslint/no-namespace': 2,
  '@typescript-eslint/no-non-null-asserted-optional-chain': 2,
  '@typescript-eslint/no-redeclare': 2,
  '@typescript-eslint/no-this-alias': 2,
  '@typescript-eslint/no-unused-expressions': 2,
  '@typescript-eslint/no-unused-vars': 2,
  '@typescript-eslint/no-use-before-define': 2,
  '@typescript-eslint/no-useless-constructor': 2,
  '@typescript-eslint/triple-slash-reference': 2,
};

// Jest rules from @umijs/lint
const jestRules: Record<string, any> = {
  'jest/no-conditional-expect': 2,
  'jest/no-deprecated-functions': 2,
  'jest/no-export': 2,
  'jest/no-focused-tests': 2,
  'jest/no-identical-title': 2,
  'jest/no-interpolation-in-snapshots': 2,
  'jest/no-jasmine-globals': 2,
  'jest/no-mocks-import': 2,
  'jest/no-standalone-expect': 2,
  'jest/valid-describe-callback': 2,
  'jest/valid-expect': 2,
  'jest/valid-expect-in-promise': 2,
  'jest/valid-title': 2,
};

// Additional custom rules
const customRules: Record<string, any> = {
  '@typescript-eslint/ban-ts-comment': 0,
  '@typescript-eslint/no-explicit-any': 0,
  '@typescript-eslint/no-useless-constructor': 0,
  'import/first': 'error',
  'import/newline-after-import': 'error',
  'import/no-duplicates': 'error',
  'no-empty': 'warn',
  'no-extra-boolean-cast': 0,
  'no-unused-vars': 0,
  'react/display-name': 0,
  'react/jsx-no-useless-fragment': 'error',
  'react/jsx-sort-props': 'error',
  'react/no-unknown-property': 0,
  'react/prop-types': 0,
  'react/react-in-jsx-scope': 0,
  'react/self-closing-comp': [
    'warn',
    {
      component: true,
      html: true,
    },
  ],
  'simple-import-sort/exports': 'error',
  'sort-keys-fix/sort-keys-fix': 'error',
  'typescript-sort-keys/interface': 'error',
  'typescript-sort-keys/string-enum': 'error',
  'unicorn/catch-error-name': 0,
  'unicorn/expiring-todo-comments': 0,
  'unicorn/explicit-length-check': 0,
  'unicorn/filename-case': 0,
  'unicorn/import-style': 0,
  'unicorn/no-anonymous-default-export': 0,
  'unicorn/no-array-callback-reference': 0,
  'unicorn/no-array-for-each': 0,
  'unicorn/no-array-reduce': 0,
  'unicorn/no-empty-file': 'warn',
  'unicorn/no-negated-condition': 0,
  'unicorn/no-nested-ternary': 0,
  'unicorn/no-null': 0,
  'unicorn/no-typeof-undefined': 0,
  'unicorn/no-useless-undefined': 0,
  'unicorn/prefer-code-point': 0,
  'unicorn/prefer-logical-operator-over-ternary': 0,
  'unicorn/prefer-module': 0,
  'unicorn/prefer-number-properties': 0,
  'unicorn/prefer-query-selector': 0,
  'unicorn/prefer-spread': 0,
  'unicorn/prefer-string-raw': 0,
  'unicorn/prefer-string-replace-all': 'warn',
  'unicorn/prefer-ternary': 0,
  'unicorn/prefer-type-error': 0,
  'unicorn/prevent-abbreviations': 0,
  'unicorn/switch-case-braces': 'warn',
  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': [
    'warn',
    { args: 'after-used', argsIgnorePattern: '^_', vars: 'all', varsIgnorePattern: '^_' },
  ],
};

const config: Linter.Config[] = [
  // Base JavaScript/TypeScript config
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        Buffer: 'readonly',

        __dirname: 'readonly',

        __filename: 'readonly',

        afterAll: 'readonly',

        afterEach: 'readonly',

        beforeAll: 'readonly',

        beforeEach: 'readonly',

        // Node globals
        console: 'readonly',

        // Jest globals
        describe: 'readonly',

        // Browser globals
        document: 'readonly',

        expect: 'readonly',

        exports: 'writable',

        global: 'readonly',
        it: 'readonly',
        jest: 'readonly',
        module: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        require: 'readonly',
        test: 'readonly',
        window: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: 'module',
    },
    plugins: {
      'import': importPlugin as any,
      'react': reactPlugin as any,
      'react-hooks': reactHooksPlugin as any,
      'simple-import-sort': simpleImportSortPlugin as any,
      'sort-keys-fix': sortKeysFixPlugin as any,
      'typescript-sort-keys': typescriptSortKeysPlugin as any,
      'unicorn': unicornPlugin as any,
      'unused-imports': unusedImportsPlugin as any,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...(unicornPlugin as any).configs.recommended.rules,
      ...baseRules,
      ...customRules,
    } as any,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // TypeScript specific config
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: typescriptRules as any,
  },
  // Jest test files config
  {
    files: ['**/*.{test,spec,unit,e2e}.{ts,tsx,js,jsx}'],
    plugins: {
      jest: jestPlugin as any,
    },
    rules: jestRules as any,
  },
];

export default config;
