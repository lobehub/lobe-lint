/**
 * Builds the docs site rule pages (`/rules`, `/rules/<tool>`).
 *
 * Every config is imported from the workspace sources and resolved with each tool's own API, so the
 * pages follow the code: ESLint `calculateConfigForFile`, Stylelint `resolveConfig`, Prettier
 * `getSupportInfo`, `@commitlint/load`, and the remark presets expanded plugin by plugin.
 *
 * Writes (all gitignored):
 * - docs/rules/data/<tool>.json  one file per tool, imported only by that tool's page
 * - docs/rules/<tool>.mdx        one page per tool, with a plain-text summary for llms.txt / skills
 * - docs/rules/index.mdx         index of the tool pages with rule counts
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import type {
  PrettierData,
  PrettierOption,
  RuleEntry,
  RuleLevel,
  RulePreset,
  RuleSource,
  RuleTool,
} from '../docs/rules/types';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRequire = (dir: string) => createRequire(path.join(root, dir, 'package.json'));
const importFrom = async (require: NodeRequire, id: string) =>
  import(pathToFileURL(require.resolve(id)).href);
const readVersion = (require: NodeRequire, id: string): string | undefined =>
  readPackageJson([require], id)?.version;

/** Reads a dependency's package.json by walking up from its resolved entry (exports may hide it). */
const readPackageJson = (requires: NodeRequire[], id: string): Record<string, any> | undefined => {
  for (const require of requires) {
    let entry: string;
    try {
      entry = require.resolve(id);
    } catch {
      continue;
    }
    let dir = path.dirname(entry);
    while (dir !== path.dirname(dir)) {
      try {
        const json = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
        if (json.name === id) return json;
      } catch {
        // keep walking up
      }
      dir = path.dirname(dir);
    }
  }
  return undefined;
};

/** JSON-safe copy of rule options (RegExp and functions become strings). */
const toJson = (value: unknown): unknown =>
  value === undefined
    ? undefined
    : JSON.parse(
        JSON.stringify(value, (_key, item) => {
          if (item instanceof RegExp) return String(item);
          if (typeof item === 'function') return `[Function ${item.name || 'anonymous'}]`;
          return item;
        }),
      );

const LEVEL_WEIGHT: Record<RuleLevel, number> = { error: 2, off: 0, warn: 1 };

const eslintLevel = (value: unknown): RuleLevel => {
  const severity = Array.isArray(value) ? value[0] : value;
  if (severity === 2 || severity === 'error') return 'error';
  if (severity === 1 || severity === 'warn') return 'warn';
  return 'off';
};

const sortRules = (rules: RuleEntry[]) =>
  rules.sort((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id));

/** Picks the strongest level over the sample files; `kinds` is kept only when files disagree. */
const mergeKinds = (kinds: Record<string, RuleLevel>) => {
  const levels = Object.values(kinds);
  const level = levels.reduce<RuleLevel>(
    (best, current) => (LEVEL_WEIGHT[current] > LEVEL_WEIGHT[best] ? current : best),
    'off',
  );
  const uniform = levels.every((item) => item === levels[0]);
  return { kinds: uniform ? undefined : kinds, level };
};

// ---------------------------------------------------------------------------------------------
// ESLint
// ---------------------------------------------------------------------------------------------

const ESLINT_PRESETS: RulePreset[] = [
  {
    description: 'defineConfig() with defaults: JavaScript, TypeScript and YAML.',
    id: 'base',
    label: 'Base',
    options: {},
  },
  {
    description: 'React, React Hooks and React Refresh rules for .jsx / .tsx files.',
    id: 'react',
    label: 'React',
    options: { react: true },
  },
  {
    description: 'React tuned for Next.js, plus @next/eslint-plugin-next.',
    id: 'next',
    label: 'Next.js',
    options: { next: true, react: 'next' },
  },
  {
    description: 'React tuned for Expo, plus React Native rules.',
    id: 'react-native',
    label: 'React Native',
    options: { react: 'expo', reactNative: true },
  },
  {
    description:
      'Every option on: Next.js, a11y, React Compiler, MDX, strict type-checked TypeScript.',
    id: 'all',
    label: 'All options',
    options: {
      a11y: true,
      mdx: true,
      next: true,
      react: 'next',
      reactCompiler: true,
      typeChecked: true,
      typescript: 'strict',
    },
  },
];

