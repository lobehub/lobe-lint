interface Comment {
  loc: object;
  value: string;
}

interface RuleContext {
  report: (descriptor: { data?: Record<string, string>; loc: object; messageId: string }) => void;
  sourceCode: { getAllComments: () => Comment[] };
}

interface Directive {
  kind: string;
  rules: string[];
}

const DIRECTIVE_KINDS = new Set(
  ['disable', 'disable-line', 'disable-next-line', 'enable'].flatMap((kind) => [
    `eslint-${kind}`,
    `oxlint-${kind}`,
  ]),
);

const parseDirective = (comment: Comment): Directive | undefined => {
  const text = comment.value.trim();
  const kind = text.split(/\s/, 1)[0];
  if (!DIRECTIVE_KINDS.has(kind)) return undefined;

  const [ruleList] = text.slice(kind.length).split(/\s-{2,}\s/);
  return {
    kind,
    rules: ruleList
      .split(',')
      .map((rule) => rule.trim())
      .filter(Boolean),
  };
};

const noUnlimitedDisable = {
  create(context: RuleContext) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          const directive = parseDirective(comment);
          if (directive?.kind.includes('disable') && directive.rules.length === 0) {
            context.report({
              data: { kind: directive.kind },
              loc: comment.loc,
              messageId: 'unlimited',
            });
          }
        }
      },
    };
  },
  meta: {
    messages: {
      unlimited: "Unexpected unlimited '{{kind}}' comment. Specify some rule names to disable.",
    },
    type: 'suggestion',
  },
};

const noDuplicateDisable = {
  create(context: RuleContext) {
    return {
      Program() {
        const disabled = new Set<string>();
        for (const comment of context.sourceCode.getAllComments()) {
          const directive = parseDirective(comment);
          if (directive?.kind !== 'eslint-disable' && directive?.kind !== 'oxlint-disable')
            continue;

          for (const rule of directive.rules) {
            if (disabled.has(rule)) {
              context.report({ data: { rule }, loc: comment.loc, messageId: 'duplicate' });
            }
            disabled.add(rule);
          }
        }
      },
    };
  },
  meta: {
    messages: { duplicate: "'{{rule}}' rule has been disabled already." },
    type: 'problem',
  },
};

const plugin = {
  meta: { name: 'lobe' },
  rules: {
    'no-duplicate-disable': noDuplicateDisable,
    'no-unlimited-disable': noUnlimitedDisable,
  },
};

export { plugin as default };
