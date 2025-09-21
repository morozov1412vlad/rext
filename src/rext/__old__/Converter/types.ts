export class ConvertFrom<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _sourceType?: T;
}

export type FieldMeta = {
  kind: 'field';
  prop: string;
  sourceKey: string | number | symbol;
  converter?: (value: any) => any;
};

export type SourceMeta = {
  kind: 'source';
  prop: string;
  converter: (source: any) => any;
};

export type Meta = {
  fields: FieldMeta[];
  sources: SourceMeta[];
};
