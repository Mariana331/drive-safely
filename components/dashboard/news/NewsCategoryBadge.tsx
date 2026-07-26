import type { NewsCategory } from '@/lib/api/api';
import { CATEGORY_STYLES, normalizeCategory } from '@/lib/news/newsData';
import styles from './NewsCategoryBadge.module.css';

interface NewsCategoryBadgeProps {
  category: NewsCategory;
}

export default function NewsCategoryBadge({ category }: NewsCategoryBadgeProps) {
  const normalized = normalizeCategory(category);
  const style = CATEGORY_STYLES[normalized] ?? CATEGORY_STYLES['Traffic News'];

  return (
    <span
      className={styles.badge}
      style={{ background: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}
