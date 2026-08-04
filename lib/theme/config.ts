export const THEME_COOKIE = 'theme';
export const THEME_STORAGE_KEY = 'drivesafely-theme';

export type Theme = 'light' | 'dark';

export function normalizeTheme(value?: string | null): Theme | null {
  if (value === 'light' || value === 'dark') return value;
  return null;
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** Inline boot script — set on <html> before paint to avoid flash. */
export const THEME_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var c=${JSON.stringify(THEME_COOKIE)};var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){var m=document.cookie.match(new RegExp('(?:^|; )'+c+'=([^;]*)'));t=m?decodeURIComponent(m[1]):null;}if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){}})();`;
