#!/usr/bin/env node
// Show the config semantic-release really uses, through its own getConfig (the loader that
// multi-semantic-release calls per package too). Run from the repo root after installing deps:
//   node .agents/skills/lobe-lint-v2-migration/scripts/check-release.mjs [package dir]
// Exit code 1 means semantic-release falls back to its defaults (no gitmoji releases).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const cwd = path.resolve(process.argv[2] ?? '.');
const fromCwd = createRequire(path.join(cwd, 'noop.js'));

let srPkg;
try {
  srPkg = fs.realpathSync(fromCwd.resolve('semantic-release/package.json'));
} catch {
  console.error(`semantic-release is not installed for ${cwd}`);
  process.exit(2);
}
const srDir = path.dirname(srPkg);
const fromSr = createRequire(srPkg);
const version = (file) => JSON.parse(fs.readFileSync(file, 'utf8')).version;
const cosmiconfigVersion = version(fromSr.resolve('cosmiconfig/package.json'));
console.log(`semantic-release ${version(srPkg)}, cosmiconfig ${cosmiconfigVersion}`);

const rcFiles = fs.readdirSync(cwd).filter((f) => /^(?:\.releaserc(?:\.\w+)?|release\.config\.\w+)$/.test(f));
console.log(`config files: ${rcFiles.join(', ') || '(none)'}`);
const [major, minor] = cosmiconfigVersion.split('.').map(Number);
if (rcFiles.some((f) => f.endsWith('.mjs')) && (major < 8 || (major === 8 && minor < 2))) {
  console.log('warning: cosmiconfig < 8.2 never reads .mjs; use .releaserc.cjs');
}

const silent = { error() {}, log() {}, success() {}, warn() {} };
const { default: getConfig } = await import(pathToFileURL(path.join(srDir, 'lib/get-config.js')).href);
const { options } = await getConfig(
  { cwd, env: process.env, logger: silent, stderr: process.stderr, stdout: process.stdout },
  {},
);
const plugins = (options.plugins ?? []).map((p) => (Array.isArray(p) ? p[0] : p));
console.log(`plugins: ${plugins.join(', ')}`);
const analyzer = (options.plugins ?? []).find(
  (p) => (Array.isArray(p) ? p[0] : p) === '@semantic-release/commit-analyzer',
);
console.log(`commit-analyzer options: ${JSON.stringify(Array.isArray(analyzer) ? analyzer[1] : {})}`);
const lobe = plugins.includes('@semantic-release/changelog') && plugins.includes('@semantic-release/git');
console.log(lobe ? 'ok: the lobe release config is loaded' : 'FAIL: semantic-release runs with its defaults');
process.exit(lobe ? 0 : 1);
