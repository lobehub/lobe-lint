#!/usr/bin/env node
// Convert project-local default exports to named exports and update every importer.
//
// Usage:
//   node default-export.mjs [--dry-run] [--ignore <glob>]... [--no-keep-public-entry] [--tsconfig <file>] [cwd]
//
// Needs `npm install` in this scripts/ directory once (ts-morph, minimatch).
// Idempotent: a second run changes nothing. Never commits.

import fs from 'node:fs';
import path from 'node:path';

import { minimatch } from 'minimatch';
import { Node, Project, SyntaxKind, ts } from 'ts-morph';

// ---------------------------------------------------------------- CLI

const argv = process.argv.slice(2);
const opts = { dryRun: false, ignores: [], keepPublicEntry: true, tsconfig: undefined };
let cwdArg;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--dry-run') opts.dryRun = true;
  else if (a === '--ignore') opts.ignores.push(argv[++i]);
  else if (a === '--keep-public-entry') opts.keepPublicEntry = true;
  else if (a === '--no-keep-public-entry') opts.keepPublicEntry = false;
  else if (a === '--tsconfig') opts.tsconfig = argv[++i];
  else if (a === '-h' || a === '--help') {
    console.log(
      'Usage: node default-export.mjs [--dry-run] [--ignore <glob>]... [--no-keep-public-entry] [--tsconfig <file>] [cwd]',
    );
    process.exit(0);
  } else if (a.startsWith('-')) {
    console.error(`Unknown option ${a}`);
    process.exit(1);
  } else cwdArg = a;
}
const cwd = path.resolve(cwdArg ?? process.cwd());

// Files that must keep `export default`.
// 1. The exemptions @lobehub/eslint-config 2.1.5 ships for `no-restricted-syntax`
//    (GLOB_CONFIG_FILES + GLOB_NEXT_APP_FILES in packages/eslint-config/src/globs.ts).
const ESLINT_CONFIG_EXEMPT = [
  '**/*.config.{js,mjs,ts,mts,cjs,cts}',
  '**/app/**/page.{js,jsx,ts,tsx}',
  '**/app/**/layout.{js,jsx,ts,tsx}',
  '**/app/**/loading.{js,jsx,ts,tsx}',
  '**/app/**/error.{js,jsx,ts,tsx}',
  '**/app/**/not-found.{js,jsx,ts,tsx}',
  '**/app/**/template.{js,jsx,ts,tsx}',
  '**/app/**/default.{js,jsx,ts,tsx}',
  '**/app/**/route.{js,ts}',
  '**/app/**/opengraph-image.{js,jsx,ts,tsx}',
  '**/app/**/twitter-image.{js,jsx,ts,tsx}',
  '**/app/**/apple-icon.{js,jsx,ts,tsx}',
  '**/app/**/icon.{js,jsx,ts,tsx}',
  '**/app/**/sitemap.{js,ts}',
  '**/app/**/robots.{js,ts}',
  '**/app/**/manifest.{js,ts}',
];
// 2. Framework contracts that eslint-config does not know about.
const FRAMEWORK_EXEMPT = [
  '**/demos/**', // docs-kit / dumi demos: one default-export component per file
  '**/*.d.ts',
  '**/node_modules/**',
  '**/.react-router/**',
  '**/{dist,es,lib}/**',
  '**/__snapshots__/**',
];

const rel = (f) => path.relative(cwd, f).split(path.sep).join('/');
const report = { converted: [], keptEntries: [], manual: [], reexportsUpdated: 0, skipped: [], touched: new Set() };

