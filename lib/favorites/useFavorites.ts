'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import {
  type FavoriteInput,
  type FavoriteItem,
  type FavoriteKind,
  loadFavorites,
  toggleFavorite,
  clearFavorites,
  removeFavorite,
} from './favoritesStore';

let version = 0;
const listeners = new Set<() => void>();

function emit() {
  version += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return version;
}

function getServerSnapshot() {
  return 0;
}

export function useFavorites() {
  const storeVersion = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [items, setItems] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setItems(loadFavorites());
  }, [storeVersion]);

  const toggle = useCallback((input: FavoriteInput) => {
    const result = toggleFavorite(input);
    setItems(result.items);
    emit();
    return result.saved;
  }, []);

  const remove = useCallback((kind: FavoriteKind, entityId: string) => {
    const next = removeFavorite(kind, entityId);
    setItems(next);
    emit();
  }, []);

  const clear = useCallback((kind?: FavoriteKind) => {
    const next = clearFavorites(kind);
    setItems(next);
    emit();
  }, []);

  return { items, toggle, remove, clear };
}

export function useIsFavorite(kind: FavoriteKind, entityId: string) {
  const { items } = useFavorites();
  return items.some(
    (item) => item.kind === kind && item.entityId === entityId,
  );
}
