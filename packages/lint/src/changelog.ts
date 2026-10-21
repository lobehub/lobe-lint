// CommonJS-safe entry for `.changelogrc.cjs`:
//   module.exports = require('@lobehub/lint/changelog');
// conventional-changelog-gitmoji-config loads `.changelogrc*` with cosmiconfig 7 (sync, no `.mjs`
// support), and the root entry of `@lobehub/lint` cannot be `require()`d because it pulls in
// ESM-only ESLint plugins. This entry only depends on the plain changelog options object.
import config from '@lobehub/semantic-release-config/changelog';

export default config;
