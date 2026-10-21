// CommonJS-safe entry for `.releaserc.cjs`:
//   module.exports = require('@lobehub/lint/release');
// semantic-release <= 21 with cosmiconfig 8.0/8.1 never reads `.releaserc.mjs`, and the root entry of
// `@lobehub/lint` cannot be `require()`d because it pulls in ESM-only ESLint plugins.
import config from '@lobehub/semantic-release-config';

import type { ReleaseConfig } from './unwrap';
import { unwrapDefault } from './unwrap';

const release: ReleaseConfig = unwrapDefault(config as ReleaseConfig);

export default release;
