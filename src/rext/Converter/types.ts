export class ConvertFrom<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _sourceType?: T;
}

export type AdditionalConvertFrom<T> = {
  [key in keyof T]: T[key];
};