const ESLINT_KINDS: Record<string, string> = {
  'config': 'vite.config.ts',
  'js': 'src/index.js',
  'jsx/tsx': 'src/App.tsx',
  'mdx': 'docs/index.mdx',
  'next-app': 'app/page.tsx',
  'test': 'src/index.test.ts',
  'ts': 'src/index.ts',
  'yaml': 'config.yml',
};

const pluginOf = (ruleId: string, prefixes: string[]) => {
  if (!ruleId.includes('/')) return 'eslint';
  const match = prefixes
    .filter((prefix) => ruleId.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length)[0];
  return match ?? ruleId.slice(0, ruleId.lastIndexOf('/'));
};

const configLabel = (config: Record<string, any>, index: number) => {
  if (config.name) return config.name as string;
  const plugins = Object.keys(config.plugins ?? {});
  if (plugins.length > 0) return `lobehub/${plugins.join('+')}`;
  const prefixes = [
    ...new Set(
      Object.keys(config.rules ?? {}).map((id) => (id.includes('/') ? id.split('/')[0] : 'core')),
    ),
  ];
  return `lobehub/${prefixes.join('+') || 'config'} #${index}`;
};

async function buildEslint(): Promise<RuleTool> {
  const eslintRequire = createRequire(path.join(root, 'package.json'));
  const { ESLint } = await import('eslint');
  const { defineConfig } = await import('../packages/eslint-config/src/index');

  let builtinRules = new Map<string, any>();
  try {
    builtinRules = (await import('eslint/use-at-your-own-risk')).builtinRules as Map<string, any>;
  } catch {
    console.warn('[rules] eslint/use-at-your-own-risk unavailable, core rule meta skipped');
  }

  const rules: Record<string, RuleEntry[]> = {};

  for (const preset of ESLINT_PRESETS) {
    const configs = defineConfig(preset.options as never) as Record<string, any>[];
    const eslint = new ESLint({
      cwd: root,
      overrideConfig: configs as never,
      overrideConfigFile: true,
    });

    const plugins = new Map<string, any>();
    for (const config of configs) {
      for (const [prefix, plugin] of Object.entries(config.plugins ?? {}))
        plugins.set(prefix, plugin);
    }
    const prefixes = [...plugins.keys()];

    const resolved: Record<string, Record<string, unknown>> = {};
    for (const [kind, file] of Object.entries(ESLINT_KINDS)) {
      const config = await eslint.calculateConfigForFile(path.join(root, file));
      if (config?.rules) resolved[kind] = config.rules;
    }

    const ids = new Set(Object.values(resolved).flatMap((item) => Object.keys(item)));
    const entries: RuleEntry[] = [];

    for (const id of ids) {
      const kinds: Record<string, RuleLevel> = {};
      for (const [kind, kindRules] of Object.entries(resolved)) {
        if (id in kindRules) kinds[kind] = eslintLevel(kindRules[id]);
      }
      const { kinds: differing, level } = mergeKinds(kinds);
      const strongestKind = Object.keys(kinds).find((kind) => kinds[kind] === level)!;
      const value = resolved[strongestKind]![id];
      const options = Array.isArray(value) && value.length > 1 ? toJson(value.slice(1)) : undefined;

      const sources: RuleSource[] = configs.flatMap((config, index) =>
        config.rules && id in config.rules
          ? [
              {
                files: config.files?.flat?.().map(String),
                label: configLabel(config, index),
                level: eslintLevel(config.rules[id]),
              },
            ]
          : [],
      );

      const group = pluginOf(id, prefixes);
      const ruleName = group === 'eslint' ? id : id.slice(group.length + 1);
      const meta =
        group === 'eslint'
          ? builtinRules.get(id)?.meta
          : plugins.get(group)?.rules?.[ruleName]?.meta;

      entries.push({
        deprecated: meta?.deprecated ? true : undefined,
        description: meta?.docs?.description,
        fixable: meta?.fixable ? true : undefined,
        group,
        id,
        kinds: differing,
        level,
        options,
        sources,
        suggestions: meta?.hasSuggestions ? true : undefined,
        url: typeof meta?.docs?.url === 'string' ? meta.docs.url : undefined,
      });
    }

    rules[preset.id] = sortRules(entries);
  }

  return {
    description:
      'Flat config from defineConfig(), resolved per sample file with ESLint calculateConfigForFile().',
    id: 'eslint',
    kinds: ESLINT_KINDS,
    packageName: '@lobehub/eslint-config',
    presets: ESLINT_PRESETS,
    rules,
    title: 'ESLint',
    version: readVersion(eslintRequire, 'eslint'),
  };
}

