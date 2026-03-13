import { useServiceProviderContext } from '../providers/ServiceProvider';

type ServiceMethodKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]-?: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export type ServiceInstanceMethods<T> = {
  [K in ServiceMethodKeys<T>]: T[K];
};

export const useService = <Instance extends object>(
  service: new () => Instance
): ServiceInstanceMethods<Instance> => {
  const { instances } = useServiceProviderContext();
  if (!instances[service.name]) {
    throw new Error(`Service ${service.name} not found`);
  }
  return instances[service.name] as ServiceInstanceMethods<Instance>;
};