// docs-kit homePage must default-export (virtual:lobedocs/home-page contract)
const homePage = (() => {
  for (const f of ['docs.config.ts', 'docs.config.mts', 'docs.config.js', 'docs.config.mjs']) {
    const p = path.join(cwd, f);
    if (!fs.existsSync(p)) continue;
    const m = fs.readFileSync(p, 'utf8').match(/homePage:\s*['"]([^'"]+)['"]/);
    if (m) return rel(path.resolve(cwd, m[1]));
  }
  return undefined;
})();
const exemptGlobs = [...ESLINT_CONFIG_EXEMPT, ...FRAMEWORK_EXEMPT, ...opts.ignores];
const isExempt = (file) => {
  const r = rel(file);
  if (r === homePage) return 'docs-kit homePage';
  const g = exemptGlobs.find((glob) => minimatch(r, glob, { dot: true }));
  return g ? `matches ${g}` : undefined;
};

// ---------------------------------------------------------------- project

const tsconfig = path.resolve(cwd, opts.tsconfig ?? 'tsconfig.json');
const project = fs.existsSync(tsconfig)
  ? new Project({ tsConfigFilePath: tsconfig })
  : new Project({ compilerOptions: { allowJs: true, jsx: ts.JsxEmit.ReactJSX } });
if (!fs.existsSync(tsconfig)) project.addSourceFilesAtPaths([`${cwd}/src/**/*.{ts,tsx,js,jsx}`]);
const compilerOptions = project.getCompilerOptions();
const inProject = (sf) => {
  const f = sf.getFilePath();
  return f.startsWith(cwd + path.sep) && !f.includes(`${path.sep}node_modules${path.sep}`);
};
const files = project.getSourceFiles().filter(inProject);

const importerCount = new Map();
const noteImport = (to) => importerCount.set(to, (importerCount.get(to) ?? 0) + 1);
const resolveCache = new Map();
function resolveSpecifier(spec, fromFile) {
  const key = `${fromFile}\0${spec}`;
  if (resolveCache.has(key)) return resolveCache.get(key);
  const clean = spec.replace(/\?.*$/, '');
  const r = ts.resolveModuleName(clean, fromFile, compilerOptions, ts.sys).resolvedModule;
  let out;
  if (r && !r.isExternalLibraryImport) {
    const f = path.resolve(r.resolvedFileName);
    if (f.startsWith(cwd + path.sep) && !f.includes(`${path.sep}node_modules${path.sep}`)) out = f;
  }
  resolveCache.set(key, out);
  return out;
}

// ---------------------------------------------------------------- public entries

