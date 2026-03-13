const sliceServiceRegistry = new Map<string, any>();

export const registerSliceService = (name: string, sliceService: Function) => {
  sliceServiceRegistry.set(name, sliceService);
};

export const getSliceService = (name: string) => {
  return sliceServiceRegistry.get(name);
};
