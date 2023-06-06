module.exports = {
  extends: [
    'stylelint-config-recommended',
    require.resolve('@umijs/lint/dist/config/stylelint'),
    'stylelint-config-clean-order',
  ],
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ['*.less', '*.css'],
      plugins: ['stylelint-less'],
      customSyntax: 'postcss-less',
      rules: {
        'function-no-unknown': null,
        'at-rule-no-unknown': null,
        'color-no-invalid-hex': true,
        'less/color-no-invalid-hex': true,
      },
    },
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      customSyntax: 'postcss-styled-syntax',
      rules: {
        'value-no-vendor-prefix': true,
        'property-no-vendor-prefix': true,
        'no-empty-source': null,
        'no-missing-end-of-source-newline': null,
        'no-invalid-double-slash-comments': null,
      },
    },
  ],
};
