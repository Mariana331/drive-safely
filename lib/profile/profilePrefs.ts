import { readUserJson, writeUserJson } from '@/lib/progress/progressUser';

export interface ProfilePrefs {
  firstName: string;
  lastName: string;
  country: string;
  avatarDataUrl?: string;
}

const STORAGE_KEY = 'drivesafely_profile_prefs';

export const COUNTRY_OPTIONS = [
  'Ukraine',
  'Poland',
  'Germany',
  'Estonia',
  'Latvia',
  'Lithuania',
  'United Kingdom',
  'United States',
  'Other',
] as const;

export function loadProfilePrefs(): ProfilePrefs | null {
  return readUserJson<ProfilePrefs | null>(STORAGE_KEY, null);
}

export function saveProfilePrefs(prefs: ProfilePrefs) {
  writeUserJson(STORAGE_KEY, prefs);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('drivesafely:profile-updated'));
  }
}

export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

export function resolveDisplayName(
  fullName: string,
  prefs: ProfilePrefs | null,
) {
  if (prefs?.firstName || prefs?.lastName) {
    return [prefs.firstName, prefs.lastName].filter(Boolean).join(' ').trim();
  }
  return fullName;
}
