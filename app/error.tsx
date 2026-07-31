'use client';

import Button from '@/components/ui/Button/Button';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './error.module.css';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  const dict = useDictionary();

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{dict.error.title}</h1>
      <p className={styles.description}>{dict.error.text}</p>
      {error.message && (
        <p className={styles.errorDetail}>{error.message}</p>
      )}
      <div className={styles.actions}>
        <button onClick={reset} className={styles.retryBtn}>
          {dict.error.tryAgain}
        </button>
        <Button variant="primary" href="/">
          {dict.error.home}
        </Button>
      </div>
    </div>
  );
}
