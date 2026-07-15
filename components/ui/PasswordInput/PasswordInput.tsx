'use client';

import { useState } from 'react';
import Input from '../Input/Input';
import styles from './PasswordInput.module.css';

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function PasswordInput({
  label,
  error,
  icon,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrap}>
      <Input
        label={label}
        error={error}
        icon={icon}
        type={visible ? 'text' : 'password'}
        {...props}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? '🙈' : '👁'}
      </button>
    </div>
  );
}
