'use client';

import Link from 'next/link';
import Tag from '@/components/ui/Tag/Tag';
import type { NewsArticle } from '@/lib/api/api';
import { useLocale, useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './NewsSection.module.css';

const fallbackArticles: NewsArticle[] = [
  {
    _id: '1',
    title: 'New Road Safety Law Enters Into Force',
    slug: 'new-road-safety-law',
    excerpt:
      'Important changes to road safety regulations are now in effect. Learn what every driver needs to know.',
    category: 'New Law',
    imageUrl: '',
    publishedAt: '2024-05-18T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '2',
    title: 'Updated Rules for Roundabouts',
    slug: 'updated-roundabout-rules',
    excerpt:
      'New guidelines for navigating roundabouts safely. Understand priority rules and common mistakes.',
    category: 'Update',
    imageUrl: '',
    publishedAt: '2024-05-12T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '3',
    title: 'What to Do at Yellow Light?',
    slug: 'yellow-light-guidelines',
    excerpt:
      'A quick reminder on how to handle yellow traffic lights correctly and avoid dangerous situations.',
    category: 'Reminder',
    imageUrl: '',
    publishedAt: '2024-05-08T00:00:00.000Z',
    isPublished: true,
  },
];

function NewsThumbnail({ category }: { category: string }) {
  const colors: Record<string, string> = {
    'New Law': '#FEF9C3',
    Update: '#DCFCE7',
    Reminder: '#FEE2E2',
  };

  return (
    <div
      className={styles.thumbnail}
      style={{ background: colors[category] ?? '#EFF6FF' }}
    >
      <svg viewBox="0 0 80 60" fill="none" aria-hidden="true">
        <rect x="10" y="15" width="60" height="35" rx="4" fill="white" opacity="0.8" />
        <path d="M20 35h40M20 28h30" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  const dict = useDictionary();
  const { locale } = useLocale();
  const displayArticles =
    articles.length > 0 ? articles.slice(0, 3) : fallbackArticles;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <section id="news" className={styles.section}>
      <div className="container_beforeAuth">
        <div className={styles.header}>
          <h2 className={styles.heading}>{dict.newsSection.heading}</h2>
          <Link href="/news" className={styles.viewAll}>
            {dict.newsSection.viewAll}
          </Link>
        </div>
        <div className={styles.grid}>
          {displayArticles.map((article) => (
            <article key={article._id} className={styles.card}>
              <NewsThumbnail category={article.category} />
              <div className={styles.cardBody}>
                <Tag category={article.category} />
                <h3 className={styles.cardTitle}>{article.title}</h3>
                <p className={styles.cardExcerpt}>{article.excerpt}</p>
                <time className={styles.date} dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
