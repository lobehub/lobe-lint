export const GLOB_JS = '**/*.?([cm])js';
export const GLOB_JSX = '**/*.?([cm])jsx';
export const GLOB_TS = '**/*.?([cm])ts';
export const GLOB_TSX = '**/*.?([cm])tsx';

export const GLOB_JS_ALL = [GLOB_JS, GLOB_JSX];
export const GLOB_TS_ALL = [GLOB_TS, GLOB_TSX];
export const GLOB_SRC = [...GLOB_JS_ALL, ...GLOB_TS_ALL];

export const GLOB_TEST = [
  '**/*.test.{js,jsx,ts,tsx}',
  '**/*.spec.{js,jsx,ts,tsx}',
  '**/__tests__/**/*.{js,jsx,ts,tsx}',
];

export const GLOB_YAML = ['**/*.yaml', '**/*.yml'];

export const GLOB_CONFIG_FILES = ['**/*.config.{js,mjs,ts,mts,cjs,cts}'];

export const GLOB_NEXT_APP_FILES = [
  '**/app/**/page.{js,jsx,ts,tsx}',
  '**/app/**/layout.{js,jsx,ts,tsx}',
  '**/app/**/loading.{js,jsx,ts,tsx}',
  '**/app/**/error.{js,jsx,ts,tsx}',
  '**/app/**/not-found.{js,jsx,ts,tsx}',
  '**/app/**/template.{js,jsx,ts,tsx}',
  '**/app/**/default.{js,jsx,ts,tsx}',
  '**/app/**/route.{js,ts}',
  '**/app/**/opengraph-image.{js,jsx,ts,tsx}',
  '**/app/**/twitter-image.{js,jsx,ts,tsx}',
  '**/app/**/apple-icon.{js,jsx,ts,tsx}',
  '**/app/**/icon.{js,jsx,ts,tsx}',
  '**/app/**/sitemap.{js,ts}',
  '**/app/**/robots.{js,ts}',
  '**/app/**/manifest.{js,ts}',
];

export const GLOB_IGNORES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/coverage/**',
  '**/.turbo/**',
  '**/out/**',
  '**/*.min.*',
  '**/public/**',
];
