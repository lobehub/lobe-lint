import path from 'node:path';

import stylelint from 'stylelint';
import { describe, expect, it } from 'vitest';

import config from '../src';

const lint = (code: string, fix: boolean, codeFilename = 'styles.css') =>
  stylelint.lint({
    code,
    codeFilename,
    config,
    configBasedir: path.join(__dirname, '..'),
    fix,
  });

const source = `.dot {
  position: absolute;
  transition:
    left 0.4s var(--motion-ease),
    top 0.4s var(--motion-ease),
    opacity 0.2s;
  will-change: left, var(--lobe-offset-x);
}
`;

describe('liberty/use-logical-spec', () => {
  it('does not report physical properties named in transition / will-change values', async () => {
    const { results } = await lint(source, false);
    const rules = results[0].warnings.map((w) => w.rule);

    expect(rules).not.toContain('liberty/use-logical-spec');
  });

  it('leaves transition / transition-property / will-change values untouched when fixing', async () => {
    const code = `${source}.b {
  transition-property: left, top;
  TRANSITION: right 1s;
}
`;
    const { code: output } = await lint(code, true);

    expect(output).toContain('left 0.4s var(--motion-ease),');
    expect(output).toContain('top 0.4s var(--motion-ease),');
    expect(output).toContain('will-change: left, var(--lobe-offset-x);');
    expect(output).toContain('transition-property: left, top;');
    expect(output).toMatch(/transition: right 1s;/i);
    expect(output).not.toContain('inset-');
  });

  it('still converts physical properties', async () => {
    const { code } = await lint(source, true);

    expect(code).toContain('position: absolute;');
    expect((await lint('.a {\n  margin-left: 4px;\n}\n', true)).code).toContain(
      'margin-inline-start: 4px;',
    );
  });

  it('still reports physical properties outside of transition values', async () => {
    const { results } = await lint('.a {\n  left: 0;\n  transition: left 1s;\n}\n', false);
    const warnings = results[0].warnings.filter((w) => w.rule === 'liberty/use-logical-spec');

    expect(warnings).toHaveLength(1);
    expect(warnings[0].line).toBe(2);
  });

  it('applies to Less files', async () => {
    const { code } = await lint('.a {\n  margin-left: @gap;\n}\n', true, 'styles.less');

    expect(code).toContain('margin-inline-start: @gap;');
  });
});

describe('postcss-styled-syntax removal', () => {
  it('no longer configures a CSS-in-JS syntax for script files', () => {
    const syntaxes = (config.overrides ?? []).map((override) => override.customSyntax);

    expect(syntaxes).not.toContain('postcss-styled-syntax');
  });
});
