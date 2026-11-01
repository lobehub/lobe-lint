import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import migrate from '@oxlint/migrate';
import { type Linter } from 'eslint';
import prettier from 'prettier';

import { a11y } from '../../eslint-config/src/configs/a11y';
import { commonjs } from '../../eslint-config/src/configs/commonjs';
import { eslintCommentsConfig } from '../../eslint-config/src/configs/eslint-comments';
import { imports } from '../../eslint-config/src/configs/imports';
import { javascript } from '../../eslint-config/src/configs/javascript';
import { next } from '../../eslint-config/src/configs/next';
import { react } from '../../eslint-config/src/configs/react';
import { reactNative } from '../../eslint-config/src/configs/react-native';
import { sorting } from '../../eslint-config/src/configs/sorting';
import { stylex } from '../../eslint-config/src/configs/stylex';
import { typescript } from '../../eslint-config/src/configs/typescript';
import { unicorn } from '../../eslint-config/src/configs/unicorn';
import { unused } from '../../eslint-config/src/configs/unused';
import { GLOB_IGNORES, GLOB_TEST } from '../../eslint-config/src/globs';
import { PLUGIN_NAMES } from '../src/plugin-names';
import { type Layer, type PluginKey } from '../src/types';

type RuleEntry = Linter.RuleEntry;
type Override = Layer['overrides'][number];
type SkippedCategory = 'js-plugins' | 'not-implemented' | 'nursery' | 'type-aware' | 'unsupported';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OXLINT = path.join(ROOT, 'node_modules/.bin/oxlint');
const OUTPUT = path.join(ROOT, 'src/generated/layers.ts');

const LAYERS: Record<string, { configs: () => Linter.Config[]; typeAware?: boolean }> = {
  a11y: { configs: () => a11y({ a11y: true, react: true }) },
  comments: { configs: () => eslintCommentsConfig() },
  commonjs: { configs: () => commonjs() },
  imports: { configs: () => imports({ sortImports: false }) },
  importsSorted: { configs: () => imports({ sortImports: true }) },
  javascript: { configs: () => javascript() },
  next: { configs: () => next({ next: true }) },
  react: { configs: () => react({ react: true }) },
  reactCompiler: { configs: () => react({ react: true, reactCompiler: true }) },
  reactNative: { configs: () => reactNative({ reactNative: true }) },
  reactNext: { configs: () => react({ react: 'next' }) },
  reactNextCompiler: { configs: () => react({ react: 'next', reactCompiler: true }) },
  reactRemix: { configs: () => react({ react: 'remix' }) },
  reactRemixCompiler: { configs: () => react({ react: 'remix', reactCompiler: true }) },
  sorting: { configs: () => sorting({ sortKeys: true }) },
  stylex: { configs: () => stylex({ stylex: true }) },
  typescriptRecommended: { configs: () => typescript({ typescript: true }) },
  typescriptRecommendedTypeChecked: {
    configs: () => typescript({ typeChecked: true, typescript: true }),
    typeAware: true,
  },
  typescriptStrict: { configs: () => typescript({ typescript: 'strict' }) },
  typescriptStrictTypeChecked: {
    configs: () => typescript({ typeChecked: true, typescript: 'strict' }),
    typeAware: true,
  },
  unicorn: { configs: () => unicorn() },
  unused: { configs: () => unused() },
};

const JS_PLUGIN_KEYS: Record<string, PluginKey> = {
  '@eslint-react/eslint-plugin': 'eslint-react',
  'eslint-plugin-perfectionist': 'perfectionist',
  'eslint-plugin-react-native': 'react-native',
  'eslint-plugin-simple-import-sort': 'simple-import-sort',
  '@stylexjs/eslint-plugin': 'stylex',
};

const EXTRACTED: Record<string, { plugin: PluginKey; rule: string } | null> = {
  '@eslint-community/eslint-comments/disable-enable-pair': null,
  '@eslint-community/eslint-comments/no-aggregating-enable': null,
  '@eslint-community/eslint-comments/no-duplicate-disable': {
    plugin: 'lobe',
    rule: 'lobe/no-duplicate-disable',
  },
  '@eslint-community/eslint-comments/no-unlimited-disable': {
    plugin: 'lobe',
    rule: 'lobe/no-unlimited-disable',
  },
  '@eslint-community/eslint-comments/no-unused-disable': null,
  '@eslint-community/eslint-comments/no-unused-enable': null,
  'react/jsx-sort-props': { plugin: 'react-js', rule: 'react-js/jsx-sort-props' },
};

