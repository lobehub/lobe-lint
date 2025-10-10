const config = require('./dist/eslint').default;

module.exports = [
  {
    ignores: [
      'node_modules',
      '.coverage',
      'jest*',
      '_test_',
      '__test__',
      '.umi',
      '.umi-production',
      '.umi-test',
      '.dumi/tmp*',
      'dist',
      'es',
      'lib',
      'logs',
    ],
  },
  ...config,
];
