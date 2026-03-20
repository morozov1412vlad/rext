import React, { useContext, useMemo } from 'react';

type Service = new () => object;

interface ServiceProviderContextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instances: Map<Service, Record<string, (...args: any[]) => any>>;
}

const ServiceProviderContext = React.createContext<ServiceProviderContextProps>({
  instances: new Map(),
});

interface ServiceProviderProps {
  children: React.ReactNode;
  services: Service[];
}

const getAllPropertyNames = <T extends object>(prototype: T): string[] => {
  const props: string[] = [];

  let proto = prototype;

  while (proto && proto !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      props.push(name);
    }
    proto = Object.getPrototypeOf(proto);
  }

  return [...props];
};

const getBoundMethods = <T extends object>(
  serviceInstance: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, (...args: any[]) => any> => {
  const prototype = Object.getPrototypeOf(serviceInstance);
  const bound = getAllPropertyNames(prototype)
    .filter((key) => key !== 'constructor' && typeof serviceInstance[key as keyof T] === 'function')
    .reduce(
      (acc, key) => {
        const methodKey = key as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fn = (serviceInstance as any)[methodKey];
        acc[methodKey] = fn.bind(serviceInstance);
        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, (...args: any[]) => any>,
    );

  return bound;
};

const createServiceMethodsMap = (services: Service[]) => {
  const instances = new Map<Service, Record<string, (...args: any[]) => any>>();

  for (const service of services) {
    const serviceInstance = new service();
    const boundMethods = getBoundMethods(serviceInstance);
    instances.set(service, boundMethods);
  }
  return instances;
};

export const ServiceProvider = ({ children, services }: ServiceProviderProps) => {
  const instances = useMemo(() => {
    return createServiceMethodsMap(services);
  }, [services]);

  return (
    <ServiceProviderContext.Provider value={{ instances }}>
      {children}
    </ServiceProviderContext.Provider>
  );
};

export const useServiceProviderContext = () => {
  const context = useContext(ServiceProviderContext);
  if (!context) {
    throw new Error('useServiceProviderContext must be used within a ServiceProvider');
  }
  return context;
};
