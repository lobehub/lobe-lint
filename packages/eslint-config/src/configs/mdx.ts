import type { Linter } from 'eslint';
import * as mdx from 'eslint-plugin-mdx';

import { GLOB_MDX } from '../globs';
import { type Options } from '../types';

/**
 * MDX flat config from eslint-plugin-mdx.
 * Requires eslint-plugin-mdx and eslint-mdx to be installed.
 *
 * With ESLint 10, eslint-plugin-mdx@3.6.2 has a known issue (context.getFilename removed).
 * Apply the patch from patches/eslint-plugin-mdx@3.6.2.patch or use a future release.
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
