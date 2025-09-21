// convert.ts
import { ConvertFrom } from './types'; // where ConvertFrom<T> lives
import { collectMeta } from './meta'; // or wherever you exported it

type Ctor<T> = new () => T;
type ExtractSource<T> = T extends ConvertFrom<infer S> ? S : never;

// Keep non-function fields only (handy for typing the plain result)
export type PlainOf<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K]
};

/**
 * Always returns a plain object with ONLY the decorated fields (@FromField/@FromSource).
 */
export async function convert<T>(
  Ctor: Ctor<T>,
  source: ExtractSource<T>
): Promise<PlainOf<T>> {
  const { fields, sources } = collectMeta(Ctor.prototype);

  const out: Record<string, any> = {};
  const pending: Promise<void>[] = [];

  // Field-based mappings: value comes from source[field]
  for (const f of fields) {
    const raw = (source as any)[f.sourceKey];
    if (f.converter) {
      const maybe = f.converter(raw);
      if (maybe && typeof (maybe as any).then === 'function') {
        pending.push((maybe as Promise<any>).then(v => { out[f.prop] = v; }));
      } else {
        out[f.prop] = maybe;
      }
    } else {
      out[f.prop] = raw;
    }
  }

  // Whole-source mappings: value comes from converter(source)
  for (const s of sources) {
    const maybe = s.converter(source as any);
    if (maybe && typeof (maybe as any).then === 'function') {
      pending.push((maybe as Promise<any>).then(v => { out[s.prop] = v; }));
    } else {
      out[s.prop] = maybe;
    }
  }

  if (pending.length) await Promise.all(pending);
  return out as PlainOf<T>;
}

export async function convertMany<T>(
  Ctor: Ctor<T>,
  sources: ExtractSource<T>[]
): Promise<Array<PlainOf<T>>> {
  return Promise.all(sources.map(s => convert(Ctor, s)));
}
