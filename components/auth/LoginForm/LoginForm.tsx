'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/lib/api/api';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import PasswordInput from '@/components/ui/PasswordInput/PasswordInput';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const { login } = useAuth();
  const dict = useDictionary();
  const a = dict.auth;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(a.genericError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.mobileLang}>
        <LanguageSwitcher variant="header" />
      </div>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{a.welcomeBack}</h2>
          <p className={styles.subtitle}>{a.loginSubtitle}</p>
        </div>
        <p className={styles.signupLink}>
          {a.noAccount} <Link href="/signup">{a.signUpLink}</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {error && <div className={styles.formError}>{error}</div>}

        <Input
          label={a.email}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<span>✉</span>}
          placeholder="you@example.com"
          required
        />
        <PasswordInput
          label={a.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<span>🔒</span>}
          required
        />

        <Button variant="primary" size="lg" type="submit" className={styles.submit}>
          {loading ? dict.common.loggingIn : dict.common.login}
        </Button>
      </form>
    </div>
  );
}
