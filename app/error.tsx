'use client';

import Button from '@/components/ui/Button/Button';
import styles from './error.module.css';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.description}>
        We couldn&apos;t load this page. Please try again.
      </p>
      {error.message && (
        <p className={styles.errorDetail}>{error.message}</p>
      )}
      <div className={styles.actions}>
        <button onClick={reset} className={styles.retryBtn}>
          Try again
        </button>
        <Button variant="primary" href="/">
          Go home
        </Button>
      </div>
    </div>
  );
}
