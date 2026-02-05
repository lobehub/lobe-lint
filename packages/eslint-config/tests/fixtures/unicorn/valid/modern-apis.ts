import fs from 'node:fs';
import path from 'node:path';

// Valid modern API patterns

// prefer-array-find: Using find instead of filter[0]
const numbers = [1, 2, 3, 4, 5];
const firstEven = numbers.find((n) => n % 2 === 0);

// prefer-array-flat: Using flat()
const nested = [
  [1, 2],
  [3, 4],
];
const flattened = nested.flat();

// prefer-array-flat-map: Using flatMap()
const words = ['hello', 'world'];
const chars = words.flatMap((w) => w.split(''));

// prefer-array-index-of: Using indexOf instead of findIndex
const items = ['a', 'b', 'c'];
const indexOfB = items.indexOf('b');
const lastIndexOfB = items.lastIndexOf('b');

// prefer-array-some: Using some() for existence check
const hasNegative = numbers.some((n) => n < 0);

// prefer-at: Using at() for index access
const lastItem = numbers.at(-1);
const secondLast = numbers.at(-2);

// prefer-date-now: Using Date.now()
const timestamp = Date.now();

// prefer-includes: Using includes()
const hasTwo = numbers.includes(2);
const hasSubstring = 'hello world'.includes('world');

// prefer-logical-operator-over-ternary: Using logical operators
const value: string | undefined = undefined;
const withDefault = value ?? 'default';
const orValue = value || 'fallback';

// prefer-node-protocol: Using node: protocol (imported at top)
const currentDir = path.resolve('.');
const fileExists = fs.existsSync('./package.json');

// prefer-object-from-entries: Using Object.fromEntries()
const entries: [string, number][] = [
  ['a', 1],
  ['b', 2],
];
const fromEntries = Object.fromEntries(entries);

// prefer-regexp-test: Using test() for matching
const pattern = /\d+/;
const hasDigits = pattern.test('abc123');

// prefer-string-replace-all: Using replaceAll()
const withDashes = 'a-b-c'.replaceAll('-', '_');

// prefer-string-slice: Using slice()
const str = 'hello world';
const sliced = str.slice(0, 5);
const fromEnd = str.slice(-5);

// prefer-string-starts-ends-with: Using startsWith/endsWith
const startsWithH = str.startsWith('hello');
const endsWithD = str.endsWith('world');

// prefer-structured-clone: Using structuredClone()
const original = { a: 1, b: { c: 2 } };
const cloned = structuredClone(original);

export {
  chars,
  cloned,
  currentDir,
  endsWithD,
  fileExists,
  firstEven,
  flattened,
  fromEnd,
  fromEntries,
  hasDigits,
  hasNegative,
  hasSubstring,
  hasTwo,
  indexOfB,
  lastIndexOfB,
  lastItem,
  orValue,
  secondLast,
  sliced,
  startsWithH,
  timestamp,
  withDashes,
  withDefault,
};
