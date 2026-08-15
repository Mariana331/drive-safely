export const THEME_COOKIE = 'theme';
export const THEME_STORAGE_KEY = 'drivesafely-theme';

export const THEMES = ['light', 'teal', 'mauve', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

/** Map removed theme ids so stored prefs still resolve. */
const LEGACY_THEMES: Record<string, Theme> = {
  rose: 'mauve',
  red: 'teal',
};

export function normalizeTheme(value?: string | null): Theme | null {
  if (!value) return null;
  if ((THEMES as readonly string[]).includes(value)) {
    return value as Theme;
  }
  return LEGACY_THEMES[value] ?? null;
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function themeColorScheme(theme: Theme): 'light' | 'dark' {
  return theme === 'dark' ? 'dark' : 'light';
}

export function nextTheme(current: Theme): Theme {
  const index = THEMES.indexOf(current);
  return THEMES[(index + 1) % THEMES.length];
}

const THEME_LIST_JS = JSON.stringify([...THEMES]);
const LEGACY_MAP_JS = JSON.stringify(LEGACY_THEMES);

/** Inline boot script — set on <html> before paint to avoid flash. */
export const THEME_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var c=${JSON.stringify(THEME_COOKIE)};var allowed=${THEME_LIST_JS};var legacy=${LEGACY_MAP_JS};var t=localStorage.getItem(k);if(allowed.indexOf(t)<0){t=legacy[t]||null;}if(!t||allowed.indexOf(t)<0){var m=document.cookie.match(new RegExp('(?:^|; )'+c+'=([^;]*)'));t=m?decodeURIComponent(m[1]):null;if(t&&allowed.indexOf(t)<0){t=legacy[t]||null;}}if(!t||allowed.indexOf(t)<0){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t==='dark'?'dark':'light';}catch(e){}})();`;
