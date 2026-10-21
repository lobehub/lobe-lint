import { type ESLint, type Rule } from 'eslint';
import { importX } from 'eslint-plugin-import-x';

type Specifier = Rule.Node & { importKind?: 'type' | 'value'; type: string };
type ImportDeclaration = Rule.Node & {
  importKind?: 'type' | 'value';
  source: Rule.Node & { value: string };
  specifiers: Specifier[];
};

const hasInlineType = (node: ImportDeclaration) =>
  node.specifiers.some((s) => s.importKind === 'type');

/** `import { type A, b }`: a value import that also carries inline `type` specifiers. */
const isMixedImport = (node: ImportDeclaration) =>
  node.importKind !== 'type' &&
  hasInlineType(node) &&
  node.specifiers.some((s) => s.importKind !== 'type');

/** `import { type A, type B }`: a value import where every specifier is inline `type`. */
const isAllInlineTypeImport = (node: ImportDeclaration) =>
  node.importKind !== 'type' &&
  node.specifiers.length > 0 &&
  node.specifiers.every((s) => s.importKind === 'type');

/** `import type { A }` */
const isNamedTypeImport = (node: ImportDeclaration) =>
  node.importKind === 'type' && node.specifiers.every((s) => s.type === 'ImportSpecifier');

/**
 * Hide the inline `type` markers of a mixed import from `import-x/no-duplicates`, so it is grouped
 * with the other value imports of that module instead of with `import type { … }`.
 */
const asValueImport = (node: ImportDeclaration): ImportDeclaration => {
  if (!isMixedImport(node)) return node;

  const specifiers = node.specifiers.map((s) =>
    s.importKind === 'type' ? { ...s, importKind: 'value' as const } : s,
  );

  return new Proxy(node, {
    get: (target, key) => (key === 'specifiers' ? specifiers : Reflect.get(target, key)),
  });
};

/**
 * Merge `import { type A, type B } from 'x'` into `import type { C } from 'x'` as
 * `import type { C, A, B } from 'x'` (the upstream fixer would keep the inline `type` keywords).
 */
const mergeIntoTypeImport = (
  group: ImportDeclaration[],
  sourceCode: Rule.RuleContext['sourceCode'],
): Rule.ReportFixer | null => {
  const target = group.find((node) => node.importKind === 'type');
  if (!target || target.specifiers.length === 0) return null;
  if (group.some((node) => sourceCode.getCommentsInside(node).length > 0)) return null;

  const closeBrace = sourceCode.getLastToken(target, (token) => token.value === '}');
  const lastToken = closeBrace && sourceCode.getTokenBefore(closeBrace);
  if (!lastToken) return null;

  const rest = group.filter((node) => node !== target);
  const names = rest.flatMap((node) =>
    node.specifiers.map((s) => sourceCode.getText(s).replace(/^type\s+/, '')),
  );

  return (fixer) => [
    fixer.insertTextAfter(lastToken, `${lastToken.value === ',' ? ' ' : ', '}${names.join(', ')}`),
    ...rest.map((node) => {
      const end = sourceCode.text[node.range![1]] === '\n' ? node.range![1] + 1 : node.range![1];
      return fixer.removeRange([node.range![0], end]);
    }),
  ];
};

const noDuplicates = importX.rules['no-duplicates'] as unknown as Rule.RuleModule;

/**
 * `import-x/no-duplicates` (without `prefer-inline`) puts every import that contains an inline
 * `type` specifier into the same bucket as `import type { … }`. Its autofix then merges them into
 * `import type { C, type A, b }`: invalid TypeScript (TS2206 / TS1361) that also turns value
 * imports into type-only ones. Together with `@typescript-eslint/consistent-type-imports`
 * (`fixStyle: 'separate-type-imports'`), which creates new `import type` lines, this broke a lot of
 * code on `eslint --fix`.
 *
 * The wrapper keeps the rule id and options and fixes both cases:
 * - mixed imports (`import { type A, b }`) are grouped with the value imports of the module, which
 *   is safe to merge because the fixer copies specifier text verbatim;
 * - pure inline-type imports (`import { type A }`) are still grouped with `import type { … }`, but
 *   merged into it with the inline `type` keywords stripped.
 */
const patchedNoDuplicates: Rule.RuleModule = {
  ...noDuplicates,
  create(context) {
    const seen: ImportDeclaration[] = [];
    const proxies = new WeakMap<Rule.Node, ImportDeclaration>();

    const report: Rule.RuleContext['report'] = (descriptor) => {
      if (!('node' in descriptor) || !descriptor.fix) return context.report(descriptor);

      const first = (descriptor.node as Rule.Node).parent as ImportDeclaration;
      const group = seen.filter(
        (node) =>
          node.parent === first.parent &&
          node.source.value === first.source.value &&
          (isNamedTypeImport(node) || isAllInlineTypeImport(node)),
      );

      if (group.some(isNamedTypeImport) && group.some(isAllInlineTypeImport)) {
        return context.report({
          ...descriptor,
          fix: mergeIntoTypeImport(group, context.sourceCode),
        });
      }

      return context.report(descriptor);
    };

    // The rule context is frozen, so derive a new one instead of proxying it.
    const listeners = noDuplicates.create(
      Object.create(context, { report: { value: report } }) as Rule.RuleContext,
    );
    const onImport = listeners.ImportDeclaration as ((node: Rule.Node) => void) | undefined;

    if (!onImport) return listeners;

    return {
      ...listeners,
      ImportDeclaration(node: Rule.Node) {
        seen.push(node as ImportDeclaration);
        let proxy = proxies.get(node);
        if (!proxy) {
          proxy = asValueImport(node as ImportDeclaration);
          proxies.set(node, proxy);
        }
        onImport(proxy);
      },
    } as Rule.RuleListener;
  },
};

export const importXPlugin: ESLint.Plugin = {
  ...(importX as unknown as ESLint.Plugin),
  rules: {
    ...(importX.rules as unknown as Record<string, Rule.RuleModule>),
    'no-duplicates': patchedNoDuplicates,
  },
};
