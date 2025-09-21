import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

abstract class ApiClientMixin {
  protected abstract readonly client: AxiosInstance;

  public abstract request<T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>
  ): Promise<R>;
}

export abstract class GetMixin extends ApiClientMixin {
  public get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.get<T, R, D>(url, config);
  }
}

export abstract class PostMixin extends ApiClientMixin {
  public post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.post<T, R, D>(url, data, config);
  }
}

export abstract class PutMixin extends ApiClientMixin {
  public put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.put<T, R, D>(url, data, config);
  }
}

export abstract class PatchMixin extends ApiClientMixin {
  public patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.patch<T, R, D>(url, data, config);
  }
}

export abstract class DeleteMixin extends ApiClientMixin {
  public delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.delete<T, R, D>(url, config);
  }
}

export abstract class HeadMixin extends ApiClientMixin {
  public head<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.head<T, R, D>(url, config);
  }
}

export abstract class OptionsMixin extends ApiClientMixin {
  public options<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.client.options<T, R, D>(url, config);
  }
}
