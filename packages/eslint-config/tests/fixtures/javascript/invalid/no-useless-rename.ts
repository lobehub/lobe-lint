const defaultAb = 1;

// no-useless-rename: { a: a = ab } in args should be { a = ab }
function fn({ a: a = defaultAb }: { a?: number }) {
  return a;
}

export { fn };
