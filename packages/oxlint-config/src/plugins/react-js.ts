import jsxSortProps from 'eslint-plugin-react/lib/rules/jsx-sort-props.js';

const plugin = {
  meta: { name: 'react-js' },
  rules: { 'jsx-sort-props': jsxSortProps },
};

export { plugin as default };
