export type EmptyConstructor<T = {}> = abstract new () => T;

export type Static<T> = {
  [K in keyof T]: T[K];
};