import Link from 'next/link';
import styles from './DashboardFooter.module.css';

export default function DashboardFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>© 2024 DriveSafely. All rights reserved.</p>
      <nav className={styles.links} aria-label="Footer">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
        <Link href="/help">Help</Link>
      </nav>
    </footer>
  );
}
