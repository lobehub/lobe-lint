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
