export const compose = (...functions) => x =>
  functions.reduceRight((v, f) => f(v), x);
export const pipe = (...functions) => x =>
  functions.reduce((v, f) => f(v), x);