// ---------------------------------------------------------------------------------------------
// Stylelint
// ---------------------------------------------------------------------------------------------

const STYLELINT_KINDS: Record<string, string> = {
  'css': 'styles/index.css',
  'css-in-js': 'src/App.tsx',
  'less': 'styles/index.less',
};

const stylelintLevel = (value: unknown): RuleLevel => {
  if (value === null || value === undefined || value === false) return 'off';
  const secondary = Array.isArray(value) ? value[1] : undefined;
  return secondary && typeof secondary === 'object' && secondary.severity === 'warning'
    ? 'warn'
    : 'error';
};

async function buildStylelint(): Promise<RuleTool> {
  const dir = path.join(root, 'packages/stylelint-config');
  const require = packageRequire('packages/stylelint-config');
  const stylelint = (await import('stylelint')).default as any;
  const config = (await import('../packages/stylelint-config/src/index')).default;

  const resolved: Record<string, any> = {};
  for (const [kind, file] of Object.entries(STYLELINT_KINDS)) {
    resolved[kind] = await stylelint.resolveConfig(path.join(dir, file), {
      config,
      configBasedir: dir,
    });
  }

  // Map plugin rule prefixes (order/, less/, liberty/) to the npm package that ships them.
  const pluginPackages = new Map<string, string>();
  const pluginNames = [...new Set(Object.values(resolved).flatMap((item) => item?.plugins ?? []))];
  for (const pluginPath of pluginNames) {
    if (typeof pluginPath !== 'string') continue;
    let dir = path.dirname(pluginPath);
    let packageName: string | undefined;
    while (dir !== path.dirname(dir)) {
      try {
        packageName = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8')).name;
        if (packageName) break;
      } catch {
        // keep walking up
      }
      dir = path.dirname(dir);
    }
    const mod = await import(pathToFileURL(pluginPath).href);
    const plugins = [mod.default ?? mod].flat();
    for (const plugin of plugins) {
      const ruleName: string | undefined = plugin?.ruleName;
      if (ruleName && packageName) pluginPackages.set(ruleName.split('/')[0]!, packageName);
    }
  }

  const ids = new Set(Object.values(resolved).flatMap((item) => Object.keys(item?.rules ?? {})));
  const entries: RuleEntry[] = [];
  for (const id of ids) {
    const kinds: Record<string, RuleLevel> = {};
    for (const [kind, item] of Object.entries(resolved)) {
      if (item?.rules && id in item.rules) kinds[kind] = stylelintLevel(item.rules[id]);
    }
    const { kinds: differing, level } = mergeKinds(kinds);
    const strongestKind = Object.keys(kinds).find((kind) => kinds[kind] === level)!;
    const value = resolved[strongestKind].rules[id];

    const isBuiltin = !id.includes('/');
    let meta: any;
    if (isBuiltin) meta = (await stylelint.rules[id])?.meta;
    else {
      for (const item of Object.values(resolved)) {
        const fn = item?.pluginFunctions?.[id];
        if (fn) meta = fn.meta;
      }
    }

    entries.push({
      deprecated: meta?.deprecated ? true : undefined,
      fixable: meta?.fixable ? true : undefined,
      group: isBuiltin ? 'stylelint' : id.split('/')[0]!,
      id,
      kinds: differing,
      level,
      options: value === null ? undefined : toJson(value),
      url:
        typeof meta?.url === 'string'
          ? meta.url
          : pluginPackages.has(id.split('/')[0]!)
            ? `https://www.npmjs.com/package/${pluginPackages.get(id.split('/')[0]!)}`
            : undefined,
    });
  }

  return {
    description: `Extends ${(config.extends as string[]).join(', ')}; resolved per sample file with stylelint.resolveConfig().`,
    id: 'stylelint',
    kinds: STYLELINT_KINDS,
    packageName: '@lobehub/stylelint-config',
    presets: [{ description: 'The exported config.', id: 'default', label: 'Default' }],
    rules: { default: sortRules(entries) },
    title: 'Stylelint',
    version:
      readVersion(createRequire(path.join(root, 'package.json')), 'stylelint') ??
      readVersion(require, 'stylelint'),
  };
}

