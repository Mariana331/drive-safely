'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ApiError } from '@/lib/api/api';
import { useAuth } from '@/lib/auth/AuthProvider';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import PasswordInput from '@/components/ui/PasswordInput/PasswordInput';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const { login } = useAuth();
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
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Log in to continue your journey.</p>
        </div>
        <p className={styles.signupLink}>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {error && <div className={styles.formError}>{error}</div>}

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<span>✉</span>}
          placeholder="you@example.com"
          required
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<span>🔒</span>}
          required
        />

        <Button variant="primary" size="lg" type="submit" className={styles.submit}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </div>
  );
}
