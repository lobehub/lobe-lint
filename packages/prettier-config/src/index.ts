import { type Config } from 'prettier';

const config: Config = {
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  jsonRecursiveSort: false,
  jsonSortOrder: '{"*": "lexical"}',
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
  plugins: ['prettier-plugin-sh', 'prettier-plugin-packagejson', 'prettier-plugin-sort-json'],
  printWidth: 100,
  proseWrap: 'never',
  quoteProps: 'consistent',
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
} as Config;

export default config;
