import fs from 'node:fs';
import path from 'node:path';

import { defineConfig, type UserConfig } from 'tsdown';

type BundlerPlugin = NonNullable<UserConfig['plugins']>;

const STUBS = {
  eslint: path.resolve('src/stubs/eslint.cjs'),
  typescript: path.resolve('src/stubs/typescript.cjs'),
};

const stubTypeScriptAndESLint = {
  name: 'lobe:stub-typescript-and-eslint',
  resolveId(id: string) {
    if (id === 'typescript' || id.startsWith('typescript/')) return STUBS.typescript;
    if (id === 'eslint' || id.startsWith('eslint/')) return STUBS.eslint;
    return null;
  },
};

const findPackageRoot = (file: string) => {
  let dir = path.dirname(file);
  while (dir !== path.dirname(dir)) {
    const parent = path.basename(path.dirname(dir));
    const grandparent = path.basename(path.dirname(path.dirname(dir)));
    const isPackageDir = parent === 'node_modules' || grandparent === 'node_modules';
    if (isPackageDir && fs.existsSync(path.join(dir, 'package.json'))) return dir;
    dir = path.dirname(dir);
  }
  return undefined;
};

const thirdPartyLicenses = {
  generateBundle(
    _options: unknown,
    bundle: Record<string, { moduleIds?: string[]; type: string }>,
  ) {
    const packages = new Map<string, { license: string; text: string; version: string }>();

    for (const output of Object.values(bundle)) {
      for (const id of output.moduleIds ?? []) {
        const root = findPackageRoot(id.replace(/^\0/, ''));
        if (!root) continue;
        const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
        const key = `${manifest.name}@${manifest.version}`;
        if (packages.has(key)) continue;
        const licenseFile = fs.readdirSync(root).find((file) => /^licen[cs]e/i.test(file));
        packages.set(key, {
          license: manifest.license ?? 'UNKNOWN',
          text: licenseFile ? fs.readFileSync(path.join(root, licenseFile), 'utf8').trim() : '',
          version: manifest.version,
        });
      }
    }

    const sections = [...packages.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, { license, text }]) =>
        `## ${key}\n\nLicense: ${license}\n\n${text ? '```\n' + text + '\n```' : ''}`.trim(),
      );

    (this as unknown as { emitFile: (file: object) => void }).emitFile({
      fileName: 'THIRD_PARTY_LICENSES.md',
      source: `# Third-party licenses\n\nThe plugins in \`dist/plugins\` bundle the following packages.\n\n${sections.join('\n\n')}\n`,
      type: 'asset',
    });
  },
  name: 'lobe:third-party-licenses',
};

export default defineConfig([
  {
    clean: false,
    dts: true,
    entry: { index: 'src/index.ts' },
    format: 'esm',
    platform: 'node',
    sourcemap: false,
    target: 'node20',
  },
  {
    clean: false,
    deps: { onlyBundle: false },
    dts: false,
    entry: {
      'plugins/eslint-react': 'src/plugins/eslint-react.ts',
      'plugins/lobe': 'src/plugins/lobe.ts',
      'plugins/perfectionist': 'src/plugins/perfectionist.ts',
      'plugins/react-js': 'src/plugins/react-js.ts',
      'plugins/react-native': 'src/plugins/react-native.ts',
      'plugins/simple-import-sort': 'src/plugins/simple-import-sort.ts',
      'plugins/stylex': 'src/plugins/stylex.ts',
    },
    format: 'esm',
    platform: 'node',
    sourcemap: false,
    plugins: [stubTypeScriptAndESLint, thirdPartyLicenses] as BundlerPlugin,
    target: 'node20',
  },
]);
