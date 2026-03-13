import type { Store, ConfigureStoreOptions } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

let _store: Store | null = null;

export function attachStore(store: Store) {
  _store = store;
}

export function getStore(): Store {
  if (!_store) throw new Error('Redux store not attached yet');
  return _store;
}

export function configureAppStore(options: ConfigureStoreOptions) {
  const store = configureStore(options);
  attachStore(store);
  return store;
}
