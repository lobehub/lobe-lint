import { fileURLToPath } from 'node:url';

import { type ExternalPluginEntry, type OxlintConfig, type OxlintOverride } from 'oxlint';

import * as layers from './generated/layers';
import { PLUGIN_NAMES } from './plugin-names';
import {
  type Layer,
  type LayerOverride,
  type Options,
  type PluginKey,
  type UserOverride,
} from './types';

const pluginPath = (key: PluginKey) =>
  fileURLToPath(new URL(`plugins/${key}.mjs`, import.meta.url));

const bundledPlugin = (key: PluginKey): ExternalPluginEntry => ({
  name: PLUGIN_NAMES[key],
  specifier: pluginPath(key),
});

const isPluginKey = (entry: unknown): entry is PluginKey =>
  typeof entry === 'string' && Object.hasOwn(PLUGIN_NAMES, entry);

const resolveUserOverride = ({ jsPlugins, ...override }: UserOverride): OxlintOverride =>
  jsPlugins
    ? {
        ...override,
        jsPlugins: jsPlugins.map((entry) => (isPluginKey(entry) ? bundledPlugin(entry) : entry)),
      }
    : override;

const resolveOverride = ({ jsPlugins, ...override }: LayerOverride): OxlintOverride =>
  jsPlugins ? { ...override, jsPlugins: jsPlugins.map((key) => bundledPlugin(key)) } : override;

// oxlint reads ignorePatterns like .gitignore, where a pattern without a slash matches at any
// depth; ESLint flat config anchors it to the config directory.
const toIgnorePattern = (pattern: string) => {
  const negated = pattern.startsWith('!');
  const body = negated ? pattern.slice(1) : pattern;
  const anchored = body.replace(/\/$/, '').includes('/') ? body : `/${body}`;
  return negated ? `!${anchored}` : anchored;
};

const typescriptLayer = (mode: true | 'strict', typeChecked: boolean): Layer => {
  if (mode === 'strict') {
    return typeChecked ? layers.typescriptStrictTypeChecked : layers.typescriptStrict;
  }
  return typeChecked ? layers.typescriptRecommendedTypeChecked : layers.typescriptRecommended;
};

const reactLayer = (mode: NonNullable<Options['react']>, compiler: boolean): Layer => {
  if (mode === 'next') return compiler ? layers.reactNextCompiler : layers.reactNext;
  if (mode === 'remix') return compiler ? layers.reactRemixCompiler : layers.reactRemix;
  return compiler ? layers.reactCompiler : layers.react;
};

export function defineConfig(options: Options = {}, ...overrides: UserOverride[]): OxlintConfig {
  const {
    a11y = false,
    ignores = [],
    next = false,
    react = false,
    reactCompiler = false,
    reactNative = false,
    sortImports = true,
    sortKeys = true,
    stylex = false,
    typeChecked = false,
    typescript = true,
  } = options;

  const selected = [
    layers.javascript,
    typescript && typescriptLayer(typescript, typeChecked),
    react && reactLayer(react, reactCompiler),
    reactNative && layers.reactNative,
    next && layers.next,
    a11y && react && layers.a11y,
    sortImports ? layers.importsSorted : layers.imports,
    layers.unicorn,
    sortKeys && layers.sorting,
    stylex && layers.stylex,
    layers.unused,
    layers.comments,
    layers.commonjs,
  ].filter((layer): layer is Layer => Boolean(layer));

  return {
    categories: { correctness: 'off' },
    env: { builtin: true },
    ignorePatterns: [...layers.ignorePatterns, ...ignores.map(toIgnorePattern)],
    options: {
      reportUnusedDisableDirectives: 'warn',
      ...(typeChecked && { typeAware: true }),
    },
    overrides: [
      ...selected.flatMap((layer) => layer.overrides.map(resolveOverride)),
      ...overrides.map(resolveUserOverride),
    ],
    // Oxlint drops a later override's setting for a plugin that only an earlier override
    // enabled, so every plugin an override uses is enabled at the root as well.
    plugins: [
      ...new Set([
        ...selected.flatMap((layer) => layer.plugins),
        ...selected.flatMap((layer) =>
          layer.overrides.flatMap((override) => override.plugins ?? []),
        ),
        ...overrides.flatMap((override) => override.plugins ?? []),
      ]),
    ],
    settings: Object.assign({}, ...selected.map((layer) => layer.settings)),
  };
}

export type { Options, OxlintConfig, OxlintOverride, PluginKey, UserOverride } from './types';
