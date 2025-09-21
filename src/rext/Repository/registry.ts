const repositoryRegistry = new Map<string, any>();

export const registerRepository = (name: string, repository: Function) => {
  repositoryRegistry.set(name, repository);
};

export const getRepository = (name: string) => {
  return repositoryRegistry.get(name);
};
