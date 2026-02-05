// Missing node: protocol - should fail unicorn/prefer-node-protocol
import fs from 'fs';
import path from 'path';

export const exists = fs.existsSync(path.resolve('.'));
