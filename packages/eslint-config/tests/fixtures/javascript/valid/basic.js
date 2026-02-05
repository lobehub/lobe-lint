const greeting = 'Hello, world!';

function greet(name) {
  return `${greeting}, ${name}!`;
}

const result = greet('User');

export { greet, result };
