declare module 'eslint-plugin-jsx-a11y' {
  import type { ESLint, Linter } from 'eslint';

  const plugin: ESLint.Plugin & {
    flatConfigs: {
      recommended: {
        plugins: Record<string, ESLint.Plugin>;
        rules: Linter.RulesRecord;
      };
      strict: {
        plugins: Record<string, ESLint.Plugin>;
        rules: Linter.RulesRecord;
      };
    };
  };
  export default plugin;
}

declare module 'eslint-plugin-react-native' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}
