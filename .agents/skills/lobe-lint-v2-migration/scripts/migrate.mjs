#!/usr/bin/env node
// Migrate a repo from @lobehub/lint 1.x (ESLint 8 .eslintrc, Stylelint 15, CommonJS rc files)
// to @lobehub/lint 2.x (ESLint 10 flat config, *.config.mjs files), following lobe-ui.
//
// Usage: node migrate.mjs [--dry-run] [cwd]
//
// Zero dependencies (Node built-ins only). Idempotent: a second run plans nothing.
// It never installs packages, never commits, and never touches husky hooks.

import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';

const VERSIONS = {
  // @lobehub/lint: first release with the CommonJS `@lobehub/lint/{changelog,release}` entries and the
  // 2.1.5 autofix fixes; eslint / stylelint / prettier as in lobe-ui
  '@lobehub/lint': '^2.1.6',
  'eslint': '^10.12.0',
  'prettier': '^3.9.10',
  'stylelint': '^16.26.1',
};

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const help = args.includes('--help') || args.includes('-h');
const cwd = path.resolve(args.find((a) => !a.startsWith('-')) ?? process.cwd());

if (help) {
  console.log('Usage: node migrate.mjs [--dry-run] [cwd]');
  process.exit(0);
}

const pkgPath = path.join(cwd, 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error(`No package.json in ${cwd}`);
  process.exit(1);
}

const plan = { delete: [], notes: [], todos: [], write: [] };
const exists = (f) => fs.existsSync(path.join(cwd, f));
const read = (f) => fs.readFileSync(path.join(cwd, f), 'utf8');
const firstExisting = (names) => names.find((n) => exists(n));

// ---------------------------------------------------------------- loading old configs

const MARK = Symbol('lobe-lint-v1-base');
const base = (name) => ({ [MARK]: name, rules: {} });

