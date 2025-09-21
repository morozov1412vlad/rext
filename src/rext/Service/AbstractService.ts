import { useService, type ServiceInstanceMethods } from '../hooks/useService';

export abstract class AbstractService {
  static use<
    TClass extends abstract new () => any,
    TInstance extends InstanceType<TClass>
  >(this: TClass): ServiceInstanceMethods<TInstance> {
    return useService(this as unknown as new () => TInstance);
  }
}
