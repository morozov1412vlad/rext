import { useMemo } from 'react';

type ServiceMethodKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type ServiceInstanceMethods<T> = {
  [K in ServiceMethodKeys<T>]: T[K];
};

const boundMethodsCache = new WeakMap<object, object>();

const getBoundMethods = <T extends object>(
  serviceInstance: T
): ServiceInstanceMethods<T> => {
  const cached = boundMethodsCache.get(serviceInstance) as
    | ServiceInstanceMethods<T>
    | undefined;
  if (cached) return cached;

  const prototype = Object.getPrototypeOf(serviceInstance);
  const bound = Object.getOwnPropertyNames(prototype)
    .filter(
      (key) =>
        key !== 'constructor' && typeof serviceInstance[key as keyof T] === 'function'
    )
    .reduce((acc, key) => {
      const methodKey = key as ServiceMethodKeys<T>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fn = (serviceInstance as any)[methodKey];
      acc[methodKey] = fn.bind(serviceInstance);
      return acc;
    }, {} as ServiceInstanceMethods<T>);

  boundMethodsCache.set(serviceInstance, bound);
  return bound;
};

export const useServiceInstance = <T extends object>(
  serviceInstance: T
): ServiceInstanceMethods<T> => {
  return getBoundMethods(serviceInstance);
};

const serviceInstancesCache = new WeakMap<object, object>();

export const useService = <Instance extends object>(
  service: new () => Instance
): ServiceInstanceMethods<Instance> => {
  const instance = useMemo(() => {
    const cached = serviceInstancesCache.get(service) as Instance | undefined;
    if (cached) return cached;
    const newInstance = new service();
    serviceInstancesCache.set(service, newInstance);
    return newInstance;
  }, [service]);
  return useServiceInstance(instance);
};
