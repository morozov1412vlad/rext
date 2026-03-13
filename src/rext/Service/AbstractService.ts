import type { EmptyConstructor, Static } from '../common/types';
import { useService } from '../hooks/useService';
import type { ServiceInstanceMethods } from '../hooks/useService';

export function AbstractService<U extends EmptyConstructor = EmptyConstructor>(Base?: U) {
  class BaseFallback {}
  const BaseClass = Base || BaseFallback;
  abstract class ServiceBase extends BaseClass {
    static use<C extends abstract new () => ServiceBase>(
      this: C
    ): ServiceInstanceMethods<InstanceType<C>> {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useService(
        this as unknown as new () => InstanceType<C>
      ) as ServiceInstanceMethods<InstanceType<C>>;
    }
  }

  return ServiceBase as (abstract new () => InstanceType<U> & ServiceBase) &
    Static<typeof ServiceBase>;
}
