import { describe, expect, it } from 'vitest';

import { defineConfig } from '../dist/index.mjs';
import { lint } from './utils';

const OPTIONAL_CAST = `export const read = (result?: { value: unknown }) =>
  (result?.value as { field: string }).field;
`;

const lintSources = (sources: Record<string, string>) =>
  lint(defineConfig(), Object.keys(sources), { sources }).diagnostics;

const codesOf = (diagnostics: { code?: string }[]) => diagnostics.map((d) => d.code);

describe('rules adjusted for oxlint behavior', () => {
  it('reports no-unsafe-optional-chaining in source files only', () => {
    const diagnostics = lintSources({
      'src/read.test.ts': OPTIONAL_CAST,
      'src/read.ts': OPTIONAL_CAST,
    });
    const unsafe = diagnostics.filter((d) => d.code === 'eslint(no-unsafe-optional-chaining)');

    expect(unsafe.map((d) => d.filename)).toEqual(['src/read.ts']);
  });

  it('keeps an assignment that the next loop iteration reads', () => {
    const diagnostics = lintSources({
      'src/poll.ts': `export async function poll(fetchOnce: () => Promise<void>, wait: (ms: number) => Promise<void>) {
  let delay = 1000;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await fetchOnce();
      delay = 1000;
    } catch {
      await wait(delay);
      delay *= 2;
    }
  }
}
`,
    });

    expect(codesOf(diagnostics)).not.toContain('eslint(no-useless-assignment)');
  });

  it('reports unicorn/no-immediate-mutation as a warning', () => {
    const diagnostics = lintSources({
      'src/copy.ts': `export const copy = (source: Map<string, number>) => {
  const next = new Map(source);
  next.set('extra', 1);
  return next;
};
`,
    });
    const mutation = diagnostics.find((d) => d.code === 'unicorn(no-immediate-mutation)');

    expect(mutation?.severity).toBe('warning');
  });

  it('lets a later override turn off a rule of a plugin enabled by a layer override', () => {
    const config = defineConfig(
      { react: true },
      {
        files: ['**/*'],
        rules: {
          'react/only-export-components': 'off',
          'unicorn/number-literal-case': 'off',
        },
      },
    );
    const diagnostics = lint(config, ['src/hex.tsx'], {
      sources: {
        'src/hex.tsx': 'export const A = () => <div />;\nexport const b = 0xff;\n',
      },
    }).diagnostics;

    expect(codesOf(diagnostics)).not.toContain('unicorn(number-literal-case)');
    expect(codesOf(diagnostics)).not.toContain('react(only-export-components)');
  });
});
