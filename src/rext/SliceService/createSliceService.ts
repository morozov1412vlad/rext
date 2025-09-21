import { createSlice } from '@reduxjs/toolkit';
import type {
  Slice,
  Store,
  SliceCaseReducers,
  SliceSelectors,
  CreateSliceOptions,
  Selector,
} from '@reduxjs/toolkit';
import { getStore } from './configureAppStore';
import type { SliceService } from './types';
import { registerSliceService } from './registry';

// const isPromise = (v: unknown): v is Promise<unknown> =>
//   !!v && typeof (v as any).then === 'function';

// function initActionDecorators<TSlice extends Slice>(service: SliceService<TSlice>) {
//   Object.entries(service.slice.actions).forEach(([key, actionCreator]) => {
//     const decoratorKey = key.charAt(0).toUpperCase() + key.slice(1);

//     (service as any)[decoratorKey] = function (value: Function) {
//       return function (this: unknown, ...args: any[]) {
//         try {
//           const result = value.apply(this, args);

//           const dispatchPayload = (payload: any) => {
//             getStore().dispatch((actionCreator as any)(payload));
//           };

//           if (isPromise(result)) {
//             return (result as Promise<any>).then((payload) => {
//               dispatchPayload(payload);
//               return payload;
//             });
//           } else {
//             dispatchPayload(result);
//             return result;
//           }
//         } catch (error) {
//           throw error;
//         }
//       };
//     };
//   });
// }

export const createSliceService = <
  State,
  CaseReducers extends SliceCaseReducers<State>,
  Name extends string,
  Selectors extends SliceSelectors<State>,
  ReducerPath extends string = Name
>(
  options: CreateSliceOptions<State, CaseReducers, Name, ReducerPath, Selectors>
): SliceService<Slice<State, CaseReducers, Name, ReducerPath, Selectors>> => {
  const slice = createSlice(options);

  class SliceServiceClass {
    static slice = slice;

    private get store(): Store {
      return getStore();
    }

    constructor() {
      Object.entries(slice.actions).forEach(([key, action]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[key] = (payload: any) => {
          this.store.dispatch(action(payload));
        };
      });

      Object.entries(slice.selectors).forEach(([key, selector]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[key] = (...args: any[]) => {
          return (selector as Selector)(this.store.getState(), ...args);
        };
      });
    }

    public get state() {
      return slice.selectSlice(this.store.getState());
    }
  }

  for (const key in slice.selectors) {
    (SliceServiceClass as any)[key] =
      slice.selectors[key as keyof typeof slice.selectors];
  }

  // initActionDecorators(
  //   SliceServiceClass as SliceService<
  //     Slice<State, CaseReducers, Name, ReducerPath, Selectors>
  //   >
  // );

  registerSliceService(SliceServiceClass.name, SliceServiceClass);

  return SliceServiceClass as SliceService<
    Slice<State, CaseReducers, Name, ReducerPath, Selectors>
  >;
};
