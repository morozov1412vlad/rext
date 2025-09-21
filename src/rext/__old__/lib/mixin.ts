export type Class<
  Instance extends Object = {},
  StaticType extends Object = {}
> = (abstract new () => Instance) & StaticType;

type FullObjectFromTuple<T extends Object[]> = T extends [infer First, ...infer Rest]
  ? First extends Object
    ? Rest extends Object[]
      ? First & FullObjectFromTuple<Rest>
      : First
    : {}
  : {};

type ClassesInstanceTuple<T extends Class[]> = T extends [
  Class<infer R, infer _>,
  ...infer Rest
]
  ? Rest extends Class[]
    ? [R, ...ClassesInstanceTuple<Rest>]
    : [R]
  : [];

type ClassesStaticTuple<T extends Class[]> = T extends [
  Class<infer _, infer R>,
  ...infer Rest
]
  ? Rest extends Class[]
    ? [Omit<R, 'prototype'>, ...ClassesStaticTuple<Rest>]
    : [Omit<R, 'prototype'>]
  : [];

type FullInstance<T extends Class[]> = FullObjectFromTuple<ClassesInstanceTuple<T>>;
type FullStatic<T extends Class[]> = FullObjectFromTuple<ClassesStaticTuple<T>>;

export type FullClass<T extends Class[]> = Class<FullInstance<T>, FullStatic<T>>;

function copyProps(target: object, source: object, exclude: (string | symbol)[] = []) {
  if (!source) return;
  const names = Object.getOwnPropertyNames(source);
  const symbols = Object.getOwnPropertySymbols(source);
  for (const key of [...names, ...symbols]) {
    if (exclude.includes(key)) continue;
    const desc = Object.getOwnPropertyDescriptor(source, key);

    if (!desc || desc.configurable === false) continue;
    Object.defineProperty(target, key, desc);
  }
}

export function Mixin<T extends Class[]>(...mixins: T): FullClass<T> {
  class Base {}

  for (const mixin of mixins) {
    copyProps(Base.prototype, mixin.prototype, ['constructor']);
    copyProps(Base, mixin, ['prototype', 'name', 'length']);
  }

  return Base as unknown as FullClass<T>;
}
