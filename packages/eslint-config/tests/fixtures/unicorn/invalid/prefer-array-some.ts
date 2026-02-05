// Using filter().length - should fail unicorn/prefer-array-some
const numbers = [1, 2, 3, 4, 5];
export const hasNegative = numbers.filter((n) => n < 0).length > 0;
