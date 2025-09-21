import type { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiCallDecoratorConfig extends Omit<AxiosRequestConfig, 'data'> {
  instance?: AxiosInstance;
}

export interface RepositoryInstanceBase {
  client?: AxiosInstance;
  resourcePath?: string;
}
