export default {
  extends: [require.resolve('@umijs/lint/dist/config/eslint')],
  plugins: ['simple-import-sort', 'import', 'typescript-sort-keys', 'unused-imports'],
  rules: {
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
    'react/jsx-sort-props': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
  },
};
