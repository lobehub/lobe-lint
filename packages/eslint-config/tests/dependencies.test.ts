import { createRequire } from 'node:module';
import path from 'node:path';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

import pkg from '../package.json';
import { defineConfig } from '../src';

const require = createRequire(import.meta.url);

describe('zod-validation-error resolution', () => {
  // eslint-plugin-react-hooks 7 requires `zod-validation-error/v4` but accepts `^3.5.0 || ^4.0.0`;
  // 3.5.4 dropped the `./v4` export. eslint-plugin-react-compiler (`^3.0.3`) made bun and npm
  // hoist 3.5.4 for both, so `import('@lobehub/lint')` threw ERR_PACKAGE_PATH_NOT_EXPORTED.
  it('does not depend on eslint-plugin-react-compiler', () => {
    expect(Object.keys(pkg.dependencies)).not.toContain('eslint-plugin-react-compiler');
  });

  it('pins zod-validation-error to a major that has the ./v4 export', () => {
    expect(pkg.dependencies['zod-validation-error']).toMatch(/^\^4\./);
  });

  it('eslint-plugin-react-hooks can load zod-validation-error/v4', () => {
    const hooks = path.dirname(require.resolve('eslint-plugin-react-hooks/package.json'));

    expect(() =>
      createRequire(path.join(hooks, 'index.js')).resolve('zod-validation-error/v4'),
    ).not.toThrow();
  });
});

describe('reactCompiler option', () => {
  const severities = async (reactCompiler: boolean) => {
    const eslint = new ESLint({
      overrideConfig: defineConfig({ react: true, reactCompiler }) as any,
      overrideConfigFile: true,
    });
    const config = await eslint.calculateConfigForFile(
      path.join(__dirname, 'fixtures/react/a.tsx'),
    );
    const level = (rule: string) => {
      const value = config.rules?.[rule];
      return Array.isArray(value) ? value[0] : value;
    };
    return {
      compilerPlugin: Object.keys(config.rules ?? {}).some((rule) =>
        rule.startsWith('react-compiler/'),
      ),
      purity: level('react-hooks/purity'),
      refs: level('react-hooks/refs'),
    };
  };

  it('keeps the react-hooks compiler rules as warnings by default', async () => {
    expect(await severities(false)).toEqual({ compilerPlugin: false, purity: 1, refs: 1 });
  });

  it('raises the react-hooks compiler rules to errors without eslint-plugin-react-compiler', async () => {
    expect(await severities(true)).toEqual({ compilerPlugin: false, purity: 2, refs: 2 });
  });
});