// ---------------------------------------------------------------------------------------------
// Commitlint
// ---------------------------------------------------------------------------------------------

async function buildCommitlint(): Promise<RuleTool> {
  const dir = path.join(root, 'packages/commitlint-config');
  const cliRequire = createRequire(
    createRequire(path.join(root, 'package.json')).resolve('@commitlint/cli/package.json'),
  );
  const load = (await importFrom(cliRequire, '@commitlint/load')).default;
  const loadRequire = createRequire(cliRequire.resolve('@commitlint/load'));
  let coreRules = new Set<string>();
  try {
    coreRules = new Set(Object.keys((await importFrom(loadRequire, '@commitlint/rules')).default));
  } catch {
    try {
      coreRules = new Set(Object.keys((await importFrom(cliRequire, '@commitlint/rules')).default));
    } catch {
      console.warn('[rules] @commitlint/rules not found, rule links skipped');
    }
  }
  const config = (await import('../packages/commitlint-config/src/index')).default;
  const loaded = await load(config, { cwd: dir });

  const entries: RuleEntry[] = Object.entries(loaded.rules as Record<string, unknown[]>).map(
    ([id, value]) => {
      const [severity, when, ruleValue] = value ?? [];
      const level: RuleLevel = severity === 2 ? 'error' : severity === 1 ? 'warn' : 'off';
      const core = coreRules.has(id);
      const pluginName = Object.keys(loaded.plugins ?? {})[0];
      const options =
        level === 'off'
          ? undefined
          : toJson(ruleValue === undefined ? { when } : { value: ruleValue, when });
      return {
        group: core ? '@commitlint/rules' : (pluginName ?? 'plugin'),
        id,
        level,
        options,
        url: core
          ? `https://commitlint.js.org/reference/rules.html#${id}`
          : pluginName
            ? `https://www.npmjs.com/package/${pluginName}`
            : undefined,
      };
    },
  );

  return {
    description: `Extends ${(config.extends as string[]).join(', ')}; resolved with @commitlint/load.`,
    id: 'commitlint',
    packageName: '@lobehub/commitlint-config',
    presets: [{ description: 'The exported config.', id: 'default', label: 'Default' }],
    rules: { default: sortRules(entries) },
    title: 'Commitlint',
    version: readVersion(cliRequire, '@commitlint/load'),
  };
}

// ---------------------------------------------------------------------------------------------
// Remarklint
// ---------------------------------------------------------------------------------------------

const remarkLevel = (options: unknown): RuleLevel => {
  if (options === false) return 'off';
  const severity = Array.isArray(options) ? options[0] : undefined;
  if (severity === 'off' || severity === 0) return 'off';
  if (severity === 'error' || severity === 2) return 'error';
  return 'warn';
};

async function buildRemark(): Promise<RuleTool> {
  const require = packageRequire('packages/remarklint-config');
  const config = (await import('../packages/remarklint-config/src/index')).default as {
    plugins: unknown[];
  };

  const lint = new Map<string, RuleEntry>();
  const describe = (requires: NodeRequire[], pkg: string) =>
    readPackageJson(requires, pkg)?.description as string | undefined;

  const add = (
    fn: any,
    options: unknown,
    source: string,
    requires: NodeRequire[],
    packageName?: string,
  ) => {
    const name: string = fn?.name ?? '';
    let id: string;
    if (name.startsWith('remark-lint:')) id = name.slice('remark-lint:'.length);
    else if (packageName?.startsWith('remark-lint-')) id = packageName.slice('remark-lint-'.length);
    else return false;
    const pkg = `remark-lint-${id}`;
    const level = remarkLevel(options);
    const ruleOptions = Array.isArray(options) ? options.slice(1) : options;
    const previous = lint.get(id);
    lint.set(id, {
      description: previous?.description ?? describe(requires, pkg),
      group: source,
      id,
      level,
      options:
        level === 'off' ||
        ruleOptions === undefined ||
        (Array.isArray(ruleOptions) && ruleOptions.length === 0)
          ? undefined
          : toJson(ruleOptions),
      sources: [...(previous?.sources ?? []), { label: source, level }],
      url: `https://www.npmjs.com/package/${pkg}`,
    });
    return true;
  };

  const otherPlugins: string[] = [];
  for (const item of config.plugins) {
    const [plugin, options] = Array.isArray(item) ? item : [item, undefined];
    if (typeof plugin !== 'string') {
      if (!add(plugin, options, 'remarklint-config', [require])) {
        otherPlugins.push((plugin as any)?.name ?? 'custom plugin');
      }
      continue;
    }
    const mod = (await importFrom(require, plugin)).default;
    if (mod && typeof mod === 'object' && Array.isArray(mod.plugins)) {
      const presetRequire = createRequire(require.resolve(plugin));
      for (const presetItem of mod.plugins) {
        const [fn, presetOptions] = Array.isArray(presetItem)
          ? presetItem
          : [presetItem, undefined];
        add(fn, presetOptions, plugin, [presetRequire, require]);
      }
      continue;
    }
    if (
      !add(
        mod,
        options,
        plugin.startsWith('remark-lint-') ? 'remarklint-config' : plugin,
        [require],
        plugin,
      )
    ) {
      otherPlugins.push(plugin);
    }
  }

  return {
    description: `Lint rules expanded from the presets and plugins in the config. Other plugins: ${otherPlugins.join(', ')}.`,
    id: 'remarklint',
    packageName: '@lobehub/remarklint-config',
    presets: [{ description: 'The exported config.', id: 'default', label: 'Default' }],
    rules: { default: sortRules([...lint.values()]) },
    title: 'Remarklint',
    version: readVersion(require, 'remark-lint'),
  };
}