function publicEntries() {
  const pkgFile = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgFile)) return new Set();
  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
  const targets = [];
  const walk = (v) => {
    if (typeof v === 'string') targets.push(v);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk([pkg.main, pkg.module, pkg.types, pkg.exports]);
  const out = new Set();
  for (const t of targets) {
    if (t.includes('*')) continue;
    const stem = t
      .replace(/^\.\//, '')
      .replace(/^(es|lib|dist|build)\//, 'src/')
      .replace(/\.d\.(m|c)?ts$/, '')
      .replace(/\.(m|c)?js$/, '');
    for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx', '.js', '.jsx']) {
      const f = path.join(cwd, stem + ext);
      if (fs.existsSync(f)) {
        out.add(f);
        break;
      }
    }
  }
  return out;
}
const entries = publicEntries();
const pkgJson = fs.existsSync(path.join(cwd, 'package.json'))
  ? JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'))
  : {};
const hasWildcardExports = JSON.stringify(pkgJson.exports ?? {}).includes('*');

// ---------------------------------------------------------------- naming

const words = (s) => s.split(/[^\dA-Za-z]+|(?<=[a-z\d])(?=[A-Z])/).filter(Boolean);
const pascal = (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const camel = (s) => {
  const p = pascal(s);
  return p ? p[0].toLowerCase() + p.slice(1) : p;
};
function nameFromFile(file, component = false) {
  const parsed = path.parse(file);
  let base = parsed.name;
  if (base === 'index') base = path.basename(parsed.dir);
  let id = component || /^[A-Z]/.test(base) ? pascal(base) : camel(base);
  if (!id) id = 'defaultExport';
  if (/^\d/.test(id)) id = `_${id}`;
  return id;
}
function localNames(sf) {
  const names = new Set();
  sf.getDescendantsOfKind(SyntaxKind.Identifier).forEach((i) => names.add(i.getText()));
  return names;
}

// ---------------------------------------------------------------- step 1: convert modules

/** file -> exported name that replaced `default` */
const converted = new Map();

function convertModule(sf) {
  const file = sf.getFilePath();
  const exportedNames = new Set([...sf.getExportedDeclarations().keys()].filter((n) => n !== 'default'));

  // export default <expr> | export = <expr>
  for (const ea of sf.getExportAssignments()) {
    if (ea.isExportEquals()) {
      report.manual.push(`${rel(file)}:${ea.getStartLineNumber()} \`export =\` (CommonJS); convert by hand`);
      return undefined;
    }
    const expr = ea.getExpression();
    if (Node.isIdentifier(expr)) {
      const name = expr.getText();
      const sym = expr.getSymbol();
      const decl = sym?.getDeclarations()?.[0];
      const isImport =
        decl && (Node.isImportClause(decl) || Node.isImportSpecifier(decl) || Node.isNamespaceImport(decl));
      // `const Icons = …; export default Icons` in Ace/index.ts -> `export { Icons as Ace }`:
      // a component's export is named after its file (or directory for index), like the
      // anonymous case, when both names are PascalCase and the file name is free.
      const preferred = nameFromFile(file);
      if (
        !exportedNames.has(name) &&
        preferred !== name &&
        /^[A-Z]/.test(name) &&
        /^[A-Z]/.test(preferred) &&
        !exportedNames.has(preferred) &&
        !localNames(sf).has(preferred)
      ) {
        ea.replaceWithText(`export { ${name} as ${preferred} };`);
        return preferred;
      }
      if (exportedNames.has(name)) {
        ea.remove();
      } else if (isImport || !decl) {
        ea.replaceWithText(`export { ${name} };`);
      } else {
        const stmt = Node.isVariableDeclaration(decl) ? decl.getVariableStatement() : decl;
        if (stmt && Node.isExportable(stmt) && stmt.getParent() === sf) {
          stmt.setIsExported(true);
          ea.remove();
        } else {
          ea.replaceWithText(`export { ${name} };`);
        }
      }
      return name;
    }
    // a function or memo()/forwardRef() in a .jsx/.tsx file is a component: PascalCase
    const component =
      /\.[jt]sx$/.test(file) &&
      (Node.isArrowFunction(expr) ||
        Node.isFunctionExpression(expr) ||
        (Node.isCallExpression(expr) && /(^|\.)(memo|forwardRef)$/.test(expr.getExpression().getText())));
    let name = nameFromFile(file, component);
    if (exportedNames.has(name) || localNames(sf).has(name)) {
      const alt = `${name}Default`;
      if (localNames(sf).has(alt)) {
        report.manual.push(`${rel(file)}:${ea.getStartLineNumber()} cannot pick a free export name (${name})`);
        return undefined;
      }
      report.manual.push(
        `${rel(file)}:${ea.getStartLineNumber()} \`${name}\` is taken in this file; exported the default as \`${alt}\`, consider a better name`,
      );
      name = alt;
    }
    const exprText = expr.getText();
    const isTypeOnly = false;
    ea.replaceWithText(`export const ${name} = ${exprText};`);
    void isTypeOnly;
    return name;
  }

  // export default function / class (named or anonymous)
  const decl = sf
    .getStatements()
    .find(
      (s) =>
        (Node.isFunctionDeclaration(s) || Node.isClassDeclaration(s)) && s.isDefaultExport() && s.hasExportKeyword(),
    );
  if (decl) {
    let name = decl.getName();
    if (!name) {
      name = nameFromFile(file, /\.[jt]sx$/.test(file) && Node.isFunctionDeclaration(decl));
      if (localNames(sf).has(name)) name = `${name}Default`;
      decl.rename?.(name);
      if (!decl.getName()) decl.setName?.(name);
    }
    decl.setIsDefaultExport(false);
    decl.setIsExported(true);
    return name;
  }

  // export { foo as default } [from './x']
  for (const ed of sf.getExportDeclarations()) {
    for (const spec of ed.getNamedExports()) {
      const alias = spec.getAliasNode()?.getText();
      if (alias !== 'default') continue;
      const local = spec.getNameNode().getText();
      if (ed.getModuleSpecifierValue()) {
        // export { Foo as default } from './x'
        spec.removeAlias();
        return local;
      }
      if (exportedNames.has(local)) spec.remove();
      else spec.removeAlias();
      if (ed.getNamedExports().length === 0) ed.remove();
      return local;
    }
  }

  // export { default } from './x'  (barrel default re-export)
  for (const ed of sf.getExportDeclarations()) {
    const target = ed.getModuleSpecifierValue();
    if (!target) continue;
    for (const spec of ed.getNamedExports()) {
      if (spec.getNameNode().getText() !== 'default' || spec.getAliasNode()) continue;
      const to = resolveSpecifier(target, file);
      const toName = to && converted.get(to);
      if (!toName) return undefined; // handled once the target is converted
      noteImport(to);
      spec.setName(toName);
      return toName;
    }
  }
  return undefined;
}

function hasDefaultExport(sf) {
  if (sf.getExportAssignments().length > 0) return true;
  if (
    sf
      .getStatements()
      .some((s) => (Node.isFunctionDeclaration(s) || Node.isClassDeclaration(s)) && s.isDefaultExport())
  )
    return true;
  return sf
    .getExportDeclarations()
    .some((ed) =>
      ed
        .getNamedExports()
        .some(
          (s) =>
            s.getAliasNode()?.getText() === 'default' ||
            (s.getNameNode().getText() === 'default' && !s.getAliasNode()),
        ),
    );
}

const candidates = files.filter(hasDefaultExport);
// Barrels (`export { default } from`) depend on their target, so iterate until stable.
let pending = candidates.filter((sf) => {
  const reason = isExempt(sf.getFilePath());
  if (reason) {
    report.skipped.push(`${rel(sf.getFilePath())} (${reason})`);
    return false;
  }
  if (opts.keepPublicEntry && entries.has(sf.getFilePath())) {
    report.keptEntries.push(rel(sf.getFilePath()));
    return false;
  }
  return true;
});
for (let round = 0; round < 10 && pending.length > 0; round++) {
  const next = [];
  for (const sf of pending) {
    const name = convertModule(sf);
    if (name) {
      converted.set(sf.getFilePath(), name);
      report.converted.push(`${rel(sf.getFilePath())} -> export ${name}`);
      report.touched.add(sf.getFilePath());
    } else if (hasDefaultExport(sf)) next.push(sf);
  }
  if (next.length === pending.length) {
    for (const sf of next) report.manual.push(`${rel(sf.getFilePath())}: default export not converted`);
    break;
  }
  pending = next;
}

// ---------------------------------------------------------------- step 2: update importers

function rewriteImports(sf) {
  const file = sf.getFilePath();
  let changed = false;

  for (const imp of sf.getImportDeclarations()) {
    // import { default as X } from './x'
    for (const spec of imp.getNamedImports()) {
      if (spec.getNameNode().getText() !== 'default') continue;
      const to = resolveSpecifier(imp.getModuleSpecifierValue(), file);
      const name = to && converted.get(to);
      if (!name) continue;
      noteImport(to);
      const alias = spec.getAliasNode()?.getText();
      spec.setName(name);
      if (alias === name) spec.removeAlias();
      changed = true;
    }
    const def = imp.getDefaultImport();
    if (!def) continue;
    const to = resolveSpecifier(imp.getModuleSpecifierValue(), file);
    const name = to && converted.get(to);
    if (!name) continue;
    noteImport(to);
    const local = def.getText();
    imp.removeDefaultImport();
    const ns = imp.getNamespaceImport();
    if (ns) {
      // import Foo, * as ns from './x'  ->  keep namespace, add a second import
      imp.getParentOrThrow();
      sf.insertImportDeclaration(imp.getChildIndex() + 1, {
        isTypeOnly: imp.isTypeOnly(),
        moduleSpecifier: imp.getModuleSpecifierValue(),
        namedImports: [local === name ? name : { alias: local, name }],
      });
    } else {
      imp.insertNamedImport(0, local === name ? name : { alias: local, name });
    }
    changed = true;
  }

  for (const ed of sf.getExportDeclarations()) {
    const target = ed.getModuleSpecifierValue();
    if (!target) continue;
    const to = resolveSpecifier(target, file);
    const name = to && converted.get(to);
    if (!name || to === file) continue;
    noteImport(to);
    for (const spec of ed.getNamedExports()) {
      if (spec.getNameNode().getText() !== 'default') continue;
      const alias = spec.getAliasNode()?.getText();
      if (!alias) {
        // bare `export { default } from` left in a file that keeps its default export
        // (exempt file or public entry): keep the default, point it at the new name
        spec.setName(name);
        spec.setAlias('default');
        report.reexportsUpdated++;
        changed = true;
        continue;
      }
      spec.setName(name);
      if (alias === name) spec.removeAlias();
      report.reexportsUpdated++;
      changed = true;
    }
  }

  // dynamic import()
  for (const call of sf.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    if (call.getExpression().getKind() !== SyntaxKind.ImportKeyword) continue;
    const arg = call.getArguments()[0];
    if (!arg || !Node.isStringLiteral(arg)) continue;
    const to = resolveSpecifier(arg.getLiteralValue(), file);
    const name = to && converted.get(to);
    if (!name) continue;
    noteImport(to);
    const where = `${rel(file)}:${call.getStartLineNumber()}`;

    // (await import('./x')).default
    let parent = call.getParent();
    while (parent && (Node.isAwaitExpression(parent) || Node.isParenthesizedExpression(parent))) parent = parent.getParent();
    if (parent && Node.isPropertyAccessExpression(parent) && parent.getName() === 'default') {
      parent.getNameNode().replaceWithText(name);
      changed = true;
      continue;
    }
    // import('./x').then((m) => m.default) / .then(({ default: X }) => ...)
    if (parent && Node.isPropertyAccessExpression(parent) && parent.getName() === 'then') {
      const thenCall = parent.getParent();
      const cb = Node.isCallExpression(thenCall) ? thenCall.getArguments()[0] : undefined;
      if (cb && (Node.isArrowFunction(cb) || Node.isFunctionExpression(cb))) {
        const p = cb.getParameters()[0];
        let done = false;
        if (p && Node.isObjectBindingPattern(p.getNameNode())) {
          for (const el of p.getNameNode().getElements()) {
            if ((el.getPropertyNameNode()?.getText() ?? el.getName()) === 'default') {
              el.getPropertyNameNode()?.replaceWithText(name);
              done = true;
            }
          }
        } else if (p) {
          const pn = p.getName();
          for (const pa of cb.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)) {
            if (pa.getExpression().getText() === pn && pa.getName() === 'default') {
              pa.getNameNode().replaceWithText(name);
              done = true;
            }
          }
        }
        if (done) {
          changed = true;
          continue;
        }
      }
    }
    // lazy(() => import('./x')) / dynamic(() => import('./x'))
    const fn = call.getParent();
    const outer = fn?.getParent();
    if (
      fn &&
      Node.isArrowFunction(fn) &&
      fn.getBody() === call &&
      outer &&
      Node.isCallExpression(outer) &&
      /(^|\.)(lazy|dynamic)$/.test(outer.getExpression().getText())
    ) {
      call.replaceWithText(`${call.getText()}.then((m) => ({ default: m.${name} }))`);
      changed = true;
      continue;
    }
    report.manual.push(`${where} dynamic import of a converted module; use \`.${name}\` instead of \`.default\``);
  }

  // vi.mock / jest.mock factories that return { default: ... }
  for (const call of sf.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const callee = call.getExpression().getText();
    if (!/^(vi|jest)\.(mock|doMock)$/.test(callee)) continue;
    const arg = call.getArguments()[0];
    if (!arg || !Node.isStringLiteral(arg)) continue;
    const to = resolveSpecifier(arg.getLiteralValue(), file);
    const name = to && converted.get(to);
    if (name && call.getText().includes('default')) {
      report.manual.push(`${rel(file)}:${call.getStartLineNumber()} ${callee}() factory returns \`default\`; return \`${name}\` instead`);
    }
  }

  if (changed) report.touched.add(file);
}

for (const sf of files) rewriteImports(sf);

// ---------------------------------------------------------------- step 3: MDX / Markdown imports

const mdxChanges = [];
function walkDocs(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'es', 'lib', '.react-router'].includes(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDocs(p);
    else if (/\.mdx$/.test(entry.name)) {
      const src = fs.readFileSync(p, 'utf8');
      let changed = false;
      const out = src.replace(
        /^import\s+([$A-Z_a-z][\w$]*)\s*(,\s*\{[^}]*\})?\s+from\s+(['"])([^'"]+)\3;?/gm,
        (all, local, named, q, spec) => {
          if (spec.includes('?')) return all; // ?demo imports keep their default
          const to = resolveSpecifier(spec, p);
          const name = to && converted.get(to);
          if (!name) return all;
          noteImport(to);
          changed = true;
          const extra = named ? `, ${named.replace(/^,\s*\{\s*|\s*\}$/g, '')}` : '';
          return `import { ${local === name ? name : `${name} as ${local}`}${extra} } from ${q}${spec}${q};`;
        },
      );
      if (changed) mdxChanges.push([p, out]);
    }
  }
}
walkDocs(cwd);

// ---------------------------------------------------------------- write + report

// A converted module nothing in the project imports may be loaded by a framework or by consumers
// through a deep import path; list it so a human can confirm.
for (const [file, name] of converted) {
  if (!importerCount.has(file) && !entries.has(file)) {
    report.manual.push(`${rel(file)}: no importer found in the project (now \`export ${name}\`); if a framework or a deep import loads it by default, restore it or add --ignore`);
  }
}

if (!opts.dryRun) {
  project.saveSync();
  for (const [p, out] of mdxChanges) fs.writeFileSync(p, out);
}
for (const [p] of mdxChanges) report.touched.add(p);

const list = (title, items, max = 40) => {
  if (items.length === 0) return;
  console.log(`\n${title} (${items.length}):`);
  for (const i of items.slice(0, max)) console.log(`  - ${i}`);
  if (items.length > max) console.log(`  … ${items.length - max} more`);
};
console.log(`default-export codemod${opts.dryRun ? ' (dry run)' : ''}: ${cwd}`);
console.log(`  modules converted: ${report.converted.length}`);
console.log(`  re-exports renamed: ${report.reexportsUpdated}`);
console.log(`  files changed: ${report.touched.size}${opts.dryRun ? ' (not written)' : ''}`);
list('Converted', report.converted, 20);
list('Skipped (must keep export default)', report.skipped);
list('Kept: public entry has its own default export (breaking for consumers; use --no-keep-public-entry to convert)', report.keptEntries);
list('Needs a manual fix', report.manual, 200);
if (hasWildcardExports && report.converted.length > 0) {
  console.log(
    '\nNote: package.json "exports" has wildcard subpaths. Consumers that deep-import a converted module\n' +
      'with a default import (import X from "pkg/es/X") break; mention it in the release notes.',
  );
}
console.log('\nNext: run your formatter, then type-check, lint and build. Nothing was committed.');
