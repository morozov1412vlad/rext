// FromField.ts
import { getOrCreateMetaOn } from './meta';
import { ConvertFrom } from './types';

type ExtractSource<T> = T extends ConvertFrom<infer S> ? S : never;

export function FromField<
  TInstance,
  TSource extends ExtractSource<TInstance>,
  TKey extends keyof TSource,
  TPropType
>(
  field: TKey
): (
  value: undefined,
  context: ClassFieldDecoratorContext<
    TInstance,
    TSource[TKey] extends TPropType ? TPropType : never
  >
) => void;

export function FromField<
  TInstance,
  TSource extends ExtractSource<TInstance>,
  TKey extends keyof TSource,
  TResult,
  TConverter extends (value: any) => any
>(
  field: TKey,
  converter: TConverter
): (
  value: unknown,
  context: ClassFieldDecoratorContext<
    TInstance,
    TConverter extends (value: TSource[TKey]) => TResult ? TResult : never
  >
) => void;

export function FromField(field: PropertyKey, converter?: (v: any) => any) {
  return function (_value: unknown, context: ClassFieldDecoratorContext) {
    const prop = String(context.name);
    return function initializer(this: any, initial: unknown) {
      const holder = context.static ? (this as Function) : Object.getPrototypeOf(this);
      const meta = getOrCreateMetaOn(holder);
      const key = `f:${prop}:${String(field)}`;
      if (!meta._seen!.has(key)) {
        meta._seen!.add(key);
        meta.fields.push({ kind: 'field', prop, sourceKey: field, converter });
      }
      return initial;
    };
  };
}

export function FromFieldAsync<
  TInstance,
  TSource extends ExtractSource<TInstance>,
  TKey extends keyof TSource,
  TResult,
  TConverter extends (value: any) => Promise<any>
>(
  field: TKey,
  converter: TConverter
): (
  value: unknown,
  context: ClassFieldDecoratorContext<
    TInstance,
    TConverter extends (value: TSource[TKey]) => Promise<TResult> ? TResult : never
  >
) => void;
export function FromFieldAsync(field: PropertyKey, converter: (v: any) => any) {
  return function (_value: unknown, context: ClassFieldDecoratorContext) {
    const prop = String(context.name);

    return function initializer(this: any, initial: unknown) {
      const holder = context.static ? (this as Function) : Object.getPrototypeOf(this);
      const meta = getOrCreateMetaOn(holder);
      const key = `f:${prop}:${String(field)}`;
      if (!meta._seen!.has(key)) {
        meta._seen!.add(key);
        meta.fields.push({ kind: 'field', prop, sourceKey: field, converter });
      }
      return initial;
    };
  };
}
