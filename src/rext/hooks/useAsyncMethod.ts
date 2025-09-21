import { useCallback, useState } from 'react';

type Method<Args extends unknown[], Res> = (...args: Args) => Promise<Res>;
export type ErrorHandlerMiddleware = (error: Error) => void;

type UppercaseFirstLetter<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : T;

type PropertyKey<
  T extends string,
  DataKey extends string | undefined = undefined,
  DefaultKey extends string | undefined = undefined
> = DataKey extends undefined
  ? DefaultKey extends undefined
    ? T
    : DefaultKey
  : `${DataKey}${UppercaseFirstLetter<T>}`;

type SetterKey<
  T extends string,
  DataKey extends string | undefined = undefined
> = DataKey extends undefined
  ? `set${UppercaseFirstLetter<T>}`
  : `set${UppercaseFirstLetter<DataKey & string>}${UppercaseFirstLetter<T>}`;

type MaybeDefaultKey<
  DefaultKey extends string,
  Key extends string | undefined = undefined
> = Key extends undefined ? DefaultKey : Key;

type UseAsyncMethodReturnType<
  Args extends unknown[],
  Res,
  InitialData extends Res | null = null,
  DataKey extends string | undefined = undefined,
  ActionKey extends string | undefined = undefined,
  ThrowOnError extends boolean = false
> = {
  [key in MaybeDefaultKey<'data', DataKey>]: Res | InitialData;
} & {
  [key in PropertyKey<'error', DataKey>]: Error | null;
} & {
  [key in PropertyKey<'loading', DataKey, 'isLoading'>]: boolean;
} & {
  [key in MaybeDefaultKey<'execute', ActionKey>]: (
    ...args: Args
  ) => Promise<ThrowOnError extends true ? Res : Res | null>;
} & {
  [key in SetterKey<'error', DataKey>]: (error: Error | null) => void;
} & {
  [key in SetterKey<'', DataKey>]: React.Dispatch<
    React.SetStateAction<Res | InitialData>
  >;
};

const uppercaseFirstLetter = <T extends string>(str: T): UppercaseFirstLetter<T> => {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as UppercaseFirstLetter<T>;
};

// Wrapper hook for async methods that returns a set of states
// that are commonly used in react when working with async methods (loading state, error state, data state, etc.).
export const useAsyncMethod = <
  Args extends unknown[],
  Res,
  InitialData extends Res | null = null,
  DataKey extends string | undefined = undefined,
  ActionKey extends string | undefined = undefined,
  ThrowOnError extends boolean = false
>({
  method,
  errorHandler,
  initialData,
  dataKey,
  methodKey,
  throwOnError,
}: {
  method: Method<Args, Res>;
  errorHandler?: ErrorHandlerMiddleware;
  initialData?: InitialData;
  dataKey?: DataKey;
  methodKey?: ActionKey;
  throwOnError?: ThrowOnError;
}): UseAsyncMethodReturnType<
  Args,
  Res,
  InitialData,
  DataKey,
  ActionKey,
  ThrowOnError
> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Res | InitialData>(
    initialData ?? (null as InitialData)
  );

  const execute = useCallback(
    async (...args: Args) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await method(...args);
        setData(result);
        setIsLoading(false);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');

        if (errorHandler) {
          errorHandler(err);
        }
        setError(err);
        setIsLoading(false);
        if (throwOnError) {
          throw err;
        }
        return null;
      }
    },
    [method, errorHandler, throwOnError]
  );

  return {
    [dataKey ?? 'data']: data,
    [dataKey ? `${dataKey}Loading` : 'isLoading']: isLoading,
    [dataKey ? `${dataKey}Error` : 'error']: error,
    [methodKey ? `${methodKey}` : 'execute']: execute,
    [dataKey ? `set${uppercaseFirstLetter(dataKey)}Error` : 'setError']: setError,
    [dataKey ? `set${uppercaseFirstLetter(dataKey)}` : 'setData']: setData,
  } as UseAsyncMethodReturnType<Args, Res, InitialData, DataKey, ActionKey, ThrowOnError>;
};