const DROPPED_PLUGINS = new Set(['@eslint-community/eslint-comments', 'unused-imports']);

const ALLOWED_SKIPS: Partial<Record<SkippedCategory, Set<string>>> = {
  'not-implemented': new Set(['@next/next/no-location-assign-relative-destination']),
  'unsupported': new Set([
    'no-dupe-args',
    'no-octal',
    'react-hooks/config',
    'react-hooks/gating',
    'unicorn/better-regex',
  ]),
};

// no-useless-assignment is left out until oxc-project/oxc#28603 (catch-block false positive) is fixed.
const NURSERY_ALLOWED = new Set(['no-restricted-exports']);

// oxlint's no-immediate-mutation also flags `new Map(source)` followed by `.set()`, which the
// ESLint rule accepts; an error here would break downstream CI on code that passes today.
const SEVERITY_OVERRIDES: Record<string, 'warn'> = {
  'unicorn/no-immediate-mutation': 'warn',
};

// ESLint never reported `(result?.value as T).field` in tests; oxlint does, and tests use it to assert.
const EXTRA_OVERRIDES: Record<string, Override[]> = {
  javascript: [{ files: GLOB_TEST, rules: { 'no-unsafe-optional-chaining': 'off' } }],
};

const UNSUPPORTED_OPTIONS: Record<string, string[]> = {
  'jsx-a11y/control-has-associated-label': ['includeRoles'],
};

const stripUnsupportedOptions = (rule: string, entry: unknown) => {
  const keys = UNSUPPORTED_OPTIONS[rule];
  if (!keys || !Array.isArray(entry)) return entry;
  return entry.map((option) =>
    option && typeof option === 'object'
      ? Object.fromEntries(Object.entries(option).filter(([key]) => !keys.includes(key)))
      : option,
  );
};

const TYPE_AWARE_ESLINT_REACT_RULES = new Set(
  [
    'no-implicit-children',
    'no-implicit-key',
    'no-implicit-ref',
    'no-leaked-conditional-rendering',
    'no-unused-props',
  ].flatMap((rule) => [`@eslint-react/${rule}`, `@eslint-react/x-${rule}`]),
);

const severityOf = (entry: RuleEntry | undefined) => (Array.isArray(entry) ? entry[0] : entry);
const isOff = (entry: RuleEntry | undefined) => {
  const severity = severityOf(entry);
  return severity === 'off' || severity === 0;
};

const withSeverity = (rule: string, entry: unknown) => {
  const severity = SEVERITY_OVERRIDES[rule];
  if (!severity || isOff(entry as RuleEntry)) return entry;
  return Array.isArray(entry) ? [severity, ...entry.slice(1)] : severity;
};

function toRestrictedExports(entry: RuleEntry): RuleEntry {
  if (isOff(entry)) return 'off';
  const selectors = Array.isArray(entry) ? entry.slice(1) : [];
  const onlyDefaultExport = selectors.every(
    (s) =>
      (typeof s === 'string' ? s : (s as { selector?: string }).selector) ===
      'ExportDefaultDeclaration',
  );
  if (!onlyDefaultExport) {
    throw new Error(
      `no-restricted-syntax with selectors other than ExportDefaultDeclaration: ${JSON.stringify(entry)}`,
    );
  }
  return [severityOf(entry)!, { restrictDefaultExports: { direct: true } }];
}

function prepare(configs: Linter.Config[]) {
  const extracted: Override[] = [];
  const prepared = configs.map((config) => {
    if (config.files && config.ignores) {
      throw new Error(
        `@oxlint/migrate drops per-object ignores; map them to excludeFiles first: ${JSON.stringify(config.files)}`,
      );
    }
    if (!config.rules && !config.plugins) return config;

    const rules: Linter.RulesRecord = {};
    const extractedRules: Partial<Record<PluginKey, Record<string, RuleEntry>>> = {};

    for (const [name, entry] of Object.entries(config.rules ?? {})) {
      if (entry === undefined) continue;
      if (name === 'no-restricted-syntax') {
        rules['no-restricted-exports'] = toRestrictedExports(entry);
      } else if (name === 'unused-imports/no-unused-vars') {
        rules['no-unused-vars'] = entry;
      } else if (name === 'unused-imports/no-unused-imports') {
        continue;
      } else if (name in EXTRACTED) {
        const target = EXTRACTED[name];
        if (target) (extractedRules[target.plugin] ??= {})[target.rule] = entry;
      } else if (name.startsWith('@eslint-community/eslint-comments/')) {
        throw new Error(`Unmapped eslint-comments rule: ${name}`);
      } else {
        rules[name] = entry;
      }
    }

    for (const [plugin, pluginRules] of Object.entries(extractedRules)) {
      extracted.push({
        files: (config.files?.flat() as string[] | undefined) ?? ['**/*'],
        jsPlugins: [plugin],
        rules: pluginRules,
      });
    }

    const plugins = Object.fromEntries(
      Object.entries(config.plugins ?? {}).filter(([name]) => !DROPPED_PLUGINS.has(name)),
    );
    return { ...config, files: config.files ?? ['**/*'], plugins, rules };
  });

  return { extracted, prepared };
}

