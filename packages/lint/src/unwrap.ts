/**
 * Loaded through `require()`, the CommonJS build of a dependency that has named exports next to its
 * default export shows up as `{ default, ...named }` under `default`. Return the plain default.
 */
export const unwrapDefault = <T extends object>(value: T): T =>
  (value as T & { default?: T }).default ?? value;

/**
 * Structural shape of the semantic-release options this package re-exports. Declared here so the
 * emitted `.d.ts` does not depend on whichever `semantic-release` types the consumer has installed.
 */
export interface ReleaseConfig {
  [key: string]: unknown;
  branches?: unknown;
  plugins?: unknown;
}
