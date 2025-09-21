import { ConvertFrom } from './types';
import { collectMetaFromCtor } from './meta';

type Ctor<T> = new () => T;
type ExtractSource<T> = T extends ConvertFrom<infer S> ? S : never;

const isPromise = (v: unknown): v is Promise<unknown> =>
  !!v && typeof (v as any).then === 'function';

export async function convert<T>(
  Ctor: Ctor<T>,
  sourceData: ExtractSource<T>
): Promise<T> {
  // initialize to register metadata
  new Ctor();
  const plainInstance: Record<string, any> = {};

  // collect metadata
  const { fields, sources } = collectMetaFromCtor(Ctor);

  const pending: Promise<void>[] = [];

  for (const field of fields) {
    const raw = (sourceData as any)[field.sourceKey];
    if (field.converter) {
      const maybePromiseConverter = field.converter(raw);
      if (isPromise(maybePromiseConverter)) {
        pending.push(maybePromiseConverter.then(v => { (plainInstance as any)[field.prop] = v; }));
      } else {
        (plainInstance as any)[field.prop] = maybePromiseConverter;
      }
    } else {
      (plainInstance as any)[field.prop] = raw;
    }
  }

  for (const source of sources) {
    const maybePromiseConverter = source.converter(sourceData as any);
    if (isPromise(maybePromiseConverter)) {
      pending.push(maybePromiseConverter.then(v => { (plainInstance as any)[source.prop] = v; }));
    } else {
      (plainInstance as any)[source.prop] = maybePromiseConverter;
    }
  }

  if (pending.length) await Promise.all(pending);
  return plainInstance as T;
}
