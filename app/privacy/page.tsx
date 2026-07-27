import Link from 'next/link';
import styles from './legal.module.css';

export const metadata = {
  title: 'Privacy Policy — DriveSafely',
};

export default function PrivacyPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1>Privacy Policy</h1>
        <p>
          DriveSafely collects account information and usage data to provide AI
          driving analysis, progress tracking, and personalized recommendations.
        </p>
        <p>
          Your data is stored securely and is not sold to third parties. You can
          request account deletion by contacting support.
        </p>
        <Link href="/signup" className={styles.back}>
          ← Back to sign up
        </Link>
      </div>
    </div>
  );
}
