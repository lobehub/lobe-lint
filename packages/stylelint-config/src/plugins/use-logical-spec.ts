import stylelint, { type Rule } from 'stylelint';
import logicalSpec from 'stylelint-use-logical-spec';

const { rule: original, ruleName } = logicalSpec as unknown as { rule: Rule; ruleName: string };

/** Properties whose *value* names other properties (e.g. `transition: left 1s`). */
const PROPS_WITH_PROPS_IN_VALUE = /^(transition(-property)?|will-change)$/i;
const SKIPPED_PROP = '--lobe-use-logical-spec-skip';

/**
 * `liberty/use-logical-spec` (stylelint-use-logical-spec 5.0.1, latest) also rewrites the
 * *values* of `transition`, `transition-property` and `will-change`, e.g.
 * `transition: left 0.4s, top 0.4s` -> `inset-inline-start 0.4s, inset-block-start 0.4s`.
 *
 * That is unsafe: the animated property must match the one that actually changes at runtime,
 * which lint cannot see (positions are often set via inline `style={{ left, top }}` or JS).
 * Rewriting the value silently kills the animation, and the upstream fix also lowercases the
 * whole value (breaking `${cssVar.motionEaseInOut}` interpolations).
 *
 * This wrapper keeps the rule name and every other check/fix, but hides those declarations from
 * the upstream rule: they are neither reported nor autofixed.
 */
const rule = ((primary, secondary, context) => {
  const run = original(primary, secondary, context);

  return (root, result) => {
    const skipped = new Map<{ prop: string }, string>();

    root.walkDecls(PROPS_WITH_PROPS_IN_VALUE, (decl) => {
      skipped.set(decl, decl.prop);
      decl.prop = SKIPPED_PROP;
    });

    try {
      return run(root, result);
    } finally {
      for (const [decl, prop] of skipped) decl.prop = prop;
    }
  };
}) as Rule;

rule.ruleName = ruleName;
rule.messages = original.messages;
rule.meta = original.meta;

export const useLogicalSpec = stylelint.createPlugin(ruleName, rule);
