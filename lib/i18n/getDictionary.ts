import type { Locale } from './config';
import type { Dictionary } from './dictionaries/en';

const dictionaries = {
  en: () => import('./dictionaries/en').then((m) => m.en),
  uk: () => import('./dictionaries/uk').then((m) => m.uk),
};

export type { Dictionary };

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
