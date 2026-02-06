import { type ConfigTool, type GeneratedFile } from '../types.js';

const COMMON_IGNORE_PATTERNS = [
  'dist',
  'build',
  'out',
  'coverage',
  '.next',
  '.turbo',
  'node_modules',
  'logs',
  'test-output',
  '*.log',
  '*.lock',
  'package-lock.json',
  '*.min.*',
  'public',
];

const IGNORE_CONFIG: Partial<
  Record<ConfigTool, { file: string; extraPatterns: string[]; header?: string }>
> = {
  prettier: {
    file: '.prettierignore',
    extraPatterns: ['storybook-static', 'CHANGELOG.md', 'LICENSE'],
  },
  stylelint: {
    file: '.stylelintignore',
    extraPatterns: ['storybook-static', '*.min.css'],
  },
  remarklint: {
    file: '.remarkignore',
    extraPatterns: ['CHANGELOG.md', 'LICENSE'],
  },
};

export function generateIgnoreFiles(tools: ConfigTool[]): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  for (const tool of tools) {
    const config = IGNORE_CONFIG[tool];
    if (!config) continue;

    const patterns = [...COMMON_IGNORE_PATTERNS, ...config.extraPatterns];
    const content = patterns.join('\n') + '\n';

    files.push({ path: config.file, content });
  }

  return files;
}
