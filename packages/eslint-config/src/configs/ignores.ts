import { GLOB_IGNORES } from '../globs';
import { type FlatConfig } from '../types';

export function ignores(userIgnores: string[] = []): FlatConfig {
  return {
    ignores: [...GLOB_IGNORES, ...userIgnores],
  };
}
