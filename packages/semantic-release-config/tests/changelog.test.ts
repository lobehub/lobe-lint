import { createRequire } from 'node:module';

import { describe, expect, it } from 'vitest';

import changelog from '../src/changelog';

const require = createRequire(import.meta.url);

// conventional-changelog-gitmoji-config (pulled in by semantic-release-config-gitmoji) drops every
// commit whose type is not listed in `displayTypes`, so a typo silently hides a whole section.
const loadTypeMap = (): Record<string, unknown> => {
  const preset = require.resolve('semantic-release-config-gitmoji/package.json');
  const fromPreset = createRequire(preset);
  const writer = fromPreset.resolve('conventional-changelog-gitmoji-config/package.json');
  return createRequire(writer)('./lib/transformer/typeDisplayName.js').typeMap;
};

describe('changelog options', () => {
  it('only lists commit types the changelog writer knows', () => {
    const known = Object.keys(loadTypeMap());

    expect(known).toContain('perf');
    expect(changelog.displayTypes.filter((type) => !known.includes(type))).toEqual([]);
  });

  it('shows performance improvements', () => {
    expect(changelog.displayTypes).toContain('perf');
  });
});
