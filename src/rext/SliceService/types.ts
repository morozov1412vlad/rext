import type { Slice } from '@reduxjs/toolkit';

type TSliceActions<TSlice extends Slice> = TSlice['actions'];

type TSliceSelectors<TSlice extends Slice> = TSlice['selectors'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TSliceSelectorArgs<T> = T extends (state: any, ...args: infer Args) => any
  ? Args
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TSliceSelectorReturnType<T> = T extends (
  state: any,
  ...args: any[]
) => infer ReturnType
  ? ReturnType
  : never;

export type SliceServiceInstance<TSlice extends Slice> = {
  get state(): TSlice extends Slice<infer State> ? State : never;
} & {
  [key in keyof TSliceActions<TSlice>]: (
    payload: Parameters<TSliceActions<TSlice>[key]>[0]
  ) => void;
} & {
  [key in keyof TSliceSelectors<TSlice>]: (
    ...args: TSliceSelectorArgs<TSliceSelectors<TSlice>[key]>
  ) => TSliceSelectorReturnType<TSliceSelectors<TSlice>[key]>;
};

// type SliceServiceActionDecorator<
//   TSlice extends Slice,
//   ActionKey extends keyof TSliceActions<TSlice>
// > = (value: (payload: Parameters<TSliceActions<TSlice>[ActionKey]>[0]) => void) => void;

// export type SliceService<TSlice extends Slice> =
//   (new () => SliceServiceInstance<TSlice>) & {
//     slice: TSlice;
//   } & TSlice['selectors'] & {
//       [key in keyof TSliceActions<TSlice>]: SliceServiceActionDecorator<TSlice, key>;
//     };

export type SliceService<TSlice extends Slice> =
  (new () => SliceServiceInstance<TSlice>) & {
    slice: TSlice;
  } & TSlice['selectors'];
