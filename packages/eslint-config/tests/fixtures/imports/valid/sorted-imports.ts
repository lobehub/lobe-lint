// Side effect imports first
import './polyfills';

// Node.js built-in modules
import fs from 'node:fs';
import path from 'node:path';

// External packages (node_modules)
import lodash from 'lodash';

// Internal/relative imports
import { helper } from '../utils';
import { Component } from './Component';

// Use the imports to avoid unused-imports error
console.log(fs, path, lodash, helper, Component);
