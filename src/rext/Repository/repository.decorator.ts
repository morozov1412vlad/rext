import { getRepository, registerRepository } from "./registry";
import type { AxiosInstance } from "axios";

export function Repository(path?: string, instance?: AxiosInstance) {
  return (classConstructor: Function, context: ClassDecoratorContext) => {
    if (context.kind !== 'class')
      throw new Error('@Repository can only decorate classes');

    registerRepository(classConstructor.name, classConstructor);
    
    context.addInitializer(function () {
      const Ctor = this as any;
      if (path != null) Ctor.prototype.resourcePath = path;
      if (instance) Ctor.prototype.client = instance;
    });
  };
}

export function InjectRepository(repository: Function) {
  return (_: any, context: ClassFieldDecoratorContext) => {
    if (context.kind !== 'field')
      throw new Error('@InjectRepository can only decorate classes');

    const name = repository.name;
    const Repo = getRepository(name);
    if (!repository) throw new Error(`Repository ${name} not found`);

    return function (this: any) {
      return new Repo();
    };
  };
}