// ---------------------------------------------------------------------------------------------
// Prettier
// ---------------------------------------------------------------------------------------------

async function buildPrettier(): Promise<PrettierData> {
  const require = packageRequire('packages/prettier-config');
  const prettier = await import('prettier');
  const config = (await import('../packages/prettier-config/src/index')).default as Record<
    string,
    any
  >;
  const pluginNames: string[] = config.plugins ?? [];
  const plugins = await Promise.all(
    pluginNames.map(async (name) => {
      const mod = await importFrom(require, name);
      return mod.default ?? mod;
    }),
  );

  const core = await prettier.getSupportInfo();
  const coreNames = new Set(core.options.map((option: any) => option.name));
  const all = await prettier.getSupportInfo({ plugins });
  const byName = new Map(all.options.map((option: any) => [option.name, option]));

  const options: PrettierOption[] = Object.entries(config)
    .filter(([name]) => name !== 'plugins' && name !== 'overrides')
    .map(([name, value]) => {
      const info: any = byName.get(name);
      return {
        category: info?.category,
        default: toJson(info?.default),
        description: info?.description,
        name,
        plugin: !coreNames.has(name),
        value: toJson(value),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    options,
    overrides: toJson(config.overrides ?? []) as PrettierData['overrides'],
    packageName: '@lobehub/prettier-config',
    plugins: pluginNames,
    version: prettier.version,
  };
}

// ---------------------------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------------------------

/** Escapes text for an MDX table cell. */
const cell = (text?: string) =>
  (text ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
    .replaceAll('{', '\\{')
    .replaceAll('}', '\\}')
    .replaceAll('<', '\\<')
    .replaceAll('>', '\\>')
    .replaceAll('\n', ' ');

const countLevels = (rules: RuleEntry[]) => ({
  error: rules.filter((rule) => rule.level === 'error').length,
  off: rules.filter((rule) => rule.level === 'off').length,
  warn: rules.filter((rule) => rule.level === 'warn').length,
});

const ruleTable = (rules: RuleEntry[], withFixable = true) => {
  const head = withFixable
    ? ['| Rule | Level | Fixable | Description |', '| --- | --- | --- | --- |']
    : ['| Rule | Level | Description |', '| --- | --- | --- |'];
  const rows = rules.map((rule) => {
    const name = rule.url ? `[${rule.id}](${rule.url})` : `\`${rule.id}\``;
    const description = cell(rule.description);
    return withFixable
      ? `| ${name} | ${rule.level} | ${rule.fixable ? 'yes' : ''} | ${description} |`
      : `| ${name} | ${rule.level} | ${description} |`;
  });
  return [...head, ...rows].join('\n');
};

const summaryLine = (rules: RuleEntry[]) => {
  const { error, off, warn } = countLevels(rules);
  return `${rules.length} rules: ${error} error, ${warn} warn, ${off} off.`;
};

const GENERATED_NOTE =
  '# Generated by scripts/generate-rules-data.ts. Do not edit; run `pnpm docs:rules`.';

const frontmatter = (title: string, description: string) => [
  '---',
  GENERATED_NOTE,
  `title: ${JSON.stringify(title)}`,
  `description: ${JSON.stringify(description)}`,
  '---',
  '',
];

const PAGES = [
  { id: 'eslint', label: 'ESLint' },
  { id: 'stylelint', label: 'Stylelint' },
  { id: 'prettier', label: 'Prettier' },
  { id: 'commitlint', label: 'Commitlint' },
  { id: 'remarklint', label: 'Remarklint' },
] as const;

type PageId = (typeof PAGES)[number]['id'];

const otherPages = (current: PageId) =>
  `Other tools: ${PAGES.filter((page) => page.id !== current)
    .map((page) => `[${page.label}](/rules/${page.id})`)
    .join(' · ')} · [All rules](/rules).`;

const finish = (lines: string[]) =>
  `${lines
    .join('\n')
    .replaceAll(/\n{3,}/g, '\n\n')
    .trim()}\n`;

const EXPLORER_HINT =
  'Search by rule name, filter by level, plugin or auto-fix, and expand a rule to see its options, the files it applies to and the config that sets it.';

function renderEslintPage(eslint: RuleTool) {
  const base = eslint.rules.base!;
  const baseLevels = new Map(base.map((rule) => [rule.id, rule.level]));

  const presetDiff = (preset: RulePreset) => {
    const changed = eslint.rules[preset.id]!.filter(
      (rule) => rule.level !== 'off' && baseLevels.get(rule.id) !== rule.level,
    );
    return `- **${preset.label}** (\`${JSON.stringify(preset.options)}\`): ${summaryLine(eslint.rules[preset.id]!)} Adds or raises ${changed.length}: ${changed.map((rule) => `\`${rule.id}\` (${rule.level})`).join(', ')}.`;
  };

  return finish([
    ...frontmatter(
      'ESLint Rules',
      `Every rule ${eslint.packageName} sets for each defineConfig() preset, generated from the config at build time.`,
    ),
    "import { RuleToolExplorer } from './RulesExplorer';",
    "import data from './data/eslint.json';",
    '',
    `Generated from \`${eslint.packageName}\` each time the site is built, so it always matches the code. Pick a \`defineConfig()\` preset; the counts follow it. ${EXPLORER_HINT}`,
    '',
    otherPages('eslint'),
    '',
    '<RuleToolExplorer data={data} />',
    '',
    '## Summary',
    '',
    `A plain-text digest of the same data for agents (ESLint ${eslint.version ?? ''}). Levels are the strongest level across ${Object.keys(eslint.kinds ?? {}).length} sample files (${Object.values(
      eslint.kinds ?? {},
    )
      .map((file) => `\`${file}\``)
      .join(', ')}).`,
    '',
    `- **${eslint.presets[0]!.label}** (\`${JSON.stringify(eslint.presets[0]!.options ?? {})}\`): ${summaryLine(base)}`,
    ...eslint.presets.slice(1).map((preset) => presetDiff(preset)),
    '',
    '<details>',
    `<summary>Base preset: ${summaryLine(base)}</summary>`,
    '',
    ruleTable(base.filter((rule) => rule.level !== 'off')),
    '',
    `Turned off: ${
      base
        .filter((rule) => rule.level === 'off')
        .map((rule) => `\`${rule.id}\``)
        .join(', ') || 'none'
    }.`,
    '',
    '</details>',
  ]);
}

function renderToolPage(tool: RuleTool) {
  const rules = tool.rules[tool.presets[0]!.id]!;
  return finish([
    ...frontmatter(
      `${tool.title} Rules`,
      `Every rule ${tool.packageName} sets, generated from the config at build time.`,
    ),
    "import { RuleToolExplorer } from './RulesExplorer';",
    `import data from './data/${tool.id}.json';`,
    '',
    `Generated from \`${tool.packageName}\` each time the site is built, so it always matches the code. ${EXPLORER_HINT}`,
    '',
    otherPages(tool.id),
    '',
    '<RuleToolExplorer data={data} />',
    '',
    '## Summary',
    '',
    `A plain-text digest of the same data for agents. \`${tool.packageName}\`${tool.version ? ` (${tool.title} ${tool.version})` : ''}: ${cell(tool.description)}`,
    '',
    '<details>',
    `<summary>${summaryLine(rules)}</summary>`,
    '',
    ruleTable(rules, tool.id !== 'commitlint' && tool.id !== 'remarklint'),
    '',
    '</details>',
  ]);
}

