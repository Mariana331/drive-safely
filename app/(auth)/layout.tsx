import AuthPromoPanel from '@/components/auth/AuthPromoPanel/AuthPromoPanel';
import styles from './auth-layout.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <div className={styles.promo}>
        <AuthPromoPanel />
      </div>
      <div className={styles.form}>{children}</div>
    </div>
  );
}
