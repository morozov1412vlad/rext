import {
  GetMixin,
  ListMixin,
  PostMixin,
  PutMixin,
  PatchMixin,
  DeleteMixin,
  ProtectedGetMixin,
  ProtectedListMixin,
  ProtectedPostMixin,
  ProtectedPutMixin,
  ProtectedPatchMixin,
  ProtectedDeleteMixin,
} from './mixins';
import type { Class } from '../lib/mixin';
import { Mixin } from '../lib/mixin';

export function Repository<T extends Class[]>(...mixins: T) {
  return Mixin(...mixins);
}

export function CRUDRepository<
  TResponse,
  TPayload,
  TListResponse,
  TDeleteResponse = null,
  TPostResponse = TResponse,
  TPutResponse = TResponse,
  TPatchResponse = TResponse,
  TPutPayload = TPayload,
  TPatchPayload = TPayload
>() {
  return Repository(
    GetMixin<TResponse>(),
    ListMixin<TListResponse>(),
    PostMixin<TPostResponse, TPayload>(),
    PutMixin<TPutResponse, TPutPayload>(),
    PatchMixin<TPatchResponse, TPatchPayload>(),
    DeleteMixin<TDeleteResponse>()
  );
}

export function ProtectedCRUDRepository<
  TResponse,
  TPayload,
  TListResponse,
  TDeleteResponse = null,
  TPostResponse = TResponse,
  TPutResponse = TResponse,
  TPatchResponse = TResponse,
  TPutPayload = TPayload,
  TPatchPayload = TPayload
>() {
  Repository(
    ProtectedGetMixin<TResponse>(),
    ProtectedListMixin<TListResponse>(),
    ProtectedPostMixin<TPostResponse, TPayload>(),
    ProtectedPutMixin<TPutResponse, TPutPayload>(),
    ProtectedPatchMixin<TPatchResponse, TPatchPayload>(),
    ProtectedDeleteMixin<TDeleteResponse>()
  );
}
