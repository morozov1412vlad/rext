const serviceRegistry = new Map<string, any>();

export const registerService = (name: string, service: Function) => {
  serviceRegistry.set(name, service);
};

export const getService = (name: string) => {
  return serviceRegistry.get(name);
};
