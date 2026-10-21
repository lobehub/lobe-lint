import path from 'node:path';

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

import { defineConfig } from '../src';
import { ESLINT_REACT_DUPLICATES } from '../src/configs/react';

const fixturesDir = path.join(__dirname, 'fixtures');

describe('ESLint Config Fixtures', () => {
  const config = defineConfig({
    ignores: [],
    react: true,
    typescript: true,
  });

  const eslint = new ESLint({
    cwd: fixturesDir,
    overrideConfig: config as any,
    overrideConfigFile: true,
  });

  describe('valid fixtures should pass', () => {
    it.each([
      ['javascript/valid/basic.js'],
      ['javascript/valid/vite.config.ts'],
      ['javascript/valid/object-shorthand.ts'],
      ['javascript/valid/destructuring-shorthand.ts'],
      ['typescript/valid/types.ts'],
      ['typescript/valid/type-imports.ts'],
      ['react/valid/component.tsx'],
      ['react/valid/sorted-props.tsx'],
      ['sorting/valid/sorted-keys.ts'],
      ['sorting/valid/sorted-enum.ts'],
      ['imports/valid/type-imports.tsx'],
      ['imports/valid/sorted-imports.ts'],
      // Unicorn valid fixtures
      ['unicorn/valid/error-prevention.ts'],
      ['unicorn/valid/code-cleanliness.ts'],
      ['unicorn/valid/modern-apis.ts'],
    ])('%s', async (file) => {
      const filePath = path.join(fixturesDir, file);
      const results = await eslint.lintFiles(filePath);
      const errors = results[0]?.messages.filter((m) => m.severity === 2) ?? [];

      if (errors.length > 0) {
        console.log('Errors found in valid fixture:', file);
        console.log(errors);
      }

      expect(errors.length).toBe(0);
    });
  });

  describe('invalid fixtures should fail', () => {
    it.each([
      // JavaScript
      ['javascript/invalid/unused-var.js', 'unused-imports/no-unused-vars'],
      ['javascript/invalid/default-export.ts', 'no-restricted-syntax'],
      ['javascript/invalid/object-shorthand.ts', 'object-shorthand'],
      ['javascript/invalid/no-useless-rename.ts', 'no-useless-rename'],
      // TypeScript
      ['typescript/invalid/missing-type-import.ts', '@typescript-eslint/consistent-type-imports'],
      // React
      ['react/invalid/unsorted-props.tsx', 'react/jsx-sort-props'],
      // Imports
      ['imports/invalid/duplicate.ts', 'import-x/no-duplicates'],
      ['imports/invalid/unused-import.ts', 'unused-imports/no-unused-imports'],
      ['imports/invalid/unsorted-imports.ts', 'simple-import-sort/imports'],
      // Sorting
      ['sorting/invalid/unsorted-keys.ts', 'perfectionist/sort-interfaces'],
      ['sorting/invalid/unsorted-enum.ts', 'perfectionist/sort-enums'],
      // Unicorn - Error Prevention
      ['unicorn/invalid/anonymous-default-export.ts', 'unicorn/no-anonymous-default-export'],
      ['unicorn/invalid/error-message.ts', 'unicorn/error-message'],
      ['unicorn/invalid/new-for-builtins.ts', 'unicorn/new-for-builtins'],
      ['unicorn/invalid/no-instanceof-builtins.ts', 'unicorn/no-instanceof-builtins'],
      ['unicorn/invalid/no-new-array.ts', 'unicorn/no-new-array'],
      ['unicorn/invalid/throw-new-error.ts', 'unicorn/throw-new-error'],
      ['unicorn/invalid/no-thenable.ts', 'unicorn/no-thenable'],
      [
        'unicorn/invalid/no-single-promise-in-promise-methods.ts',
        'unicorn/no-single-promise-in-promise-methods',
      ],
      // Unicorn - Code Cleanliness
      ['unicorn/invalid/no-zero-fractions.ts', 'unicorn/no-zero-fractions'],
      ['unicorn/invalid/number-literal-case.ts', 'unicorn/number-literal-case'],
      ['unicorn/invalid/no-useless-spread.ts', 'unicorn/no-useless-spread'],
      // Unicorn - Modern APIs
      ['unicorn/invalid/prefer-includes.ts', 'unicorn/prefer-includes'],
      ['unicorn/invalid/prefer-array-find.ts', 'unicorn/prefer-array-find'],
      ['unicorn/invalid/prefer-array-some.ts', 'unicorn/prefer-array-some'],
      ['unicorn/invalid/prefer-at.ts', 'unicorn/prefer-at'],
      ['unicorn/invalid/prefer-node-protocol.ts', 'unicorn/prefer-node-protocol'],
    ])('%s should have %s error', async (file, expectedRule) => {
      const filePath = path.join(fixturesDir, file);
      const results = await eslint.lintFiles(filePath);
      const errors = results[0]?.messages ?? [];

      const hasExpectedError = errors.some((m) => m.ruleId === expectedRule);

      if (!hasExpectedError) {
        console.log('Expected error not found:', expectedRule);
        console.log(
          'Found errors:',
          errors.map((e) => e.ruleId),
        );
      }

      expect(hasExpectedError).toBe(true);
    });
  });

  describe('autofix output should stay valid TypeScript', () => {
    const fixer = new ESLint({
      cwd: fixturesDir,
      fix: true,
      overrideConfig: config as any,
      overrideConfigFile: true,
    });

    const fix = async (code: string) => {
      const [result] = await fixer.lintText(code, {
        filePath: path.join(fixturesDir, 'imports/autofix/input.tsx'),
      });
      return result;
    };

    /** Import statements of the fixed output, whitespace removed (formatting is prettier's job). */
    const importsOf = (code: string) =>
      code
        .split('\n')
        .filter((line) => line.startsWith('import'))
        .map((line) => line.replaceAll(/\s+/g, ''));

    it.each([
      [
        'inline type + value specifiers (TS2206/TS1361 regression)',
        `import { type CSSProperties, forwardRef, MouseEvent, useMemo } from 'react';

export const A = forwardRef<HTMLDivElement, { o: (e: MouseEvent) => void; s: CSSProperties }>(
  (p, ref) => {
    const v = useMemo(() => p.s, [p.s]);
    return <div onClick={p.o} ref={ref} style={v} />;
  },
);
`,
        [
          "importtype{MouseEvent}from'react';",
          "import{typeCSSProperties,forwardRef,useMemo}from'react';",
        ],
      ],
      [
        'type-only specifier split next to an inline type import (TS2206 regression)',
        `import { createElement, ElementType } from 'react';
import { type HTMLAttributes } from 'react';

export const B = (p: { as: ElementType } & HTMLAttributes<HTMLElement>) => createElement(p.as, p);
`,
        ["importtype{ElementType,HTMLAttributes}from'react';", "import{createElement}from'react';"],
      ],
      [
        'separate type + value imports are kept as is',
        `import type { FC } from 'react';
import { useMemo } from 'react';

export const C: FC = () => {
  useMemo(() => 1, []);
  return null;
};
`,
        ["importtype{FC}from'react';", "import{useMemo}from'react';"],
      ],
      [
        'real duplicate value imports are still merged',
        `import { type ReactNode, useMemo } from 'react';
import { useState } from 'react';

export const D = (p: { c: ReactNode }) => {
  useMemo(() => 1, []);
  useState(1);
  return p.c;
};
`,
        ["import{typeReactNode,useMemo,useState}from'react';"],
      ],
      [
        'inline-type-only import is merged into import type without the inline keyword',
        `import type { FC } from 'react';
import { type ReactNode } from 'react';

export const F: FC<{ c: ReactNode }> = () => null;
`,
        ["importtype{FC,ReactNode}from'react';"],
      ],
    ])('%s', async (_name, code, expected) => {
      const result = await fix(code);
      const output = result.output ?? code;

      expect(importsOf(output)).toEqual(expected);
      expect(output).not.toMatch(/import type \{[^}]*\btype\s/);
      expect(result.messages.filter((m) => m.severity === 2)).toEqual([]);
    });

    it('@eslint-react/no-forward-ref only suggests, never autofixes', async () => {
      const code = `import { forwardRef } from 'react';

export const E = forwardRef((props: any, ref) => <div ref={ref} {...props} />);
`;
      const result = await fix(code);
      const message = result.messages.find((m) => m.ruleId === '@eslint-react/no-forward-ref');

      expect(result.output ?? code).toContain('forwardRef((props: any, ref) =>');
      expect(message?.fix).toBeUndefined();
    });
  });

  describe('commonjs config files may require()', () => {
    const errorsOf = async (code: string, file: string) => {
      const [result] = await eslint.lintText(code, { filePath: path.join(fixturesDir, file) });
      return result.messages.filter((m) => m.severity === 2);
    };

    it.each([
      ['.releaserc.cjs', "module.exports = require('@lobehub/lint/release');\n"],
      ['.changelogrc.cjs', "module.exports = require('@lobehub/lint/changelog');\n"],
      ['packages/a/.changelogrc.cjs', "module.exports = require('../../.changelogrc.cjs');\n"],
      [
        '.releaserc.cjs',
        "module.exports = {\n  ...require('@lobehub/lint/release'),\n  branches: ['main'],\n};\n",
      ],
      ['.releaserc.js', "module.exports = require('@lobehub/lint/release');\n"],
      ['tools/build.cjs', "const fs = require('node:fs');\n\nmodule.exports = fs.existsSync;\n"],
    ])('%s', async (file, code) => {
      expect(await errorsOf(code, file)).toEqual([]);
    });

    it('allows the default export of rc files such as .remarkrc.mjs', async () => {
      const [result] = await eslint.lintText(
        "import { remarklint } from '@lobehub/lint';\n\nexport default remarklint;\n",
        { filePath: path.join(fixturesDir, '.remarkrc.mjs') },
      );

      expect(result.messages.map((m) => m.ruleId)).not.toContain('no-restricted-syntax');
    });

    it('still reports require() in ESM files', async () => {
      const errors = await errorsOf(
        "const fs = require('node:fs');\n\nexport const e = fs;\n",
        'src/a.mjs',
      );

      expect(errors.map((m) => m.ruleId)).toContain('@typescript-eslint/no-require-imports');
    });
  });

  describe('react hooks rules are reported once', () => {
    it('a missing effect dependency is only reported by react-hooks/exhaustive-deps', async () => {
      const code = `import { useEffect, useState } from 'react';

export const Counter = ({ step }: { step: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + step);
  }, []);
  return <span>{count}</span>;
};
`;
      const [result] = await eslint.lintText(code, {
        filePath: path.join(fixturesDir, 'react/hooks.tsx'),
      });
      const ids = result.messages.map((m) => m.ruleId);

      expect(ids.filter((id) => id === 'react-hooks/exhaustive-deps')).toHaveLength(1);
      expect(ids).not.toContain('@eslint-react/exhaustive-deps');
    });

    it.each(ESLINT_REACT_DUPLICATES)('%s is only enabled in react-hooks', async (rule) => {
      const config = await eslint.calculateConfigForFile(path.join(fixturesDir, 'react/hooks.tsx'));
      const level = (id: string) => {
        const value = config.rules?.[id];
        return Array.isArray(value) ? value[0] : value;
      };

      expect([0, 'off']).toContain(level(`@eslint-react/${rule}`));
      expect([1, 2, 'warn', 'error']).toContain(level(`react-hooks/${rule}`));
    });

    it('a conditional hook call is reported once', async () => {
      const code = `import { useState } from 'react';

export const A = ({ on }: { on: boolean }) => {
  if (on) {
    useState(0);
  }
  return <span />;
};
`;
      const [result] = await eslint.lintText(code, {
        filePath: path.join(fixturesDir, 'react/hooks.tsx'),
      });
      const ids = result.messages.map((m) => m.ruleId);

      expect(ids.filter((id) => id === 'react-hooks/rules-of-hooks')).toHaveLength(1);
      expect(ids).not.toContain('@eslint-react/rules-of-hooks');
    });
  });

  describe('@eslint-react/web-api-no-leaked-fetch', () => {
    const lint = async (body: string) => {
      const code = `import { useEffect, useState } from 'react';

export const User = ({ id }: { id: string }) => {
  const [user, setUser] = useState<unknown>();
  useEffect(() => {
${body}
  }, [id]);
  return <span>{String(user)}</span>;
};
`;
      const [result] = await eslint.lintText(code, {
        filePath: path.join(fixturesDir, 'react/fetch.tsx'),
      });
      return result.messages.filter((m) => m.ruleId === '@eslint-react/web-api-no-leaked-fetch');
    };

    it('reports an un-aborted fetch in an effect as an error', async () => {
      const messages = await lint(`    fetch(\`/api/users/\${id}\`)
      .then((r) => r.json())
      .then(setUser);`);

      expect(messages).toHaveLength(1);
      expect(messages[0].severity).toBe(2);
    });

    it('still reports the `let ignore = false` pattern (known false positive)', async () => {
      const messages = await lint(`    let ignore = false;
    fetch(\`/api/users/\${id}\`)
      .then((r) => r.json())
      .then((u) => {
        if (!ignore) setUser(u);
      });
    return () => {
      ignore = true;
    };`);

      expect(messages).toHaveLength(1);
    });

    it('accepts a fetch aborted on cleanup', async () => {
      const messages = await lint(`    const controller = new AbortController();
    fetch(\`/api/users/\${id}\`, { signal: controller.signal })
      .then((r) => r.json())
      .then(setUser);
    return () => controller.abort();`);

      expect(messages).toEqual([]);
    });
  });
});

describe('regex autofix', () => {
  it('does not cycle between unicorn/better-regex and regexp/strict', async () => {
    const code = 'export const R = /url\\(\\s*[\'"]?#(?!\\$\\{)[^\\s)\'"]/;\n';
    const fixer = new ESLint({
      cwd: fixturesDir,
      fix: true,
      overrideConfig: defineConfig({}) as any,
      overrideConfigFile: true,
    });
    const [result] = await fixer.lintText(code, { filePath: path.join(fixturesDir, 'regex.mjs') });
    const output = result.output ?? code;

    expect(output).toContain(String.raw`(?!\$\{)`);
    expect(result.messages.map((m) => m.ruleId)).not.toContain('regexp/strict');
    expect(result.messages.map((m) => m.ruleId)).not.toContain('unicorn/better-regex');
  });
});
