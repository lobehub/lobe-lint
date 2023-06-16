export default {
  $schema: 'https://json.schemastore.org/stylelintrc',
  extends: [
    require.resolve('@umijs/lint/dist/config/stylelint'),
    'stylelint-config-recommended',
    'stylelint-config-clean-order',
  ],
  overrides: [
    {
      customSyntax: 'postcss-less',
      files: ['*.less', '*.css'],
      plugins: ['stylelint-less'],
      rules: {
        'at-rule-no-unknown': undefined,
        'color-no-invalid-hex': true,
        'function-no-unknown': undefined,
        'less/color-no-invalid-hex': true,
      },
    },
    {
      customSyntax: 'postcss-styled-syntax',
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'no-empty-source': undefined,
        'no-invalid-double-slash-comments': undefined,
        'no-missing-end-of-source-newline': undefined,
        'property-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
      },
    },
  ],
  plugins: ['stylelint-order'],
};
