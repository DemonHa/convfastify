export type ExtractSecondParam<T> = T extends (...args: infer A) => any
  ? A[1]
  : never;
