import path from 'node:path';

import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';

import config from '../src';

const lint = (code: string, fix: boolean) =>
  stylelint.lint({
    code,
    codeFilename: 'styles.ts',
    config,
    configBasedir: path.join(__dirname, '..'),
    fix,
  });

const source = `import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, cssVar }) => ({
  dot: css\`
    position: absolute;
    transition:
      left 0.4s \${cssVar.motionEaseInOut},
      top 0.4s \${cssVar.motionEaseInOut},
      opacity 0.2s;
    will-change: left, var(--lobeOffsetX);
  \`,
}));
`;

describe('liberty/use-logical-spec', () => {
  it('reports physical properties in transition values without lowercasing interpolations', async () => {
    const { results } = await lint(source, false);
    const texts = results[0].warnings
      .filter((w) => w.rule === 'liberty/use-logical-spec')
      .map((w) => w.text);

    expect(texts).toHaveLength(2);
    expect(texts[0]).toContain('inset-inline-start 0.4s ${cssVar.motionEaseInOut}');
    expect(texts.join('\n')).not.toContain('cssvar');
  });

  it('keeps CSS-in-JS interpolations and case-sensitive identifiers when fixing', async () => {
    const { code } = await lint(source, true);

    expect(code).toContain('inset-inline-start 0.4s ${cssVar.motionEaseInOut}');
    expect(code).toContain('inset-block-start 0.4s ${cssVar.motionEaseInOut}');
    expect(code).toContain('will-change: inset-inline-start, var(--lobeOffsetX);');
    expect(code).not.toMatch(/cssvar|motioneaseinout|lobeoffsetx/);
  });

  it('still converts physical properties', async () => {
    const { code } = await lint(source, true);

    expect(code).toContain('position: absolute;');
    expect((await lint('const a = css`\n  margin-left: 4px;\n`;\n', true)).code).toContain(
      'margin-inline-start: 4px;',
    );
  });
});
