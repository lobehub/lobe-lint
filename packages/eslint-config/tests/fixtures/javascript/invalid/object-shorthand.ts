const foo = 1;
const bar = 2;

// object-shorthand: { foo: foo } should be { foo }
const obj = {
  foo: foo,
  bar: bar,
};

export { obj };
