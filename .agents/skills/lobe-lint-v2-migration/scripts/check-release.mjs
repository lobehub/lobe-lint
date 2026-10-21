#!/usr/bin/env node
// Show the config semantic-release really uses, through its own getConfig (the loader that
// multi-semantic-release calls per package too). Run from the repo root after installing deps:
//   node .agents/skills/lobe-lint-v2-migration/scripts/check-release.mjs [dir ...]
// Without arguments it checks the repo root and every workspace package (pnpm-workspace.yaml or
// package.json `workspaces`) that has its own release config. With arguments it checks those dirs.
// Exit code 1 means semantic-release falls back to its defaults (no gitmoji releases) somewhere;
// 2 means semantic-release is not installed for a checked dir.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const RC_FILE = /^(?:\.releaserc(?:\.\w+)?|release\.config\.\w+)$/;
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const isDir = (dir) => fs.statSync(dir, { throwIfNoEntry: false })?.isDirectory() ?? false;
const rcFilesOf = (dir) => fs.readdirSync(dir).filter((f) => RC_FILE.test(f));

/** Directories of the workspace packages (pnpm-workspace.yaml or package.json `workspaces`). */
function workspaceDirs(root) {
  const patterns = [];
  const pnpmWs = path.join(root, 'pnpm-workspace.yaml');
  if (fs.existsSync(pnpmWs)) {
    let inPackages = false;
    for (const line of fs.readFileSync(pnpmWs, 'utf8').split('\n')) {
      if (/^packages\s*:/.test(line)) inPackages = true;
      else if (/^\S/.test(line)) inPackages = false;
      else if (inPackages) {
        const m = line.match(/^\s*-\s*["']?([^"'#]+?)["']?\s*(?:#.*)?$/);
        if (m) patterns.push(m[1]);
      }
    }
  }
  const pkgFile = path.join(root, 'package.json');
  const pkg = fs.existsSync(pkgFile) ? readJson(pkgFile) : {};
  patterns.push(...(Array.isArray(pkg.workspaces) ? pkg.workspaces : (pkg.workspaces?.packages ?? [])));

  const dirs = new Set();
  const children = (d) =>
    fs
      .readdirSync(path.join(root, d), { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules')
      .map((e) => (d === '.' ? e.name : `${d}/${e.name}`));
  const walk = (d, parts, depth = 0) => {
    if (parts.length === 0) {
      if (d !== '.' && fs.existsSync(path.join(root, d, 'package.json'))) dirs.add(d);
      return;
    }
    const [head, ...rest] = parts;
    if (head === '**') {
      walk(d, rest, depth);
      if (depth < 4) for (const c of children(d)) walk(c, parts, depth + 1);
    } else if (head.includes('*')) {
      const re = new RegExp(`^${head.replaceAll(/[$()+.?[\\\]^{|}]/g, String.raw`\$&`).replaceAll('*', '.*')}$`);
      for (const c of children(d)) if (re.test(path.posix.basename(c))) walk(c, rest, depth);
    } else {
      const next = d === '.' ? head : `${d}/${head}`;
      if (isDir(path.join(root, next))) walk(next, rest, depth);
    }
  };
  for (const p of patterns) {
    if (p.startsWith('!')) continue;
    walk('.', p.replace(/^\.\//, '').replace(/\/$/, '').split('/').filter(Boolean));
  }
  return [...dirs].sort();
}

const silent = { error() {}, log() {}, success() {}, warn() {} };

/** @returns {Promise<0 | 1 | 2>} */
async function check(cwd) {
  const fromCwd = createRequire(path.join(cwd, 'noop.js'));
  let srPkg;
  try {
    srPkg = fs.realpathSync(fromCwd.resolve('semantic-release/package.json'));
  } catch {
    console.error(`semantic-release is not installed for ${cwd}`);
    return 2;
  }
  const srDir = path.dirname(srPkg);
  const fromSr = createRequire(srPkg);
  const cosmiconfigVersion = readJson(fromSr.resolve('cosmiconfig/package.json')).version;
  console.log(`semantic-release ${readJson(srPkg).version}, cosmiconfig ${cosmiconfigVersion}`);

  const rcFiles = rcFilesOf(cwd);
  console.log(`config files: ${rcFiles.join(', ') || '(none)'}`);
  const [major, minor] = cosmiconfigVersion.split('.').map(Number);
  if (rcFiles.some((f) => f.endsWith('.mjs')) && (major < 8 || (major === 8 && minor < 2))) {
    console.log('warning: cosmiconfig < 8.2 never reads .mjs; use .releaserc.cjs');
  }

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
  return lobe ? 0 : 1;
}

const root = process.cwd();
const args = process.argv.slice(2);
const dirs =
  args.length > 0
    ? args.map((d) => path.resolve(d))
    : [
        root,
        ...workspaceDirs(root)
          .map((d) => path.join(root, d))
          .filter((d) => rcFilesOf(d).length > 0 || readJson(path.join(d, 'package.json')).release),
      ];

let exitCode = 0;
for (const dir of dirs) {
  if (dirs.length > 1) console.log(`\n== ${path.relative(root, dir) || '.'}`);
  const code = await check(dir);
  exitCode = Math.max(exitCode, code);
}
process.exit(exitCode);
