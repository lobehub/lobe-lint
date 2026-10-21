// CommonJS-safe entry for a monorepo `.releaserc.cjs`:
//   module.exports = require('@lobehub/lint/release-monorepo');
import config from '@lobehub/semantic-release-config/monorepo';

import type { ReleaseConfig } from './unwrap';
import { unwrapDefault } from './unwrap';

const release: ReleaseConfig = unwrapDefault(config as ReleaseConfig);

export default release;
