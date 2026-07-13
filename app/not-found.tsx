import Button from '@/components/ui/Button/Button';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404 — Page Not Found</h1>
      <p className={styles.description}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button variant="primary" href="/">
        Back to Home
      </Button>
    </div>
  );
}
