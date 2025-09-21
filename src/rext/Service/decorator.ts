import { getService, registerService } from './registry';

export function Service() {
  return (classConstructor: Function, context: ClassDecoratorContext) => {
    if (context.kind !== 'class')
      throw new Error('@Repository can only decorate classes');

    registerService(classConstructor.name, classConstructor);
  };
}

export function InjectService(service: Function) {
  return (_: any, context: ClassFieldDecoratorContext) => {
    if (context.kind !== 'field')
      throw new Error('@InjectService can only decorate classes');

    const name = service.name;
    const Repo = getService(name);
    if (!service) throw new Error(`Service ${name} not found`);

    return function (this: any) {
      return new Repo();
    };
  };
}
