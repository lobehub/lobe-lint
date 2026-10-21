import stylelint, { type Rule } from 'stylelint';
import logicalSpec from 'stylelint-use-logical-spec';

const { rule: original, ruleName } = logicalSpec as unknown as { rule: Rule; ruleName: string };

/** Properties whose *value* `liberty/use-logical-spec` rewrites (e.g. `transition: left 1s`). */
const PROPS_WITH_PROPS_IN_VALUE = /^(transition(-property)?|will-change)$/i;
const PLACEHOLDER = /__lobe_keep_(\d+)__/g;

const placeholder = (kept: string[], text: string) => {
  kept.push(text);
  return `__lobe_keep_${kept.length - 1}__`;
};

/**
 * Hide every part of a value that must survive verbatim behind lowercase placeholders:
 * CSS-in-JS interpolations (`${token.motionEaseInOut}`) and any identifier containing an
 * uppercase letter (custom properties such as `var(--myVar)` are case-sensitive).
 */
export const protectValue = (value: string, kept: string[]): string => {
  let out = '';
  let index = 0;

  while (index < value.length) {
    const start = value.indexOf('${', index);
    if (start === -1) {
      out += value.slice(index);
      break;
    }

    let depth = 0;
    let end = start + 1;
    for (; end < value.length; end++) {
      if (value[end] === '{') depth++;
      else if (value[end] === '}' && --depth === 0) break;
    }

    if (end >= value.length) {
      out += value.slice(index);
      break;
    }

    out += value.slice(index, start) + placeholder(kept, value.slice(start, end + 1));
    index = end + 1;
  }

  return out.replaceAll(/[\w-]*[A-Z][\w-]*/g, (word) => placeholder(kept, word));
};

export const restoreValue = (value: string, kept: string[]): string =>
  value.replaceAll(PLACEHOLDER, (match, i: string) => kept[Number(i)] ?? match);

/**
 * `stylelint-use-logical-spec` (5.0.1, latest) lowercases the whole value of `transition`,
 * `transition-property` and `will-change` before rewriting physical property names, so its
 * autofix turns `left 0.4s ${cssVar.motionEaseInOut}` into
 * `inset-inline-start 0.4s ${cssvar.motioneaseinout}` and breaks CSS-in-JS code.
 *
 * This wrapper keeps the same rule name and behaviour, but shields case-sensitive parts of those
 * values from the upstream rule and restores them afterwards (in both fixes and messages).
 */
const rule = ((primary, secondary, context) => {
  const run = original(primary, secondary, context);

  return (root, result) => {
    const protectedDecls = new Map<{ value: string }, string[]>();

    root.walkDecls(PROPS_WITH_PROPS_IN_VALUE, (decl) => {
      const kept: string[] = [];
      const value = protectValue(decl.value, kept);
      if (kept.length === 0) return;
      decl.value = value;
      protectedDecls.set(decl, kept);
    });

    try {
      return run(root, result);
    } finally {
      for (const [decl, kept] of protectedDecls) decl.value = restoreValue(decl.value, kept);

      for (const warning of result.messages) {
        const kept =
          (warning as { rule?: string }).rule === ruleName &&
          protectedDecls.get(warning.node as unknown as { value: string });
        if (kept) warning.text = restoreValue(warning.text, kept);
      }
    }
  };
}) as Rule;

rule.ruleName = ruleName;
rule.messages = original.messages;
rule.meta = original.meta;

export const useLogicalSpec = stylelint.createPlugin(ruleName, rule);
