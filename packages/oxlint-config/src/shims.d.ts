declare module 'eslint-plugin-react/lib/rules/jsx-sort-props.js' {
  const rule: object;
  export default rule;
}

declare module 'eslint-core-rule:*' {
  const rule: object;
  export default rule;
}

declare module 'eslint-plugin-simple-import-sort' {
  const plugin: { meta: { name: string }; rules: Record<string, object> };
  export default plugin;
}

declare module 'eslint-plugin-react-native' {
  const plugin: { rules: Record<string, object> };
  export default plugin;
}
