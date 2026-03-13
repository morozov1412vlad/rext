import { getSliceService } from './registry';

export function InjectSliceService(sliceService: Function) {
  return (_: any, context: ClassFieldDecoratorContext) => {
    if (context.kind !== 'field')
      throw new Error('@InjectSliceService can only decorate classes');

    const name = sliceService.name;
    const Repo = getSliceService(name);
    if (!sliceService) throw new Error(`SliceService ${name} not found`);

    return function (this: any) {
      return new Repo();
    };
  };
}
