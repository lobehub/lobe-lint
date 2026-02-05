// Valid code cleanliness patterns

// escape-case: Uppercase escape sequences
const tab = '\t';
const newline = '\n';
const unicode = '\u001B';

// no-console-spaces: No extra spaces in console
const logValue = 42;
console.log('Value:', logValue);

// no-lonely-if: Proper if-else structure
function checkValue(x: number) {
  if (x > 0) {
    return 'positive';
  } else if (x < 0) {
    return 'negative';
  } else {
    return 'zero';
  }
}

// no-new-array: Using array literal
const arr = [1, 2, 3];
const emptyArr: number[] = [];
const filledArr = Array.from({ length: 5 }, (_, i) => i);

// no-unnecessary-await: Only await promises
async function properAwait() {
  const promise = Promise.resolve(42);
  return await promise;
}

// no-unreadable-iife: Readable IIFE
const result = (() => {
  return 42;
})();

// no-useless-fallback-in-spread: No useless fallback
const obj = { a: 1 };
const spread = { ...obj };

// no-useless-length-check: No redundant length check
function processItems(items: number[]) {
  for (const item of items) {
    console.log(item);
  }
}

// no-useless-promise-resolve-reject: Direct return in async
async function directReturn() {
  return 42;
}

// no-useless-spread: No unnecessary spread
const original = [1, 2, 3];
const copy = [...original];
const merged = [...original, 4, 5];

// no-useless-switch-case: Meaningful switch cases
function getSeverity(level: string) {
  switch (level) {
    case 'error': {
      return 3;
    }
    case 'warning': {
      return 2;
    }
    case 'info': {
      return 1;
    }
    default: {
      return 0;
    }
  }
}

// no-zero-fractions: No unnecessary decimals
const integer = 1;
const decimal = 1.5;

// number-literal-case: Uppercase hex
const hex = 0xff;
const bigHex = 0xdead_beef;

// text-encoding-identifier-case: Lowercase encoding
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');

export {
  arr,
  bigHex,
  checkValue,
  copy,
  decimal,
  decoder,
  directReturn,
  emptyArr,
  encoder,
  filledArr,
  getSeverity,
  hex,
  integer,
  logValue,
  merged,
  newline,
  obj,
  original,
  processItems,
  properAwait,
  result,
  spread,
  tab,
  unicode,
};
