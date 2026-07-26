'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { NewsArticle } from '@/lib/api/api';
import {
  CATEGORY_STYLES,
  DEFAULT_CATEGORY_COUNTS,
  formatNewsDateShort,
  NEWS_FILTERS,
} from '@/lib/news/newsData';
import styles from './NewsSidebar.module.css';

interface NewsSidebarProps {
  topStories: NewsArticle[];
  categoryCounts: Record<string, number>;
}

export default function NewsSidebar({
  topStories,
  categoryCounts,
}: NewsSidebarProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const counts = { ...DEFAULT_CATEGORY_COUNTS, ...categoryCounts };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <aside className={styles.sidebar}>
      <section className={styles.widget}>
        <div className={styles.widgetHeader}>
          <h2 className={styles.widgetTitle}>Top Stories</h2>
          <Link href="/news" className={styles.viewAll}>
            View all →
          </Link>
        </div>
        <ul className={styles.storyList}>
          {topStories.slice(0, 3).map((story) => (
            <li key={story._id} className={styles.storyItem}>
              <div className={styles.storyThumb}>
                {story.imageUrl ? (
                  <Image
                    src={story.imageUrl}
                    alt=""
                    fill
                    className={styles.storyImage}
                    sizes="56px"
                  />
                ) : (
                  <div className={styles.storyPlaceholder} />
                )}
              </div>
              <div>
                <p className={styles.storyTitle}>{story.title}</p>
                <time className={styles.storyDate} dateTime={story.publishedAt}>
                  {formatNewsDateShort(story.publishedAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.widget}>
        <h2 className={styles.widgetTitle}>News by Category</h2>
        <ul className={styles.categoryList}>
          {NEWS_FILTERS.filter((f) => f.id !== 'all').map((filter) => {
            const style = CATEGORY_STYLES[filter.id];
            const count = counts[filter.id] ?? 0;

            return (
              <li key={filter.id} className={styles.categoryItem}>
                <span className={styles.categoryLeft}>
                  <span className={styles.categoryIcon}>{filter.icon}</span>
                  <span>{filter.label}</span>
                </span>
                <span className={styles.categoryCount}>{count}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`${styles.widget} ${styles.newsletter}`}>
        <div className={styles.newsletterIcon}>✉️</div>
        <h2 className={styles.widgetTitle}>Stay Informed</h2>
        <p className={styles.newsletterText}>
          Get the latest traffic news and safety tips delivered to your inbox.
        </p>
        {subscribed ? (
          <p className={styles.success}>Thanks for subscribing!</p>
        ) : (
          <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={styles.emailInput}
              required
            />
            <button type="submit" className={styles.subscribeBtn}>
              Subscribe
            </button>
          </form>
        )}
      </section>
    </aside>
  );
}
