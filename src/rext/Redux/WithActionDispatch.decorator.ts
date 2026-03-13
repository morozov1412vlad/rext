const isPromise = (v: unknown): v is Promise<unknown> => {
  return (
    v != null &&
    (typeof v === 'object' || typeof v === 'function') &&
    typeof (v as any).then === 'function'
  );
};

export function WithActionDispatch<TInstance, TActionPayload, TOriginalMethodResult extends TActionPayload | Promise<TActionPayload>>(
  action: (args: TActionPayload) => void
) {
  return (
    originalMethod: (
      this: TInstance,
      ...args: any[]
    ) => TOriginalMethodResult,
    context: ClassMethodDecoratorContext<
      TInstance,
      (...args: any[]) => TOriginalMethodResult
    >
  ) => {
    if (context.kind !== 'method')
      throw new Error('@WithActionDispatch can only decorate methods');

    if (context.private) throw new TypeError('Not supported on private methods.');

    return function (this: TInstance, ...args: any[]) {
      const res = originalMethod.apply(this, args);
      if (isPromise(res)) {
        res.then((value) => action(value as TActionPayload));
      } else {
        action(res as TActionPayload);
      }
      return res;
    };
  };
}
