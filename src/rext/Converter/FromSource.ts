// FromSource.ts
import { getOrCreateMetaOn } from './meta';
import { ConvertFrom } from './types';

type ExtractSource<T> = T extends ConvertFrom<infer S> ? S : never;

export function FromSource<
  TInstance,
  TSource extends ExtractSource<TInstance>,
  TResult,
  TConverter extends (value: TSource) => any
>(
  converter: TConverter
): (
  value: unknown,
  context: ClassFieldDecoratorContext<
    TInstance,
    TConverter extends (value: TSource) => TResult ? TResult : never
  >
) => void;

export function FromSource(converter: (data: any) => any) {
  {
    return function (_value: unknown, context: ClassFieldDecoratorContext) {
      const prop = String(context.name);
      return function initializer(this: any, initial: unknown) {
        const holder = context.static ? (this as Function) : Object.getPrototypeOf(this);
        const meta = getOrCreateMetaOn(holder);
        const key = `s:${prop}`;
        if (!meta._seen!.has(key)) {
          meta._seen!.add(key);
          meta.sources.push({ kind: 'source', prop, converter: converter as any });
        }
        return initial;
      };
    };
  }
}

export function FromSourceAsync<
  TInstance,
  TSource extends ExtractSource<TInstance>,
  TResult,
  TConverter extends (value: TSource) => any
>(
  converter: TConverter
): (
  value: unknown,
  context: ClassFieldDecoratorContext<
    TInstance,
    TConverter extends (value: TSource) => Promise<TResult> ? TResult : never
  >
) => void;

export function FromSourceAsync(converter: (data: any) => any) {
  {
    return function (_value: unknown, context: ClassFieldDecoratorContext) {
      const prop = String(context.name);
      return function initializer(this: any, initial: unknown) {
        const holder = context.static ? (this as Function) : Object.getPrototypeOf(this);
        const meta = getOrCreateMetaOn(holder);
        const key = `s:${prop}`;
        if (!meta._seen!.has(key)) {
          meta._seen!.add(key);
          meta.sources.push({ kind: 'source', prop, converter: converter as any });
        }
        return initial;
      };
    };
  }
}
