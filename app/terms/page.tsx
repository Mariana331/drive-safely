import Link from 'next/link';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Terms of Service — DriveSafely',
};

export default function TermsPage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1>Terms of Service</h1>
        <p>
          By using DriveSafely you agree to use the platform responsibly and
          follow applicable traffic laws in your region.
        </p>
        <p>
          AI analysis is provided for educational purposes and does not replace
          professional legal advice or official traffic authority guidance.
        </p>
        <Link href="/" className={styles.back}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
