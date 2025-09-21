import { getOrCreateMeta } from './meta';
import { ConvertFrom } from './types';

export function FromSource<
  TPropName extends string,
  TPropType,
  TClassInstance extends { [key in TPropName]: TPropType },
  TResponse extends TClassInstance extends ConvertFrom<infer R> ? R : never
>(
  converter: (data: TResponse) => TPropType | Promise<TPropType>
): (target: TClassInstance, propertyName: TPropName) => void {
  return function (target: object, propertyName: string) {
    const meta = getOrCreateMeta(target);
    meta.sources.push({
      kind: 'source',
      prop: propertyName,
      converter: converter as any,
    });
  };
}
