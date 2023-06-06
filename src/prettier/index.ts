module.exports = {
  plugins: [
    require.resolve('prettier-plugin-organize-imports'),
    require.resolve('prettier-plugin-packagejson'),
    require.resolve('prettier-plugin-sort-json'),
    require.resolve('@trivago/prettier-plugin-sort-imports'),
  ],
  printWidth: 100,
  proseWrap: 'never',
  singleQuote: true,
  trailingComma: 'all',
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
};
