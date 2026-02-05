import type { ConfigMeta, ConfigTool } from './types.js';

export const CONFIG_META: Record<ConfigTool, ConfigMeta> = {
  'eslint': {
    name: 'eslint',
    displayName: 'ESLint',
    package: '@lobehub/eslint-config',
    peerDependencies: ['eslint'],
    configFile: 'eslint.config.mjs',
  },
  'prettier': {
    name: 'prettier',
    displayName: 'Prettier',
    package: '@lobehub/prettier-config',
    peerDependencies: ['prettier'],
    configFile: 'prettier.config.mjs',
  },
  'stylelint': {
    name: 'stylelint',
    displayName: 'Stylelint',
    package: '@lobehub/stylelint-config',
    peerDependencies: ['stylelint'],
    configFile: 'stylelint.config.mjs',
  },
  'commitlint': {
    name: 'commitlint',
    displayName: 'Commitlint',
    package: '@lobehub/commitlint-config',
    peerDependencies: ['@commitlint/cli'],
    configFile: 'commitlint.config.mjs',
  },
  'remarklint': {
    name: 'remarklint',
    displayName: 'Remarklint',
    package: '@lobehub/remarklint-config',
    peerDependencies: ['remark-cli'],
    configFile: '.remarkrc.mjs',
  },
  'semantic-release': {
    name: 'semantic-release',
    displayName: 'Semantic Release',
    package: '@lobehub/semantic-release-config',
    peerDependencies: ['semantic-release'],
    configFile: 'release.config.mjs',
  },
};

export const PRESET_TOOLS: ConfigTool[] = ['eslint', 'prettier', 'stylelint', 'commitlint'];

export const ALL_TOOLS: ConfigTool[] = [
  'eslint',
  'prettier',
  'stylelint',
  'commitlint',
  'remarklint',
  'semantic-release',
];

export const REACT_FRAMEWORKS = ['next', 'remix', 'vite', 'expo'] as const;

export const EXISTING_CONFIG_PATTERNS: Record<ConfigTool, string[]> = {
  'eslint': [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.json',
    '.eslintrc.yaml',
    '.eslintrc.yml',
  ],
  'prettier': [
    'prettier.config.js',
    'prettier.config.mjs',
    'prettier.config.cjs',
    '.prettierrc',
    '.prettierrc.js',
    '.prettierrc.json',
    '.prettierrc.yaml',
    '.prettierrc.yml',
  ],
  'stylelint': [
    'stylelint.config.js',
    'stylelint.config.mjs',
    'stylelint.config.cjs',
    '.stylelintrc',
    '.stylelintrc.js',
    '.stylelintrc.json',
    '.stylelintrc.yaml',
    '.stylelintrc.yml',
  ],
  'commitlint': [
    'commitlint.config.js',
    'commitlint.config.mjs',
    'commitlint.config.cjs',
    '.commitlintrc',
    '.commitlintrc.js',
    '.commitlintrc.json',
    '.commitlintrc.yaml',
    '.commitlintrc.yml',
  ],
  'remarklint': ['.remarkrc', '.remarkrc.js', '.remarkrc.mjs', '.remarkrc.json', '.remarkrc.yaml'],
  'semantic-release': [
    'release.config.js',
    'release.config.mjs',
    'release.config.cjs',
    '.releaserc',
    '.releaserc.js',
    '.releaserc.json',
    '.releaserc.yaml',
  ],
};
