export default {
  $schema: 'https://json.schemastore.org/eslintrc',
  extends: [
    'eslint:recommended',
    require.resolve('@umijs/lint/dist/config/eslint'),
    'plugin:unicorn/recommended',
  ],
  plugins: [
    'unicorn',
    'import',
    'unused-imports',
    'simple-import-sort',
    'sort-keys-fix',
    'typescript-sort-keys',
  ],
  rules: {
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'no-empty': 'warn',
    'no-unused-vars': 0,
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-sort-props': 'error',
    'simple-import-sort/exports': 'error',
    'sort-keys-fix/sort-keys-fix': 'error',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
    'unicorn/explicit-length-check': 'warn',
    'unicorn/filename-case': 0,
    'unicorn/no-array-for-each': 'warn',
    'unicorn/no-array-reduce': 0,
    'unicorn/no-empty-file': 'warn',
    'unicorn/no-nested-ternary': 0,
    'unicorn/no-null': 'warn',
    'unicorn/prefer-code-point': 'warn',
    'unicorn/prefer-logical-operator-over-ternary': 'warn',
    'unicorn/prefer-module': 0,
    'unicorn/prefer-spread': 'warn',
    'unicorn/prefer-string-replace-all': 'warn',
    'unicorn/prevent-abbreviations': 0,
    'unicorn/switch-case-braces': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { args: 'after-used', argsIgnorePattern: '^_', vars: 'all', varsIgnorePattern: '^_' },
    ],
  },
};
