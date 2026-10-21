export type RuleLevel = 'error' | 'off' | 'warn';

export interface RuleSource {
  files?: string[];
  label: string;
  level: RuleLevel;
}

export interface RuleEntry {
  deprecated?: boolean;
  description?: string;
  fixable?: boolean;
  /** Plugin or preset the rule belongs to */
  group: string;
  id: string;
  /** Level per sample file, when it differs between files */
  kinds?: Record<string, RuleLevel>;
  level: RuleLevel;
  options?: unknown;
  sources?: RuleSource[];
  suggestions?: boolean;
  url?: string;
}

export interface RulePreset {
  description: string;
  id: string;
  label: string;
  /** Options passed to the config factory */
  options?: Record<string, unknown>;
}

export interface RuleTool {
  description: string;
  id: 'commitlint' | 'eslint' | 'remarklint' | 'stylelint';
  /** Sample file per kind used to resolve the config */
  kinds?: Record<string, string>;
  packageName: string;
  presets: RulePreset[];
  rules: Record<string, RuleEntry[]>;
  title: string;
  version?: string;
}

export interface PrettierOption {
  category?: string;
  default?: unknown;
  description?: string;
  name: string;
  plugin: boolean;
  value: unknown;
}

export interface PrettierData {
  options: PrettierOption[];
  overrides: { files: string | string[]; options: Record<string, unknown> }[];
  packageName: string;
  plugins: string[];
  version?: string;
}

/** Contents of `docs/rules/data/<tool>.json`. */
export type RuleToolData = RuleTool & { generatedAt: string };

/** Contents of `docs/rules/data/prettier.json`. */
export type PrettierToolData = PrettierData & { generatedAt: string };
