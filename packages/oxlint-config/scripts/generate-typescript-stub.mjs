import fs from 'node:fs';
import { createRequire } from 'node:module';

const ts = createRequire(import.meta.url)('typescript');

const isEnumLike = (value) =>
  value !== null &&
  typeof value === 'object' &&
  Object.values(value).every((v) => typeof v === 'number' || typeof v === 'string');

const constants = Object.fromEntries(
  Object.entries(ts).filter(
    ([, value]) => ['boolean', 'number', 'string'].includes(typeof value) || isEnumLike(value),
  ),
);

const source = `const constants = ${JSON.stringify(constants)};

module.exports = new Proxy(constants, {
  get(target, key) {
    if (key in target || typeof key === 'symbol' || key === '__esModule' || key === 'then' || key === 'default') {
      return target[key];
    }
    return () => {
      throw new Error(
        \`[@lobehub/oxlint-config] a bundled plugin called typescript.\${String(key)}(), which is not available without TypeScript\`,
      );
    };
  },
});
`;

const target = new URL('../src/stubs/typescript.cjs', import.meta.url);
fs.writeFileSync(target, source);
console.log(
  `typescript stub: ${Object.keys(constants).length} constants from typescript@${ts.version}`,
);