function renderPrettierPage(prettier: PrettierData) {
  return finish([
    ...frontmatter(
      'Prettier Options',
      `Every option ${prettier.packageName} sets, next to the Prettier default, generated from the config at build time.`,
    ),
    "import { PrettierOptions } from './RulesExplorer';",
    "import data from './data/prettier.json';",
    '',
    `Generated from \`${prettier.packageName}\` each time the site is built, so it always matches the code.`,
    '',
    otherPages('prettier'),
    '',
    '<PrettierOptions data={data} />',
    '',
    '## Summary',
    '',
    `A plain-text digest of the same data for agents. \`${prettier.packageName}\` (Prettier ${prettier.version ?? ''}), plugins: ${prettier.plugins.map((plugin) => `\`${plugin}\``).join(', ')}.`,
    '',
    '| Option | Value | Default | Description |',
    '| --- | --- | --- | --- |',
    ...prettier.options.map(
      (option) =>
        `| \`${option.name}\` | \`${cell(JSON.stringify(option.value))}\` | ${option.default === undefined ? '' : `\`${cell(JSON.stringify(option.default))}\``} | ${cell(option.description)}${option.plugin ? ' (plugin)' : ''} |`,
    ),
    '',
    ...prettier.overrides.map(
      (override) =>
        `Override for \`${[override.files].flat().join(', ')}\`: \`${cell(JSON.stringify(override.options))}\`.`,
    ),
  ]);
}

