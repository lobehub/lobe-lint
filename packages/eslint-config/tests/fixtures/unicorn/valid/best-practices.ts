// Valid unicorn practices

// Using Array.isArray
const arr = [1, 2, 3];
const isArr = Array.isArray(arr);

// Using includes instead of indexOf
const hasItem = arr.includes(2);

// Using startsWith/endsWith
const str = 'hello world';
const startsWithHello = str.startsWith('hello');
const endsWithWorld = str.endsWith('world');

// Multiple push calls in separate statements
const items: number[] = [];
// eslint-disable-next-line unicorn/no-immediate-mutation
items.push(1, 2, 3);

// null is allowed
const nullable: string | null = null;

export { endsWithWorld, hasItem, isArr, items, nullable, startsWithHello };
