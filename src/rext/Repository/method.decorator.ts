import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { RepositoryInstanceBase, ApiCallDecoratorConfig } from './types';

const join = (base = '', tail?: string | number) =>
  `${base}`.replace(/\/+$/, '') + (tail != null ? `/${tail}` : '');

function makeHttpDecorator<T>(
  method: AxiosRequestConfig['method'] | undefined,
  build: (self: RepositoryInstanceBase, args: any[], name: string) => AxiosRequestConfig
) {
  return (_: unknown, context: ClassFieldDecoratorContext<unknown, T>) => {
    const name = String(context.name);

    if (context.kind === 'field') {
      return function (this: any, _initialValue: any) {
        return (...args: any[]) => {
          const cfg = build(this, args, name);
          const client = (cfg as any).instance ?? this.client ?? axios;
          const { instance: _drop, ...rest } = cfg as any;
          return client.request({ method, ...rest });
        };
      };
    }

    throw new Error('Only methods or fields can be decorated');
  };
}

export function Request(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(config?: AxiosRequestConfig) => Promise<any>>(
    undefined,
    (self, args) => {
      const [requestCfg] = args as [AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '';
      const url = requestCfg?.url ?? base;
      return { url, ...config, ...requestCfg };
    }
  );
}

export function Get(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(config?: AxiosRequestConfig) => Promise<any>>(
    'GET',
    (self, args) => {
      const [requestCfg] = args as [AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '';
      const url = requestCfg?.url ?? base;
      return { url, ...config, ...requestCfg };
    }
  );
}

export function GetById(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(id: any, config?: AxiosRequestConfig) => Promise<any>>(
    'GET',
    (self, args) => {
      const [id, requestCfg] = args as [any, AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '';
      const url = requestCfg?.url ?? join(base, id);
      return { url, ...config, ...requestCfg };
    }
  );
}

export function Post(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(data: any, config?: AxiosRequestConfig) => Promise<any>>(
    'POST',
    (self, args) => {
      const [data, requestCfg] = args as [any, AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '/';
      const url = requestCfg?.url ?? base;
      return { url, data, ...config, ...requestCfg };
    }
  );
}

export function Put(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(data: any, config?: AxiosRequestConfig) => Promise<any>>(
    'PUT',
    (self, args) => {
      const [data, requestCfg] = args as [any, AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '/';
      const url = requestCfg?.url ?? base;
      return { url, data, ...config, ...requestCfg };
    }
  );
}

export function PutById(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<
    (id: any, data: any, config?: AxiosRequestConfig) => Promise<any>
  >('PUT', (self, args) => {
    const [id, data, requestCfg] = args as [any, any, AxiosRequestConfig?];
    const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '/';
    const url = requestCfg?.url ?? join(base, id);
    return { url, data, ...config, ...requestCfg };
  });
}

export function Patch(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(data: any, config?: AxiosRequestConfig) => Promise<any>>(
    'PATCH',
    (self, args) => {
      const [data, requestCfg] = args as [any, AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '/';
      const url = requestCfg?.url ?? base;
      return { url, data, ...config, ...requestCfg };
    }
  );
}

export function PatchById(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<
    (id: any, data: any, config?: AxiosRequestConfig) => Promise<any>
  >('PATCH', (self, args) => {
    const [id, data, requestCfg] = args as [any, any, AxiosRequestConfig?];
    const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '/';
    const url = requestCfg?.url ?? join(base, id);
    return { url, data, ...config, ...requestCfg };
  });
}

export function Delete(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(config?: AxiosRequestConfig) => Promise<any>>(
    'DELETE',
    (self, args) => {
      const [requestCfg] = args as [AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '/';
      const url = requestCfg?.url ?? base;
      return { url, ...config, ...requestCfg };
    }
  );
}

export function DeleteById(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(id: any, config?: AxiosRequestConfig) => Promise<any>>(
    'DELETE',
    (self, args) => {
      const [id, requestCfg] = args as [any, AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '/';
      const url = requestCfg?.url ?? join(base, id);
      return { url, ...config, ...requestCfg };
    }
  );
}

// Optional convenience if you want explicit methods:
export function Head(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(config?: AxiosRequestConfig) => Promise<any>>(
    'HEAD',
    (self, args) => {
      const [requestCfg] = args as [AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '';
      const url = requestCfg?.url ?? base;
      return { url, ...config, ...requestCfg };
    }
  );
}

export function Options(path?: string, config?: ApiCallDecoratorConfig) {
  return makeHttpDecorator<(config?: AxiosRequestConfig) => Promise<any>>(
    'OPTIONS',
    (self, args) => {
      const [requestCfg] = args as [AxiosRequestConfig?];
      const base = path ? join(self.resourcePath, path) : self.resourcePath ?? '';
      const url = requestCfg?.url ?? base;
      return { url, ...config, ...requestCfg };
    }
  );
}