function renderIndexPage(tools: RuleTool[], prettier: PrettierData) {
  const rows = PAGES.map(({ id, label }) => {
    if (id === 'prettier') {
      return `| [${label}](/rules/prettier) | \`${prettier.packageName}\` | ${prettier.options.length} options | |`;
    }
    const tool = tools.find((item) => item.id === id)!;
    const presets = tool.presets.map(
      (preset) => `${preset.label}: ${summaryLine(tool.rules[preset.id]!)}`,
    );
    const count =
      tool.presets.length > 1
        ? `${tool.rules[tool.presets[0]!.id]!.length} to ${Math.max(...tool.presets.map((preset) => tool.rules[preset.id]!.length))} rules`
        : `${tool.rules[tool.presets[0]!.id]!.length} rules`;
    return `| [${label}](/rules/${id}) | \`${tool.packageName}\` | ${count} | ${presets.join('<br />')} |`;
  });
  return finish([
    ...frontmatter(
      'Rules',
      'Rules and options set by each LobeHub config, one generated page per tool.',
    ),
    'Each page is generated from the config packages each time the site is built, so it always matches the code.',
    '',
    '| Tool | Package | Size | Levels |',
    '| --- | --- | --- | --- |',
    ...rows,
  ]);
}

// ---------------------------------------------------------------------------------------------

const started = Date.now();
const generatedAt = new Date().toISOString();
const tools = [
  await buildEslint(),
  await buildStylelint(),
  await buildCommitlint(),
  await buildRemark(),
];
const prettier = await buildPrettier();

const outDir = path.join(root, 'docs/rules');
const dataDir = path.join(outDir, 'data');
mkdirSync(dataDir, { recursive: true });

const writeJson = (id: string, value: unknown) =>
  writeFileSync(path.join(dataDir, `${id}.json`), `${JSON.stringify(value)}\n`);

for (const tool of tools) {
  writeJson(tool.id, { ...tool, generatedAt });
  writeFileSync(
    path.join(outDir, `${tool.id}.mdx`),
    tool.id === 'eslint' ? renderEslintPage(tool) : renderToolPage(tool),
  );
  for (const preset of tool.presets) {
    console.info(`[rules] ${tool.title} ${preset.label}: ${summaryLine(tool.rules[preset.id]!)}`);
  }
}
writeJson('prettier', { ...prettier, generatedAt });
writeFileSync(path.join(outDir, 'prettier.mdx'), renderPrettierPage(prettier));
writeFileSync(path.join(outDir, 'index.mdx'), renderIndexPage(tools, prettier));

console.info(`[rules] Prettier: ${prettier.options.length} options`);
console.info(
  `[rules] wrote docs/rules/{index,${PAGES.map((page) => page.id).join(',')}}.mdx and docs/rules/data/*.json in ${Date.now() - started}ms`,
);
