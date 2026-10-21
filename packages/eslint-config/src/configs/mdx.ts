import type { Linter } from 'eslint';
import * as mdx from 'eslint-plugin-mdx';

import { GLOB_MDX } from '../globs';
import { type Options } from '../types';

/**
 * MDX flat config from eslint-plugin-mdx.
 * eslint-plugin-mdx and eslint-mdx are dependencies of this package.
 *
 * eslint-plugin-mdx supports ESLint 10 since 3.7.0, so no patch is needed.
 */
export function mdxConfig(options: Options): Linter.Config[] {
  const { mdx: mdxOption = false } = options;

  if (!mdxOption) return [];

  return [
    {
      ...mdx.flat,
      files: [GLOB_MDX],
    },
  ];
}
