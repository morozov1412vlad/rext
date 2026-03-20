export class ConvertFrom<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // @ts-ignore
  private _sourceType?: T;
}

export type AdditionalConvertFrom<T> = {
  [key in keyof T]: T[key];
};
