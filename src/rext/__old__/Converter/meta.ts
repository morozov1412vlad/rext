import type { Meta } from './types';

const META = new WeakMap<object, Meta>();

export function getOrCreateMeta(proto: object): Meta {
  let m = META.get(proto);
  if (!m) {
    m = { fields: [], sources: [] };
    META.set(proto, m);
  }
  return m;
}

/** Collect metadata along the prototype chain (base → derived). */
export function collectMeta(proto: object): Meta {
  const chain: object[] = [];
  for (let p: any = proto; p && p !== Object.prototype; p = Object.getPrototypeOf(p)) {
    chain.unshift(p);
  }
  const out: Meta = { fields: [], sources: [] };
  for (const p of chain) {
    const m = META.get(p);
    if (!m) continue;
    out.fields.push(...m.fields);
    out.sources.push(...m.sources);
  }
  return out;
}