/** Evaluate a CommonJS config with `@lobehub/lint` (and `@lobehub/ui` eslint) stubbed out. */
function loadCjs(file) {
  const abs = path.join(cwd, file);
  const src = fs.readFileSync(abs, 'utf8');
  const realRequire = createRequire(abs);
  const usesUiRestricted = /@lobehub\/ui[^'"]*eslint/.test(src);
  const stub = {
    changelog: base('changelog'),
    commitlint: base('commitlint'),
    eslint: base('eslint'),
    prettier: base('prettier'),
    remarklint: base('remarklint'),
    semanticRelease: base('semanticRelease'),
    semanticReleaseMonoRepo: base('semanticReleaseMonoRepo'),
    stylelint: base('stylelint'),
  };
  const fakeRequire = (id) => {
    if (id === '@lobehub/lint') return stub;
    if (/@lobehub\/ui[^'"]*eslint/.test(id)) {
      return {
        restrictedImports: {
          rules: { 'no-restricted-imports': ['error', { paths: [], patterns: [] }] },
        },
      };
    }
    return realRequire(id);
  };
  const module = { exports: {} };
  vm.runInNewContext(src, {
    __dirname: path.dirname(abs),
    __filename: abs,
    console,
    exports: module.exports,
    module,
    process,
    require: fakeRequire,
  });
  return { src, usesUiRestricted, value: module.exports };
}

function loadConfig(file) {
  if (file.endsWith('.json') || /^\.[a-z]+rc$/.test(file)) {
    try {
      return { src: read(file), usesUiRestricted: false, value: JSON.parse(read(file)) };
    } catch {
      // `.eslintrc` without extension may be YAML
    }
  }
  if (/\.(js|cjs)$/.test(file)) return loadCjs(file);
  return null;
}

const baseOf = (value) => (value && typeof value === 'object' ? value[MARK] : undefined);
const extraKeys = (value, ignore = []) =>
  Object.keys(value ?? {}).filter((k) => !ignore.includes(k));

// ---------------------------------------------------------------- serializing

const IDENT = /^[$A-Z_a-z][\w$]*$/;
function toJs(value, indent = 0) {
  const pad = '  '.repeat(indent + 1);
  const end = '  '.repeat(indent);
  if (value instanceof RegExp) return value.toString();
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => toJs(v, indent + 1));
    const flat = `[${items.join(', ')}]`;
    if (flat.length <= 80 && !flat.includes('\n')) return flat;
    return `[\n${items.map((i) => `${pad}${i},`).join('\n')}\n${end}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const lines = entries.map(
      ([k, v]) => `${pad}${IDENT.test(k) ? k : quote(k)}: ${toJs(v, indent + 1)},`,
    );
    return `{\n${lines.join('\n')}\n${end}}`;
  }
  if (typeof value === 'string') return quote(value);
  return String(value);
}
const quote = (s) => `'${s.replaceAll('\\', '\\\\').replaceAll("'", String.raw`\'`)}'`;
const indentBlock = (text, n) =>
  text
    .split('\n')
    .map((l, i) => (i === 0 ? l : '  '.repeat(n) + l))
    .join('\n');

// ---------------------------------------------------------------- .eslintignore

/** gitignore-style line -> flat config `ignores` glob (same idea as @eslint/compat). */
function convertIgnore(line) {
  let p = line.trim();
  if (!p || p.startsWith('#')) return null;
  const negated = p.startsWith('!');
  if (negated) p = p.slice(1);
  const dirOnly = p.endsWith('/');
  if (dirOnly) p = p.slice(0, -1);
  const anchored = p.startsWith('/') || p.includes('/');
  p = p.replace(/^\//, '');
  if (!anchored && !p.startsWith('**/')) p = `**/${p}`;
  if (dirOnly) p = `${p}/**`;
  return (negated ? '!' : '') + p;
}

// ---------------------------------------------------------------- package.json

const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
const pkg = JSON.parse(pkgRaw);
const allDeps = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
  ...pkg.peerDependencies,
};
const hasReact = Boolean(allDeps.react || allDeps['react-dom'] || allDeps.next);

// ---------------------------------------------------------------- ESLint

const ESLINT_RC = ['.eslintrc.js', '.eslintrc.cjs', '.eslintrc.json', '.eslintrc', '.eslintrc.yml', '.eslintrc.yaml'];
const ESLINT_FLAT = ['eslint.config.mjs', 'eslint.config.js', 'eslint.config.cjs', 'eslint.config.ts'];
const V2_PLUGIN_PREFIXES = [
  '@eslint-community/eslint-comments/',
  '@eslint-react/',
  '@next/next/',
  '@typescript-eslint/',
  'import-x/',
  'jsx-a11y/',
  'perfectionist/',
  'react-compiler/',
  'react-hooks/',
  'react-native/',
  'react-refresh/',
  'react/',
  'regexp/',
  'simple-import-sort/',
  'unicorn/',
  'unused-imports/',
  'yml/',
];
const isKnownRule = (name) => !name.includes('/') || V2_PLUGIN_PREFIXES.some((p) => name.startsWith(p));
// @lobehub/eslint-config 2.1.5 registers most plugins only in file-scoped blocks, so a rule in a
// block without `files` fails with "could not find plugin" on files outside that scope.
const GLOB_JSX = '**/*.{jsx,tsx}';
const GLOB_TS_ONLY = '**/*.{ts,tsx,mts,cts}';
const GLOB_SRC = '**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}';
const JSX_PREFIXES = ['@eslint-react/', '@next/next/', 'jsx-a11y/', 'react-compiler/', 'react-hooks/', 'react-native/', 'react-refresh/', 'react/'];
function ruleScope(name) {
  if (!name.includes('/') || name.startsWith('@typescript-eslint/')) return 'global';
  if (name.startsWith('yml/')) return 'global';
  if (JSX_PREFIXES.some((p) => name.startsWith(p))) return GLOB_JSX;
  if (name.startsWith('perfectionist/')) return GLOB_TS_ONLY;
  return GLOB_SRC;
}

function migrateEslint() {
  const rcFile = firstExisting(ESLINT_RC);
  const flatFile = firstExisting(ESLINT_FLAT);
  const ignoreFile = exists('.eslintignore') ? '.eslintignore' : null;
  if (!rcFile && !ignoreFile) return;
  if (flatFile) {
    plan.notes.push(`${flatFile} already exists; not regenerating it.`);
    for (const f of [rcFile, ignoreFile].filter(Boolean)) {
      plan.todos.push(`${f}: still present next to ${flatFile}. Merge anything missing by hand, then delete it.`);
    }
    return;
  }

  const ignores = [];
  if (ignoreFile) {
    for (const line of read(ignoreFile).split('\n')) {
      const g = convertIgnore(line);
      if (g && !ignores.includes(g)) ignores.push(g);
    }
  }

  const rules = {};
  const overrides = [];
  const todo = [];
  let useRestricted = false;

  if (rcFile) {
    let loaded;
    try {
      loaded = loadConfig(rcFile);
    } catch (error) {
      todo.push(`could not evaluate ${rcFile} (${error.message}); port its rules by hand`);
    }
    if (loaded === null) todo.push(`${rcFile} is not JS/JSON; port its rules by hand`);
    if (loaded?.value) {
      const cfg = loaded.value;
      useRestricted = loaded.usesUiRestricted;
      if (!baseOf(cfg) && !(cfg.extends ?? []).toString().includes('@lobehub')) {
        todo.push(`${rcFile} does not extend @lobehub/lint; review the generated config`);
      }
      for (let [name, value] of Object.entries(cfg.rules ?? {})) {
        if (useRestricted && name === 'no-restricted-imports') continue;
        if (name.startsWith('import/')) {
          plan.notes.push(`eslint rule ${name} renamed to import-x/${name.slice(7)} (v2 uses eslint-plugin-import-x)`);
          name = `import-x/${name.slice(7)}`;
        }
        if (isKnownRule(name)) rules[name] = value;
        else todo.push(`rule ${quote(name)}: ${JSON.stringify(value)} (plugin not in @lobehub/lint 2.x; register the plugin or drop it)`);
      }
      for (const p of cfg.ignorePatterns ?? []) {
        const g = convertIgnore(p);
        if (g && !ignores.includes(g)) ignores.push(g);
      }
      for (const o of cfg.overrides ?? []) {
        const keys = extraKeys(o, ['files', 'rules', 'excludedFiles']);
        if (keys.length === 0 && o.files) {
          const entry = { files: [].concat(o.files), rules: o.rules ?? {} };
          if (o.excludedFiles) entry.ignores = [].concat(o.excludedFiles);
          overrides.push(entry);
        } else {
          todo.push(`override ${JSON.stringify(o)}`);
        }
      }
      for (const key of extraKeys(cfg, ['rules', 'ignorePatterns', 'overrides', 'extends'])) {
        if (baseOf(cfg)) {
          // keys of the stubbed v1 base object are not user config
          continue;
        }
        todo.push(`${key}: ${JSON.stringify(cfg[key])}`);
      }
    }
  }

  const options = {};
  if (ignores.length > 0) options.ignores = ignores;
  if (hasReact) options.react = true;

  const blocks = [toJs(options, 1)];
  if (useRestricted) blocks.push('restrictedImports');
  const scoped = new Map([
    ['global', { 'unicorn/no-anonymous-default-export': 'off' }],
    [GLOB_SRC, {}],
    [GLOB_TS_ONLY, {}],
    [GLOB_JSX, hasReact ? { 'react-refresh/only-export-components': 'off' } : {}],
  ]);
  // unicorn is registered for js/ts files only
  scoped.get(GLOB_SRC)['unicorn/no-anonymous-default-export'] = 'off';
  delete scoped.get('global')['unicorn/no-anonymous-default-export'];
  for (const [name, value] of Object.entries(rules)) scoped.get(ruleScope(name))[name] = value;
  for (const [files, block] of scoped) {
    if (Object.keys(block).length === 0) continue;
    blocks.push(toJs(files === 'global' ? { rules: block } : { files: [files], rules: block }, 1));
  }
  for (const o of overrides) blocks.push(toJs(o, 1));

  let out = "import { defineConfig } from '@lobehub/lint';\n";
  if (useRestricted) out += "import { restrictedImports } from '@lobehub/ui/eslint';\n";
  out += '\n';
  if (todo.length > 0) {
    out += `// TODO(lobe-lint v2 migration): not ported automatically from ${rcFile ?? '.eslintignore'}:\n`;
    out += todo.map((t) => `// - ${t}`).join('\n') + '\n';
  }
  out += `export default defineConfig(\n${blocks.map((b) => `  ${b},`).join('\n')}\n);\n`;

  plan.write.push(['eslint.config.mjs', out]);
  if (rcFile) plan.delete.push(rcFile);
  if (ignoreFile) plan.delete.push(ignoreFile);
  for (const t of todo) plan.todos.push(`eslint.config.mjs: ${t}`);
}

// ---------------------------------------------------------------- Stylelint

function migrateStylelint() {
  const rc = firstExisting(['.stylelintrc.js', '.stylelintrc.cjs', '.stylelintrc.json', '.stylelintrc', '.stylelintrc.yml', '.stylelintrc.yaml']);
  if (!rc) return;
  const flat = firstExisting(['stylelint.config.mjs', 'stylelint.config.js', 'stylelint.config.cjs']);
  if (flat) {
    plan.todos.push(`${rc}: still present next to ${flat}. Merge by hand, then delete it.`);
    return;
  }
  const todo = [];
  let cfg = {};
  try {
    const loaded = loadConfig(rc);
    if (loaded === null) todo.push(`${rc} is not JS/JSON; port it by hand`);
    else cfg = loaded.value ?? {};
  } catch (error) {
    todo.push(`could not evaluate ${rc} (${error.message}); port it by hand`);
  }
  const extra = {};
  for (const key of extraKeys(cfg, ['rules', 'extends', 'plugins', 'overrides'])) {
    if (baseOf(cfg)) continue;
    extra[key] = cfg[key];
  }
  let body = '  ...stylelint,\n';
  for (const [k, v] of Object.entries(extra)) body += `  ${IDENT.test(k) ? k : quote(k)}: ${indentBlock(toJs(v, 1), 0)},\n`;
  if (cfg.overrides?.length) {
    body += `  overrides: [...(stylelint.overrides ?? []), ...${indentBlock(toJs(cfg.overrides, 1), 0)}],\n`;
  }
  if (cfg.plugins?.length && !baseOf(cfg)) todo.push(`plugins ${JSON.stringify(cfg.plugins)}`);
  if (cfg.extends && !baseOf(cfg)) todo.push(`extends ${JSON.stringify(cfg.extends)}`);
  const rules = cfg.rules ?? {};
  if (Object.keys(rules).length > 0) {
    // base rules first, repo overrides last so they win
    const lines = Object.entries(rules).map(([k, v]) => `    ${IDENT.test(k) ? k : quote(k)}: ${indentBlock(toJs(v, 2), 0)},`);
    body += `  rules: {\n    ...stylelint.rules,\n${lines.join('\n')}\n  },\n`;
  }
  let out = "import { stylelint } from '@lobehub/lint';\n\n";
  if (todo.length > 0) out += todo.map((t) => `// TODO(lobe-lint v2 migration): ${t}`).join('\n') + '\n';
  out += body === '  ...stylelint,\n' ? 'export default stylelint;\n' : `export default {\n${body}};\n`;
  plan.write.push(['stylelint.config.mjs', out]);
  plan.delete.push(rc);
  for (const t of todo) plan.todos.push(`stylelint.config.mjs: ${t}`);
}

// ---------------------------------------------------------------- one-export configs

function migrateSimple({ exportName, olds, target, targets }) {
  const rc = firstExisting(olds);
  if (!rc) return;
  const present = firstExisting(targets);
  if (present) {
    plan.todos.push(`${rc}: still present next to ${present}. Merge by hand, then delete it.`);
    return;
  }
  let cfg;
  const todo = [];
  try {
    const loaded = loadConfig(rc);
    if (loaded === null) todo.push(`${rc} is not JS/JSON; port it by hand`);
    else cfg = loaded.value;
  } catch (error) {
    todo.push(`could not evaluate ${rc} (${error.message}); port it by hand`);
  }
  const name = baseOf(cfg);
  let out;
  if (name && extraKeys(cfg, ['rules']).length === 0 && Object.keys(cfg.rules).length === 0) {
    out = `import { ${name} } from '@lobehub/lint';\n\nexport default ${name};\n`;
  } else if (name) {
    const extra = Object.fromEntries(Object.entries(cfg).filter(([k]) => k !== 'rules' || Object.keys(cfg.rules).length));
    out = `import { ${name} } from '@lobehub/lint';\n\nexport default {\n  ...${name},\n${Object.entries(extra)
      .map(([k, v]) => `  ${IDENT.test(k) ? k : quote(k)}: ${indentBlock(toJs(v, 1), 0)},`)
      .join('\n')}\n};\n`;
  } else if (cfg && typeof cfg === 'object') {
    out = `// TODO(lobe-lint v2 migration): ${rc} did not use @lobehub/lint; copied as-is.\nexport default ${toJs(cfg, 0)};\n`;
    todo.push(`${rc} did not use @lobehub/lint (expected \`${exportName}\`); review ${target}`);
  } else {
    out = `import { ${exportName} } from '@lobehub/lint';\n\n// TODO(lobe-lint v2 migration): port ${rc} by hand\nexport default ${exportName};\n`;
  }
  plan.write.push([target, out]);
  plan.delete.push(rc);
  for (const t of todo) plan.todos.push(`${target}: ${t}`);
}

// ---------------------------------------------------------------- .changelogrc / .releaserc (CommonJS)

// Two configs stay CommonJS because the tools that read them cannot load `.mjs`:
// - conventional-changelog-gitmoji-config (release notes) reads `.changelogrc*` with cosmiconfig 7
//   at require time: sync, no `.mjs`;
// - semantic-release 21 depends on cosmiconfig ^8.0.0, and lockfiles that resolved 8.0 / 8.1
//   (pnpm in lobe-icons / lobe-charts) never look at `.releaserc.mjs`; semantic-release then runs
//   with its defaults and no gitmoji release ever happens.
// A `.mjs` file there is silently ignored, so these are written as `.cjs` and require the
// CommonJS-safe `@lobehub/lint/*` entries (the root `@lobehub/lint` entry cannot be required).
const srMajor = Number(String(allDeps['semantic-release'] ?? '').match(/\d+/)?.[0] ?? 0);
const CJS_RC = {
  changelog: {
    entries: { changelog: '@lobehub/lint/changelog' },
    files: ['.changelogrc.js', '.changelogrc.cjs', '.changelogrc.json', '.changelogrc', '.changelogrc.mjs'],
    header:
      '// CommonJS on purpose: conventional-changelog-gitmoji-config reads this file with cosmiconfig 7,\n' +
      '// which ignores .changelogrc.mjs.\n',
    // an existing .mjs is never read, whatever the semantic-release version
    keepMjs: () => false,
    rc: '.changelogrc',
  },
  release: {
    entries: {
      semanticRelease: '@lobehub/lint/release',
      semanticReleaseMonoRepo: '@lobehub/lint/release-monorepo',
    },
    files: ['.releaserc.js', '.releaserc.cjs', '.releaserc.json', '.releaserc', '.releaserc.mjs'],
    header:
      '// CommonJS on purpose: semantic-release 21 with cosmiconfig 8.0 / 8.1 ignores .releaserc.mjs.\n',
    // semantic-release >= 22 needs cosmiconfig >= 8.3, which loads .mjs
    keepMjs: () => srMajor >= 22,
    rc: '.releaserc',
  },
};
const mjsTemplate = (name) =>
  new RegExp(String.raw`^\s*import\s*\{\s*${name}\s*\}\s*from\s*["']@lobehub\/lint["'];?\s*export\s+default\s+${name};?\s*$`);

const rel = (from, to) => {
  const r = path.posix.relative(from === '.' ? '' : from, to === '.' ? '' : to) || '.';
  return r.startsWith('.') ? r : `./${r}`;
};

function migrateCjsRc(kind, dir = '.') {
  const spec = CJS_RC[kind];
  const at = (f) => (dir === '.' ? f : path.posix.join(dir, f));
  const found = spec.files.filter((f) => exists(at(f)));
  if (found.length === 0) return;
  const target = at(`${spec.rc}.cjs`);
  const cjs = (entry) => `${spec.header}module.exports = require('${entry}');\n`;

  // already migrated
  if (exists(target) && /@lobehub\/lint\/|require\(["']\.{1,2}\//.test(read(target))) {
    for (const f of found.filter((f) => at(f) !== target)) {
      plan.todos.push(`${at(f)}: still present next to ${target}. Merge by hand, then delete it.`);
    }
    return;
  }

  // a workspace package that re-exports another config of the same kind (usually the root one)
  if (dir !== '.') {
    const ref = read(at(found[0])).match(
      new RegExp(String.raw`(?:require\(\s*|from\s+)["'](\.{1,2}\/[^"']*?` + spec.rc.replace('.', String.raw`\.`) + String.raw`(?:\.[a-z]+)?)["']`),
    )?.[1];
    if (ref) {
      const refDir = path.posix.normalize(path.posix.join(dir, path.posix.dirname(ref)));
      plan.write.push([target, cjs(`${rel(dir, refDir)}/${spec.rc}.cjs`)]);
      for (const f of found) if (at(f) !== target) plan.delete.push(at(f));
      if (refDir !== '.') plan.todos.push(`${target}: re-exports ${refDir}/${spec.rc}.cjs; make sure that file exists (run this script there too)`);
      return;
    }
  }

  const v1 = found.filter((f) => !f.endsWith('.mjs'));
  const mjs = found.includes(`${spec.rc}.mjs`) ? at(`${spec.rc}.mjs`) : null;
  if (v1.length > 1) {
    plan.todos.push(`${dir}: several ${spec.rc} files (${v1.join(', ')}); keeping ${v1[0]}, merge the rest by hand`);
  }

  let out;
  const todo = [];
  const [firstEntry] = Object.values(spec.entries);
  if (v1.length > 0) {
    const rc = at(v1[0]);
    let cfg;
    try {
      const loaded = loadConfig(rc);
      if (loaded === null) todo.push(`${rc} is not JS/JSON; port it by hand`);
      else cfg = loaded.value;
    } catch (error) {
      todo.push(`could not evaluate ${rc} (${error.message}); port it by hand`);
    }
    const name = baseOf(cfg);
    const entry = spec.entries[name];
    const extra = entry ? Object.fromEntries(Object.entries(cfg).filter(([k]) => k !== 'rules' || Object.keys(cfg.rules).length)) : {};
    if (entry && Object.keys(extra).length === 0) {
      out = cjs(entry);
    } else if (entry) {
      out = `${spec.header}module.exports = {\n  ...require('${entry}'),\n${Object.entries(extra)
        .map(([k, v]) => `  ${IDENT.test(k) ? k : quote(k)}: ${indentBlock(toJs(v, 1), 0)},`)
        .join('\n')}\n};\n`;
    } else if (cfg && typeof cfg === 'object' && !name) {
      out = `${spec.header}// TODO(lobe-lint v2 migration): ${rc} did not use @lobehub/lint; copied as-is.\nmodule.exports = ${toJs(cfg, 0)};\n`;
      todo.push(`${rc} did not use @lobehub/lint (expected ${Object.keys(spec.entries).join(' or ')}); review ${target}`);
    } else {
      out = `${spec.header}// TODO(lobe-lint v2 migration): port ${rc} by hand\nmodule.exports = require('${firstEntry}');\n`;
      todo.push(`port ${rc} by hand`);
    }
    if (mjs) todo.push(`${mjs}: also present; merge anything custom into ${target} by hand`);
  } else if (spec.keepMjs()) {
    return;
  } else {
    const name = Object.keys(spec.entries).find((n) => mjsTemplate(n).test(read(mjs)));
    if (!name) {
      plan.todos.push(
        `${mjs}: ${kind === 'changelog' ? 'cosmiconfig 7 (conventional-changelog-gitmoji-config)' : 'semantic-release 21 with cosmiconfig < 8.2'} never reads it. Rewrite it as ${target}: module.exports = { ...require('${firstEntry}'), /* your options */ }`,
      );
      return;
    }
    out = cjs(spec.entries[name]);
  }

  plan.write.push([target, out]);
  for (const f of found) if (at(f) !== target) plan.delete.push(at(f));
  for (const t of todo) plan.todos.push(`${target}: ${t}`);
}

// ---------------------------------------------------------------- workspace packages

/** Directories of the workspace packages (pnpm-workspace.yaml or package.json `workspaces`). */
function workspaceDirs() {
  const patterns = [];
  if (exists('pnpm-workspace.yaml')) {
    let inPackages = false;
    for (const line of read('pnpm-workspace.yaml').split('\n')) {
      if (/^packages\s*:/.test(line)) inPackages = true;
      else if (/^\S/.test(line)) inPackages = false;
      else if (inPackages) {
        const m = line.match(/^\s*-\s*["']?([^"'#]+?)["']?\s*(?:#.*)?$/);
        if (m) patterns.push(m[1]);
      }
    }
  }
  const ws = Array.isArray(pkg.workspaces) ? pkg.workspaces : (pkg.workspaces?.packages ?? []);
  patterns.push(...ws);

  const dirs = new Set();
  const isDir = (d) => fs.statSync(path.join(cwd, d), { throwIfNoEntry: false })?.isDirectory();
  const children = (d) =>
    fs
      .readdirSync(path.join(cwd, d), { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules')
      .map((e) => (d === '.' ? e.name : `${d}/${e.name}`));
  const walk = (d, parts, depth = 0) => {
    if (parts.length === 0) {
      if (d !== '.' && exists(`${d}/package.json`)) dirs.add(d);
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
      if (isDir(next)) walk(next, rest, depth);
    }
  };
  for (const p of patterns) {
    if (p.startsWith('!')) continue;
    walk('.', p.replace(/^\.\//, '').replace(/\/$/, '').split('/').filter(Boolean));
  }
  return [...dirs].sort();
}

// ---------------------------------------------------------------- package.json

function migratePackageJson() {
  const next = structuredClone(pkg);
  const changes = [];
  for (const [name, range] of Object.entries(VERSIONS)) {
    for (const field of ['dependencies', 'devDependencies']) {
      const cur = next[field]?.[name];
      if (cur && cur !== range) {
        next[field][name] = range;
        changes.push(`${field}.${name}: ${cur} -> ${range}`);
      }
    }
  }
  if (!allDeps['@lobehub/lint']) {
    next.devDependencies = { ...next.devDependencies, '@lobehub/lint': VERSIONS['@lobehub/lint'] };
    changes.push(`devDependencies.@lobehub/lint: (none) -> ${VERSIONS['@lobehub/lint']}`);
  }

  // lint-staged: lobe-ui formats Markdown with Prettier only (no remark in the hook)
  const ls = next['lint-staged'];
  if (ls && typeof ls === 'object') {
    const rebuilt = {};
    for (const [glob, cmds] of Object.entries(ls)) {
      const list = [].concat(cmds);
      if (/\bmdx?\b/.test(glob) && list.some((c) => /^remark\b/.test(c))) {
        const kept = list.filter((c) => !/^remark\b/.test(c));
        const key = glob === '*.md' ? '*.{md,mdx}' : glob;
        rebuilt[key] = kept.length ? kept : ['prettier --write --no-error-on-unmatched-pattern'];
        changes.push(`lint-staged["${glob}"]: drop ${list.filter((c) => /^remark\b/.test(c)).join(', ')}${key === glob ? '' : `; key -> "${key}"`}`);
      } else {
        rebuilt[glob] = cmds;
      }
    }
    next['lint-staged'] = rebuilt;
  }

  for (const [name, cmd] of Object.entries(next.scripts ?? {})) {
    if (!/\beslint\b/.test(cmd)) continue;
    let fixed = cmd.replace(/\s--ignore-path\s+\S*\.eslintignore\b/, '');
    if (fixed !== cmd) changes.push(`scripts.${name}: drop --ignore-path (flat config reads ignores)`);
    if (/\s--ext\b/.test(fixed)) plan.notes.push(`scripts.${name}: \`--ext\` still works (re-added in ESLint 9.21), lobe-ui puts the extensions in the file glob instead`);
    if (/\s--resolve-plugins-relative-to\b|\s--rulesdir\b|\s(?:--no-eslintrc|--env)\b|\s--ignore-path\b/.test(fixed)) {
      plan.todos.push(`scripts.${name}: uses an eslintrc-only CLI flag: ${fixed}`);
    }
    next.scripts[name] = fixed;
  }

  const node = next.engines?.node;
  const m = node?.match(/(\d+)(?:\.(\d+))?/);
  if (m && (Number(m[1]) < 20 || (Number(m[1]) === 20 && Number(m[2] ?? 0) < 19))) {
    plan.notes.push(`engines.node is "${node}"; ESLint 10 needs ^20.19.0 || ^22.13.0 || >=24 (lobe-ui uses >=22.22.0). Not changed.`);
  }

  if (changes.length > 0) {
    const indent = pkgRaw.match(/^[\t ]+/m)?.[0] ?? '  ';
    plan.write.push(['package.json', JSON.stringify(next, null, indent) + (pkgRaw.endsWith('\n') ? '\n' : '')]);
    plan.notes.push(...changes.map((c) => `package.json ${c}`));
  }
}

// ---------------------------------------------------------------- run

migrateEslint();
migrateStylelint();
migrateSimple({ exportName: 'prettier', olds: ['.prettierrc.js', '.prettierrc.cjs', '.prettierrc.json', '.prettierrc'], target: 'prettier.config.mjs', targets: ['prettier.config.mjs', 'prettier.config.js', 'prettier.config.cjs'] });
migrateSimple({ exportName: 'commitlint', olds: ['.commitlintrc.js', '.commitlintrc.cjs', '.commitlintrc.json', '.commitlintrc'], target: 'commitlint.config.mjs', targets: ['commitlint.config.mjs', 'commitlint.config.js', 'commitlint.config.cjs'] });
migrateSimple({ exportName: 'remarklint', olds: ['.remarkrc.js', '.remarkrc.cjs', '.remarkrc.json', '.remarkrc'], target: '.remarkrc.mjs', targets: ['.remarkrc.mjs'] });
const packages = workspaceDirs();
for (const kind of ['release', 'changelog']) {
  migrateCjsRc(kind);
  for (const dir of packages) migrateCjsRc(kind, dir);
}
if (firstExisting(['release.config.mjs', 'release.config.js']) && srMajor < 22) {
  plan.todos.push('release.config.*: semantic-release 21 with cosmiconfig < 8.2 does not load ESM configs; use .releaserc.cjs with require(\'@lobehub/lint/release\')');
}
// other workspace package rc files that load a root file this run deletes
const RC_FILE = /^(?:\.(?:eslintrc|prettierrc|stylelintrc|commitlintrc|remarkrc|releaserc)(?:\.[a-z]+)?|(?:eslint|prettier|stylelint|commitlint|release)\.config\.[a-z]+)$/;
for (const dir of packages) {
  for (const name of fs.readdirSync(path.join(cwd, dir))) {
    if (!RC_FILE.test(name) || plan.delete.includes(`${dir}/${name}`)) continue;
    const src = read(`${dir}/${name}`);
    for (const m of src.matchAll(/(?:require\(\s*|from\s+)["'](\.{1,2}\/[^"']+)["']/g)) {
      const ref = path.posix.normalize(path.posix.join(dir, m[1]));
      const gone = plan.delete.find((f) => f === ref || f.replace(/\.[a-z]+$/, '') === ref);
      const written = plan.write.some(([f]) => f === ref);
      if (gone) plan.todos.push(`${dir}/${name}: loads ${gone}, which this script deletes; point it at the new root config`);
      else if (!written && !(m[0].startsWith('require') ? ['', '.js', '.json'] : ['']).some((ext) => exists(ref + ext))) {
        plan.todos.push(`${dir}/${name}: loads ${m[1]}, which does not exist; point it at the new root config`);
      }
    }
  }
}
migratePackageJson();

const hooks = ['.husky/pre-commit', '.husky/commit-msg'].filter(exists);

console.log(`lobe-lint v2 config migration${dryRun ? ' (dry run)' : ''}: ${cwd}\n`);
if (plan.write.length === 0 && plan.delete.length === 0) {
  console.log('Nothing to migrate: no @lobehub/lint 1.x config files found.');
} else {
  for (const [file] of plan.write) console.log(`  write   ${file}`);
  for (const file of plan.delete) console.log(`  delete  ${file}`);
}
if (plan.notes.length > 0) console.log(`\nNotes:\n${plan.notes.map((n) => `  - ${n}`).join('\n')}`);
if (plan.todos.length > 0) console.log(`\nNeeds a manual look (also left as TODO comments):\n${plan.todos.map((n) => `  - ${n}`).join('\n')}`);
if (hooks.length > 0) console.log(`\nHusky hooks left untouched: ${hooks.join(', ')}`);

if (!dryRun) {
  for (const [file, content] of plan.write) fs.writeFileSync(path.join(cwd, file), content);
  for (const file of plan.delete) fs.rmSync(path.join(cwd, file));
}

if (plan.write.length > 0 || plan.delete.length > 0) {
  console.log(`
Next steps${dryRun ? ' (after running without --dry-run)' : ''}:
  1. Install: pnpm install (or your package manager)
  2. Format the new files: npx prettier --write "*.config.mjs" .remarkrc.mjs .releaserc.cjs .changelogrc.cjs package.json
  3. Check the configs load: npx eslint --print-config src/index.ts > /dev/null && npx stylelint --print-config src/index.ts > /dev/null
  4. Fix: npx eslint "{src,tests}/**/*.{js,jsx,ts,tsx}" --fix, then npx prettier --write on the same files
     (ESLint fixers do not format), then fix the remaining errors by hand
  5. Verify: lint, lint:style, type-check, test, build, and one commit through the hooks
Nothing was installed or committed.`);
}
