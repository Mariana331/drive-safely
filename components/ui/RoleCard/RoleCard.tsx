import type { ExperienceLevel } from '@/lib/api/api';
import styles from './RoleCard.module.css';

interface RoleCardProps {
  value: ExperienceLevel;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: (value: ExperienceLevel) => void;
}

export default function RoleCard({
  value,
  title,
  subtitle,
  icon,
  selected,
  onSelect,
}: RoleCardProps) {
  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onSelect(value)}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.subtitle}>{subtitle}</span>
      {selected && <span className={styles.check}>✓</span>}
    </button>
  );
}
