import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Mixin } from '../../__old__/lib/mixin';
import type { Class, FullClass } from '../../__old__/lib/mixin';
import { GetMixin, PostMixin, PutMixin, PatchMixin, DeleteMixin } from './mixins';

abstract class AbstractApiClient {
  protected abstract readonly client: AxiosInstance;

  public request<T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R> {
    return this.client.request(config);
  }
}

export function ApiClient<T extends Class[]>(
  ...mixins: T
): FullClass<[typeof AbstractApiClient, ...T]> {
  return Mixin(AbstractApiClient, ...mixins);
}

export abstract class CRUDApiClient extends ApiClient(
  GetMixin,
  PostMixin,
  PutMixin,
  PatchMixin,
  DeleteMixin
) {
  protected abstract readonly client: AxiosInstance;
}
