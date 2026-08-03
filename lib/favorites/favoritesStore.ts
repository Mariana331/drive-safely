import { readUserJson, writeUserJson } from '@/lib/progress/progressUser';

export type FavoriteKind = 'news' | 'test' | 'analysis' | 'assistant';

export interface FavoriteItem {
  id: string;
  kind: FavoriteKind;
  entityId: string;
  title: string;
  subtitle?: string;
  href: string;
  imageUrl?: string;
  meta?: string;
  savedAt: string;
}

export type FavoriteInput = Omit<FavoriteItem, 'id' | 'savedAt'> & {
  savedAt?: string;
};

const STORAGE_KEY = 'drivesafely_favorites';

export const FAVORITE_KIND_ORDER: FavoriteKind[] = [
  'news',
  'test',
  'analysis',
  'assistant',
];

export function favoriteId(kind: FavoriteKind, entityId: string) {
  return `${kind}:${entityId}`;
}

export function loadFavorites(): FavoriteItem[] {
  return readUserJson<FavoriteItem[]>(STORAGE_KEY, []);
}

export function persistFavorites(items: FavoriteItem[]) {
  writeUserJson(STORAGE_KEY, items.slice(0, 120));
}

export function isFavorite(kind: FavoriteKind, entityId: string): boolean {
  const id = favoriteId(kind, entityId);
  return loadFavorites().some((item) => item.id === id);
}

export function upsertFavorite(input: FavoriteInput): FavoriteItem[] {
  const id = favoriteId(input.kind, input.entityId);
  const current = loadFavorites();
  const nextItem: FavoriteItem = {
    ...input,
    id,
    savedAt: input.savedAt ?? new Date().toISOString(),
  };
  const without = current.filter((item) => item.id !== id);
  const next = [nextItem, ...without];
  persistFavorites(next);
  return next;
}

export function removeFavorite(kind: FavoriteKind, entityId: string): FavoriteItem[] {
  const id = favoriteId(kind, entityId);
  const next = loadFavorites().filter((item) => item.id !== id);
  persistFavorites(next);
  return next;
}

export function toggleFavorite(input: FavoriteInput): {
  items: FavoriteItem[];
  saved: boolean;
} {
  const id = favoriteId(input.kind, input.entityId);
  const current = loadFavorites();
  if (current.some((item) => item.id === id)) {
    return { items: removeFavorite(input.kind, input.entityId), saved: false };
  }
  return { items: upsertFavorite(input), saved: true };
}

export function clearFavorites(kind?: FavoriteKind) {
  if (!kind) {
    persistFavorites([]);
    return [];
  }
  const next = loadFavorites().filter((item) => item.kind !== kind);
  persistFavorites(next);
  return next;
}

export function filterFavorites(
  items: FavoriteItem[],
  opts: { kind?: FavoriteKind | 'all'; search?: string },
) {
  const q = opts.search?.trim().toLowerCase() ?? '';
  return items.filter((item) => {
    const matchKind = !opts.kind || opts.kind === 'all' || item.kind === opts.kind;
    if (!matchKind) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle?.toLowerCase().includes(q) ?? false) ||
      (item.meta?.toLowerCase().includes(q) ?? false)
    );
  });
}
