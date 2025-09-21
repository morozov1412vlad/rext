// convert-instance.ts
import { ConvertFrom } from './types';
import { collectMeta } from './meta';

type Ctor<T> = new () => T;
type ExtractSource<T> = T extends ConvertFrom<infer S> ? S : never;

const isPromise = (v: unknown): v is Promise<unknown> =>
  !!v && typeof (v as any).then === 'function';

export async function convertToInstance<T>(
  Ctor: Ctor<T>,
  source: ExtractSource<T>
): Promise<T> {
  const { fields, sources } = collectMeta(Ctor.prototype);

  const instance = new Ctor();
  const pending: Promise<void>[] = [];

  for (const f of fields) {
    const raw = (source as any)[f.sourceKey];
    if (f.converter) {
      const maybe = f.converter(raw);
      if (isPromise(maybe)) {
        pending.push(
          maybe.then((v) => {
            (instance as any)[f.prop] = v;
          })
        );
      } else {
        (instance as any)[f.prop] = maybe;
      }
    } else {
      (instance as any)[f.prop] = raw;
    }
  }

  for (const s of sources) {
    const maybe = s.converter(source as any);
    if (isPromise(maybe)) {
      pending.push(
        maybe.then((v) => {
          (instance as any)[s.prop] = v;
        })
      );
    } else {
      (instance as any)[s.prop] = maybe;
    }
  }

  if (pending.length) await Promise.all(pending);
  return instance;
}

export async function convertManyToInstances<T>(
  Ctor: Ctor<T>,
  sources: Array<ExtractSource<T>>
): Promise<T[]> {
  return Promise.all(sources.map((s) => convertToInstance(Ctor, s)));
}

export function convertToInstanceSync<T>(Ctor: Ctor<T>, source: ExtractSource<T>): T {
  const { fields, sources } = collectMeta(Ctor.prototype);
  const instance = new Ctor();

  for (const f of fields) {
    const raw = (source as any)[f.sourceKey];
    const val = f.converter ? f.converter(raw) : raw;
    if (isPromise(val))
      throw new Error(`Async converter used in convertToInstanceSync for "${f.prop}"`);
    (instance as any)[f.prop] = val;
  }
  for (const s of sources) {
    const val = s.converter(source as any);
    if (isPromise(val))
      throw new Error(`Async converter used in convertToInstanceSync for "${s.prop}"`);
    (instance as any)[s.prop] = val;
  }
  return instance;
}
