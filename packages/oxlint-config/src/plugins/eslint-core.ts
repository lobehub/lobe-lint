import noRestrictedImports from 'eslint-core-rule:no-restricted-imports';
import noRestrictedSyntax from 'eslint-core-rule:no-restricted-syntax';

const plugin = {
  meta: { name: 'eslint-core' },
  rules: {
    'no-restricted-imports': noRestrictedImports,
    'no-restricted-syntax': noRestrictedSyntax,
  },
};

export { plugin as default };
