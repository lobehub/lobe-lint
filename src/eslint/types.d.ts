declare module 'eslint-plugin-react-hooks' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-sort-keys-fix' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-typescript-sort-keys' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}

declare module 'eslint-plugin-unicorn' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin & {
    configs: {
      recommended: {
        rules: Record<string, any>;
      };
    };
  };
  export default plugin;
}

declare module 'eslint-plugin-unused-imports' {
  import type { ESLint } from 'eslint';

  const plugin: ESLint.Plugin;
  export default plugin;
}