const expandExtglob = (glob: string) => {
  const match = /^(.*)\?\(\[cm\]\)(\w+)$/.exec(glob);
  return match
    ? [match[1] + match[2], `${match[1]}c${match[2]}`, `${match[1]}m${match[2]}`]
    : [glob];
};

function readNurseryRules() {
  const rules = JSON.parse(
    execFileSync(OXLINT, ['--rules', '--format', 'json'], { encoding: 'utf8' }),
  ) as {
    category: string;
    scope: string;
    value: string;
  }[];
  return new Set(
    rules
      .filter((rule) => rule.category === 'nursery')
      .flatMap((rule) =>
        rule.scope === 'eslint'
          ? [rule.value, `eslint/${rule.value}`]
          : [`${rule.scope}/${rule.value}`],
      ),
  );
}

async function convert(name: string, nursery: Set<string>) {
  const { configs, typeAware = false } = LAYERS[name];
  const { extracted, prepared } = prepare(configs());

  const skipped: Record<SkippedCategory, string[]> = {
    'js-plugins': [],
    'not-implemented': [],
    'nursery': [],
    'type-aware': [],
    'unsupported': [],
  };
  const warnings: string[] = [];
  const reporter = {
    addWarning: (message: string) => warnings.push(message),
    getSkippedRulesByCategory: () => skipped,
    getWarnings: () => warnings,
    markSkipped: (rule: string, category: SkippedCategory) => skipped[category].push(rule),
    removeSkipped: (rule: string, category: SkippedCategory) => {
      skipped[category] = skipped[category].filter((r) => r !== rule);
    },
  };

  const result = await migrate(prepared, undefined, {
    jsPlugins: true,
    reporter,
    typeAware,
    withNursery: true,
  });

  const unexpected = (Object.entries(skipped) as [SkippedCategory, string[]][]).flatMap(
    ([category, rules]) =>
      rules
        .filter((rule) => category !== 'js-plugins' && !ALLOWED_SKIPS[category]?.has(rule))
        .map((rule) => `${category}: ${rule}`),
  );
  if (unexpected.length > 0) {
    throw new Error(
      `Layer "${name}" dropped rules without a decision:\n  ${unexpected.join('\n  ')}`,
    );
  }

  const cleanRules = (rules: Record<string, unknown> = {}) =>
    Object.fromEntries(
      Object.entries(rules)
        .filter(([rule]) => {
          if (TYPE_AWARE_ESLINT_REACT_RULES.has(rule)) return false;
          return !nursery.has(rule) || NURSERY_ALLOWED.has(rule.replace(/^eslint\//, ''));
        })
        .map(([rule, entry]) => [rule, withSeverity(rule, stripUnsupportedOptions(rule, entry))]),
    );

  const mapJsPlugins = (entries: unknown[] = []) =>
    entries.map((entry) => {
      const key = typeof entry === 'string' ? JS_PLUGIN_KEYS[entry] : undefined;
      if (!key)
        throw new Error(`Layer "${name}" uses an unbundled JS plugin: ${JSON.stringify(entry)}`);
      return key;
    });

  const overrides: Override[] = [];
  const topRules = cleanRules(result.rules as Record<string, unknown>);
  if (
    Object.keys(topRules).length > 0 ||
    result.env ||
    result.globals ||
    result.jsPlugins?.length
  ) {
    overrides.push({
      env: result.env,
      files: ['**/*'],
      globals: result.globals,
      jsPlugins: result.jsPlugins?.length ? mapJsPlugins(result.jsPlugins) : undefined,
      rules: topRules,
    } as Override);
  }

  for (const override of result.overrides ?? []) {
    const { categories: _categories, ...rest } = override as Override & { categories?: unknown };
    overrides.push({
      ...rest,
      files: rest.files.flatMap(expandExtglob),
      jsPlugins: rest.jsPlugins?.length ? mapJsPlugins(rest.jsPlugins) : undefined,
      rules: cleanRules(rest.rules as Record<string, unknown>),
    } as Override);
  }

  for (const override of extracted) {
    overrides.push({ ...override, files: override.files.flatMap(expandExtglob) });
  }

  overrides.push(...(EXTRA_OVERRIDES[name] ?? []));

  const layer: Layer = {
    overrides: overrides.map(
      (override) =>
        Object.fromEntries(
          Object.entries(override).filter(([, value]) => value !== undefined),
        ) as Override,
    ),
    plugins: (result.plugins ?? []) as Layer['plugins'],
    ...(result.settings &&
      Object.keys(result.settings).length > 0 && { settings: result.settings }),
  };

  return { layer, warnings };
}

function pruneUnknownRules(layers: Record<string, Layer>) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'oxlint-config-'));
  const probe = path.join(dir, 'probe.tsx');
  fs.writeFileSync(probe, 'export const value = 1;\n');
  const configFile = path.join(dir, '.oxlintrc.json');
  const pruned: string[] = [];

  for (let pass = 0; pass < 10; pass++) {
    const all = Object.values(layers);
    const config = {
      overrides: all.flatMap((layer) =>
        layer.overrides.map((override) => ({
          ...override,
          jsPlugins: override.jsPlugins?.map((key) => ({
            name: PLUGIN_NAMES[key],
            specifier: path.join(ROOT, `src/plugins/${key}.ts`),
          })),
        })),
      ),
      plugins: [...new Set(all.flatMap((layer) => layer.plugins))],
    };
    fs.writeFileSync(configFile, JSON.stringify(config));

    let output: string;
    try {
      output = execFileSync(OXLINT, ['-c', configFile, probe], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: 'pipe',
      });
    } catch (error) {
      const { stderr, stdout } = error as { stderr: string; stdout: string };
      output = `${stdout}${stderr}`;
    }

    const missing = new Set(
      [...output.matchAll(/Rule '([^']+)' not found in plugin '([^']+)'/g)].map(
        ([, rule, plugin]) => `${plugin}/${rule}`,
      ),
    );
    if (/Failed to (?:parse|build|load)/.test(output) && missing.size === 0) {
      throw new Error(`oxlint rejected the generated config:\n${output.slice(0, 2000)}`);
    }
    if (missing.size === 0) break;

    for (const layer of all) {
      for (const override of layer.overrides) {
        for (const rule of Object.keys(override.rules ?? {})) {
          const normalized = rule.includes('/') ? rule : `eslint/${rule}`;
          if (missing.has(rule) || missing.has(normalized)) {
            delete override.rules![rule];
            pruned.push(rule);
          }
        }
      }
    }
  }

  fs.rmSync(dir, { force: true, recursive: true });
  return [...new Set(pruned)];
}

