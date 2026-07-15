import Sidebar from '@/components/dashboard/Sidebar/Sidebar';
import styles from './dashboard-layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
