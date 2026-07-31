'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ExperienceLevel } from '@/lib/api/api';
import { ApiError } from '@/lib/api/api';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import PasswordInput from '@/components/ui/PasswordInput/PasswordInput';
import Select from '@/components/ui/Select/Select';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import RoleCard from '@/components/ui/RoleCard/RoleCard';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import styles from './SignupForm.module.css';

const countries = [
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Ukraine', label: 'Ukraine' },
  { value: 'Poland', label: 'Poland' },
];

export default function SignupForm() {
  const { register } = useAuth();
  const dict = useDictionary();
  const a = dict.auth;
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [experienceLevel, setExperienceLevel] =
    useState<ExperienceLevel>('new');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Full name is required';
    if (!email.includes('@')) next.email = 'Valid email is required';
    if (password.length < 6) next.password = 'Min 6 characters';
    if (password !== confirmPassword) next.confirmPassword = 'Passwords must match';
    if (!dateOfBirth) next.dateOfBirth = 'Date of birth is required';
    if (!country) next.country = 'Country is required';
    if (!agreeToTerms) next.agreeToTerms = 'You must agree to the terms';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        fullName,
        email,
        password,
        confirmPassword,
        dateOfBirth,
        country,
        driverLicense,
        experienceLevel,
        agreeToTerms,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError(a.genericError);
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
          <h2 className={styles.title}>{a.createAccount}</h2>
          <p className={styles.subtitle}>{a.signupSubtitle}</p>
        </div>
        <p className={styles.loginLink}>
          {a.haveAccount} <Link href="/login">{a.logInLink}</Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {formError && <div className={styles.formError}>{formError}</div>}

        <div className={styles.row}>
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            icon={<span>👤</span>}
            placeholder="John Doe"
          />
          <Input
            label={a.email}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={<span>✉</span>}
            placeholder="you@example.com"
          />
        </div>

        <div className={styles.row}>
          <PasswordInput
            label={a.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={<span>🔒</span>}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            icon={<span>🔒</span>}
          />
        </div>

        <div className={styles.row}>
          <Input
            label="Date of Birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            error={errors.dateOfBirth}
          />
          <Select
            label="Country"
            options={countries}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            error={errors.country}
          />
        </div>

        <Input
          label="Driver's License (Optional)"
          value={driverLicense}
          onChange={(e) => setDriverLicense(e.target.value)}
          placeholder="License number"
        />

        <div className={styles.roleSection}>
          <p className={styles.roleLabel}>What best describes you?</p>
          <div className={styles.roles}>
            <RoleCard
              value="new"
              title="New Driver"
              subtitle="0 - 1 year"
              icon="🧑"
              selected={experienceLevel === 'new'}
              onSelect={setExperienceLevel}
            />
            <RoleCard
              value="experienced"
              title="Experienced Driver"
              subtitle="1 - 5 years"
              icon="🚗"
              selected={experienceLevel === 'experienced'}
              onSelect={setExperienceLevel}
            />
            <RoleCard
              value="professional"
              title="Professional Driver"
              subtitle="5+ years"
              icon="🚛"
              selected={experienceLevel === 'professional'}
              onSelect={setExperienceLevel}
            />
          </div>
        </div>

        <Checkbox
          label={
            <>
              I agree to the{' '}
              <Link href="/terms">Terms of Service</Link> and{' '}
              <Link href="/privacy">Privacy Policy</Link>
            </>
          }
          checked={agreeToTerms}
          onChange={setAgreeToTerms}
          error={errors.agreeToTerms}
        />

        <Button variant="primary" size="lg" type="submit" className={styles.submit}>
          {loading ? 'Creating account...' : 'Create Account →'}
        </Button>

        <div className={styles.divider}>
          <span>or sign up with</span>
        </div>

        <div className={styles.social}>
          <button type="button" disabled className={styles.socialBtn}>
            Google
          </button>
          <button type="button" disabled className={styles.socialBtn}>
            Apple
          </button>
          <button type="button" disabled className={styles.socialBtn}>
            Facebook
          </button>
        </div>

        <p className={styles.secure}>
          🛡 Your data is secure and will never be shared with third parties.
        </p>
      </form>
    </div>
  );
}
