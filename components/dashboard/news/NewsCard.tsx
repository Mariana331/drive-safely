'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { NewsArticle } from '@/lib/api/api';
import { formatNewsDate } from '@/lib/news/newsData';
import NewsCategoryBadge from './NewsCategoryBadge';
import styles from './NewsCard.module.css';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const [saved, setSaved] = useState(false);
  const readTime = article.readTimeMinutes ?? 3;
  const isOfficial = article.sourceType === 'legislation';

  return (
    <article className={styles.card}>
      <Link href={`/news/${article.slug}`} className={styles.imageWrap}>
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt=""
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>{isOfficial ? '⚖️' : '📰'}</span>
          </div>
        )}
      </Link>

      <div className={styles.body}>
        <div className={styles.badges}>
          <NewsCategoryBadge category={article.category} />
          {isOfficial ? (
            <span className={styles.official}>Official source</span>
          ) : null}
          {article.sourceType === 'rss' ? (
            <span className={styles.live}>Auto-updated</span>
          ) : null}
        </div>

        <h3 className={styles.title}>
          <Link href={`/news/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className={styles.excerpt}>{article.excerpt}</p>

        <div className={styles.footer}>
          <div className={styles.meta}>
            <time dateTime={article.publishedAt}>
              {formatNewsDate(article.publishedAt)}
            </time>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <span>{readTime} min read</span>
          </div>

          <button
            type="button"
            className={`${styles.bookmark} ${saved ? styles.bookmarkActive : ''}`}
            aria-label={saved ? 'Remove bookmark' : 'Save article'}
            onClick={() => setSaved(!saved)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 4h12a1 1 0 011 1v15l-7-4-7 4V5a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.8"
                fill={saved ? 'currentColor' : 'none'}
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
