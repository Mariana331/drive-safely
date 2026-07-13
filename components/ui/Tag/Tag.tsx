import styles from './Tag.module.css';
import type { NewsCategory } from '@/lib/api/api';

interface TagProps {
  category: NewsCategory;
}

const categoryClass: Record<NewsCategory, string> = {
  'New Law': styles.newLaw,
  Update: styles.update,
  Reminder: styles.reminder,
};

export default function Tag({ category }: TagProps) {
  return (
    <span className={`${styles.tag} ${categoryClass[category]}`}>
      {category}
    </span>
  );
}