const nursery = readNurseryRules();
const layers: Record<string, Layer> = {};
for (const name of Object.keys(LAYERS).sort()) {
  const { layer, warnings } = await convert(name, nursery);
  layers[name] = layer;
  for (const warning of warnings) console.warn(`[${name}] ${warning}`);
}

const pruned = pruneUnknownRules(layers);
if (pruned.length > 0) console.warn(`Pruned rules unknown to oxlint: ${pruned.join(', ')}`);

const body = [
  '// Generated by scripts/generate-layers.ts from @lobehub/eslint-config. Do not edit by hand.',
  "import { type Layer } from '../types';",
  `export const ignorePatterns: string[] = ${JSON.stringify(GLOB_IGNORES)};`,
  ...Object.entries(layers).map(
    ([name, layer]) => `export const ${name}: Layer = ${JSON.stringify(layer)};`,
  ),
].join('\n\n');

const prettierConfig = await prettier.resolveConfig(OUTPUT);
fs.writeFileSync(OUTPUT, await prettier.format(body, { ...prettierConfig, filepath: OUTPUT }));

const ruleCount = Object.values(layers).reduce(
  (sum, layer) =>
    sum + layer.overrides.reduce((n, override) => n + Object.keys(override.rules ?? {}).length, 0),
  0,
);
console.log(
  `Generated ${Object.keys(layers).length} layers (${ruleCount} rule entries) into ${path.relative(ROOT, OUTPUT)}`,
);
