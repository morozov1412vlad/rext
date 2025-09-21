import { ConvertFrom } from './types';
import { getOrCreateMeta } from './meta';

type ExtractSource<T> = T extends ConvertFrom<infer S> ? S : never;
type KeysWithValue<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T]

export function FromField<
  TInstance,
  TPropName extends string & keyof TInstance,
  TSource extends ExtractSource<TInstance>,
  TPropType extends TInstance[TPropName],
  TKey extends KeysWithValue<TSource, TPropType>
>(
  field: TKey
): (target: TInstance, propertyName: TPropName) => void;

export function FromField<
  TInstance,
  TPropName extends string & keyof TInstance,
  TSource extends ExtractSource<TInstance>,
  TPropType extends TInstance[TPropName],
  TKey extends keyof TSource,
  TConverter extends (value: TSource[TKey]) => TPropType
>(
  field: TKey,
  converter: TConverter
): (target: TInstance, propertyName: TPropName) => void;

export function FromField<
  TInstance,
  TPropName extends string & keyof TInstance,
  TSource extends ExtractSource<TInstance>,
  TPropType extends TInstance[TPropName],
  TKey extends keyof TSource,
  TConverter extends (value: TSource[TKey]) => Promise<TPropType>
>(
  field: TKey,
  converter: TConverter
): (target: TInstance, propertyName: TPropName) => void;

export function FromField(field: string | number | symbol, converter?: (v: any) => any) {
  return function (target: object, propertyName: string) {
    const meta = getOrCreateMeta(target);
    meta.fields.push({ kind: 'field', prop: propertyName, sourceKey: field, converter });
  };
}


