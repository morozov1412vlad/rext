import type { AxiosRequestConfig } from 'axios';
import type { CRUDApiClient } from './ApiClient';

abstract class RepositoryMixin {
  protected abstract readonly path: string;
  protected abstract readonly client: CRUDApiClient;
}

export abstract class CGetMixin<TResponse> extends RepositoryMixin {
  public async get(id: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.client.get(`/${this.path}/${id}`, config);
  }
}

export abstract class CProtectedGetMixin<TResponse> extends RepositoryMixin {
  protected _get(id: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.client.get(`/${this.path}/${id}`, config);
  }
}

export abstract class CListMixin<TResponse> extends RepositoryMixin {
  public list(config?: AxiosRequestConfig): Promise<TResponse> {
    return this.client.get(config?.url ?? `/${this.path}`, config);
  }
}

export abstract class CProtectedListMixin<TResponse> extends RepositoryMixin {
  protected _list(config?: AxiosRequestConfig): Promise<TResponse> {
    return this.client.get(config?.url ?? `/${this.path}`, config);
  }
}

export abstract class CPostMixin<TResponse, TPayload> extends RepositoryMixin {
  public post(data: TPayload, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.client.post(this.path, data, config);
  }
}

export abstract class CProtectedPostMixin<TResponse, TPayload> extends RepositoryMixin {
  protected _post(data: TPayload, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.client.post(this.path, data, config);
  }
}

export abstract class CPutMixin<TResponse, TPayload> extends RepositoryMixin {
  public put(
    id: string,
    data: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.client.put(`/${this.path}/${id}`, data, config);
  }
}

export abstract class CProtectedPutMixin<TResponse, TPayload> extends RepositoryMixin {
  protected _put(
    id: string,
    data: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.client.put(`/${this.path}/${id}`, data, config);
  }
}

export abstract class CPatchMixin<TResponse, TPayload> extends RepositoryMixin {
  public patch(
    id: string,
    data: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.client.patch(`/${this.path}/${id}`, data, config);
  }
}

export abstract class CProtectedPatchMixin<TResponse, TPayload> extends RepositoryMixin {
  protected _patch(
    id: string,
    data: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.client.patch(`/${this.path}/${id}`, data, config);
  }
}

export abstract class CDeleteMixin<TResponse> extends RepositoryMixin {
  public delete(id: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.client.delete(`/${this.path}/${id}`, config);
  }
}

export abstract class CProtectedDeleteMixin<TResponse> extends RepositoryMixin {
  protected _delete(id: string, config?: AxiosRequestConfig): Promise<TResponse> {
    return this.client.delete(`/${this.path}/${id}`, config);
  }
}

export function GetMixin<TResponse>() {
  abstract class GetMixin extends CGetMixin<TResponse> {}
  return GetMixin;
}

export function ProtectedGetMixin<TResponse>() {
  abstract class ProtectedGetMixin extends CProtectedGetMixin<TResponse> {}
  return ProtectedGetMixin;
}

export function ListMixin<TResponse>() {
  abstract class ListMixin extends CListMixin<TResponse> {}
  return ListMixin;
}

export function ProtectedListMixin<TResponse>() {
  abstract class ProtectedListMixin extends CProtectedListMixin<TResponse> {}
  return ProtectedListMixin;
}

export function PostMixin<TResponse, TPayload>() {
  abstract class PostMixin extends CPostMixin<TResponse, TPayload> {}
  return PostMixin;
}

export function ProtectedPostMixin<TResponse, TPayload>() {
  abstract class ProtectedPostMixin extends CProtectedPostMixin<TResponse, TPayload> {}
  return ProtectedPostMixin;
}

export function PutMixin<TResponse, TPayload>() {
  abstract class PutMixin extends CPutMixin<TResponse, TPayload> {}
  return PutMixin;
}

export function ProtectedPutMixin<TResponse, TPayload>() {
  abstract class ProtectedPutMixin extends CProtectedPutMixin<TResponse, TPayload> {}
  return ProtectedPutMixin;
}

export function PatchMixin<TResponse, TPayload>() {
  abstract class PatchMixin extends CPatchMixin<TResponse, TPayload> {}
  return PatchMixin;
}

export function ProtectedPatchMixin<TResponse, TPayload>() {
  abstract class ProtectedPatchMixin extends CProtectedPatchMixin<TResponse, TPayload> {}
  return ProtectedPatchMixin;
}

export function DeleteMixin<TResponse = null>() {
  abstract class DeleteMixin extends CDeleteMixin<TResponse> {}
  return DeleteMixin;
}

export function ProtectedDeleteMixin<TResponse = null>() {
  abstract class ProtectedDeleteMixin extends CProtectedDeleteMixin<TResponse> {}
  return ProtectedDeleteMixin;
}