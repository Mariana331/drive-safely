'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import {
  COUNTRY_OPTIONS,
  loadProfilePrefs,
  saveProfilePrefs,
  splitFullName,
  type ProfilePrefs,
} from '@/lib/profile/profilePrefs';
import styles from './EditProfilePage.module.css';

export default function EditProfilePageClient() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const dict = useDictionary();
  const t = dict.profile;
  const fileRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Ukraine');
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | undefined>();
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!user) return;
    const prefs = loadProfilePrefs();
    const split = splitFullName(user.fullName);
    setFirstName(prefs?.firstName || split.firstName);
    setLastName(prefs?.lastName || split.lastName);
    setEmail(user.email);
    setCountry(prefs?.country || user.country || 'Ukraine');
    setAvatarDataUrl(prefs?.avatarDataUrl || user.avatarUrl || undefined);
  }, [user]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <DashboardHeader title={t.editTitle} subtitle={t.loading} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loading}>
        <DashboardHeader title={t.editTitle} subtitle={t.loginRequired} />
      </div>
    );
  }

  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const onPickPhoto = (file?: File | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 4 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (event: FormEvent) => {
    event.preventDefault();
    const next: ProfilePrefs = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      country,
      avatarDataUrl,
    };
    saveProfilePrefs(next);
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2200);
  };

  const handleChangePassword = (event: FormEvent) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t.passwordRequired);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t.passwordTooShort);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t.passwordMismatch);
      return;
    }

    // Backend password update is not exposed yet — validate locally and confirm UX.
    setPasswordMessage(t.passwordSavedLocal);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <DashboardHeader title={`⚙️ ${t.settingsTitle}`} subtitle={t.editSubtitle} />

      <div className={styles.page}>
        <nav className={styles.settingsNav} aria-label={t.settingsTitle}>
          <a href="#edit-profile" className={styles.navActive}>
            {t.navPersonal}
          </a>
          <a href="#change-password">{t.navPassword}</a>
          <span className={styles.navMuted}>{t.navNotifications}</span>
          <span className={styles.navMuted}>{t.navLanguage}</span>
          <span className={styles.navMuted}>{t.navPrivacy}</span>
        </nav>

        <form
          id="edit-profile"
          className={styles.card}
          onSubmit={handleSaveProfile}
        >
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{t.editTitle}</h2>
            <Link href="/profile" className={styles.backLink}>
              ← {t.backToProfile}
            </Link>
          </div>

          <div className={styles.avatarRow}>
            <div className={styles.avatarWrap}>
              {avatarDataUrl ? (
                <Image
                  src={avatarDataUrl}
                  alt=""
                  fill
                  className={styles.avatarImage}
                  unoptimized={avatarDataUrl.startsWith('data:')}
                />
              ) : (
                <div className={styles.avatarFallback}>{initials || '🙂'}</div>
              )}
            </div>
            <div>
              <button
                type="button"
                className={styles.changePhoto}
                onClick={() => fileRef.current?.click()}
              >
                {t.changePhoto}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={(e) => {
                  onPickPhoto(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          <div className={styles.fields}>
            <label className={styles.field}>
              <span>{t.firstName}</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label className={styles.field}>
              <span>{t.lastName}</span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>{t.email}</span>
              <input value={email} readOnly />
            </label>
            <label className={styles.field}>
              <span>{t.country}</span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {COUNTRY_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => router.push('/profile')}
            >
              {t.cancel}
            </button>
            <button type="submit" className={styles.primaryBtn}>
              {t.saveChanges}
            </button>
          </div>
          {profileSaved ? (
            <p className={styles.success}>{t.profileSaved}</p>
          ) : null}
        </form>

        <form
          id="change-password"
          className={styles.card}
          onSubmit={handleChangePassword}
        >
          <h2 className={styles.cardTitle}>{t.changePasswordTitle}</h2>
          <div className={styles.fields}>
            <label className={styles.field}>
              <span>{t.currentPassword}</span>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            <label className={styles.field}>
              <span>{t.newPassword}</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>
            <label className={styles.field}>
              <span>{t.confirmPassword}</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </label>
          </div>
          {passwordError ? (
            <p className={styles.error}>{passwordError}</p>
          ) : null}
          {passwordMessage ? (
            <p className={styles.success}>{passwordMessage}</p>
          ) : null}
          <div className={styles.actions}>
            <button type="submit" className={styles.primaryBtn}>
              {t.changePassword}
            </button>
          </div>
        </form>

        <DashboardFooter />
      </div>
    </>
  );
}
