import { type Config } from 'stylelint';

import { useLogicalSpec } from './plugins/use-logical-spec';

const config: Config = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
    'stylelint-config-clean-order',
  ],
  overrides: [
    {
      customSyntax: 'postcss-less',
      files: ['*.less', '*.css'],
      plugins: ['stylelint-less'],
      rules: {
        'at-rule-no-unknown': null,
        'color-no-invalid-hex': true,
        'function-no-unknown': null,
        'less/color-no-invalid-hex': true,
      },
    },
  ],
  // `liberty/use-logical-spec` comes from a wrapper around `stylelint-use-logical-spec` that leaves
  // `transition` / `will-change` values alone: rewriting them breaks animations.
  plugins: ['stylelint-order', useLogicalSpec],
  rules: {
    'liberty/use-logical-spec': [true, { except: ['float', /^((min|max)-)?(height|width)$/i] }],
  },
};

export default config;
