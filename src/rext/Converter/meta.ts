// meta.ts
export type FieldMeta = {
  kind: 'field';
  prop: string;
  sourceKey: PropertyKey;
  converter?: (v: any) => any; // may return Promise
};

export type SourceMeta = {
  kind: 'source';
  prop: string;
  converter: (source: any) => any; // may return Promise
};

export type Meta = { fields: FieldMeta[]; sources: SourceMeta[]; _seen?: Set<string> };

const META_KEY = Symbol('class-converter:meta');

export function getOrCreateMetaOn(holder: any): Meta {
  if (!holder[META_KEY]) holder[META_KEY] = { fields: [], sources: [], _seen: new Set() } as Meta;
  return holder[META_KEY] as Meta;
}

export function collectMetaFromCtor(ctor: Function): Meta {
  const out: Meta = { fields: [], sources: [] };
  let proto = ctor.prototype;
  while (proto && proto !== Object.prototype) {
    const m = (proto as any)[META_KEY] as Meta | undefined;
    if (m) {
      out.fields.push(...m.fields);
      out.sources.push(...m.sources);
    }
    proto = Object.getPrototypeOf(proto);
  }
  return out;
}
