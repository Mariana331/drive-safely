'use client';

import Image from 'next/image';
import Link from 'next/link';
import Tag from '@/components/ui/Tag/Tag';
import type { NewsArticle } from '@/lib/api/api';
import { OFFICIAL_LAWS_NEWS } from '@/lib/news/officialLaws';
import { useLocale, useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './NewsSection.module.css';

function NewsThumbnail({ article }: { article: NewsArticle }) {
  const isOfficial = article.sourceType === 'legislation';

  if (article.imageUrl) {
    return (
      <div className={styles.thumbnail}>
        <Image
          src={article.imageUrl}
          alt=""
          fill
          className={styles.thumbnailImage}
          sizes="(max-width: 767px) 100vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div
      className={`${styles.thumbnail} ${styles.thumbnailFallback}`}
      style={{
        background: isOfficial ? '#FFEDD5' : '#EFF6FF',
      }}
    >
      <span className={styles.thumbnailIcon} aria-hidden="true">
        {isOfficial ? '⚖️' : '📰'}
      </span>
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
    articles.length > 0 ? articles.slice(0, 3) : OFFICIAL_LAWS_NEWS.slice(0, 3);

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
          <div>
            <h2 className={styles.heading}>{dict.newsSection.heading}</h2>
            <p className={styles.subheading}>
              Official Traffic Laws from Verkhovna Rada &amp; HSC MIA, plus
              auto-updated road safety news.
            </p>
          </div>
          <Link href="/news" className={styles.viewAll}>
            {dict.newsSection.viewAll}
          </Link>
        </div>

        <div className={styles.streamHints}>
          <Link href="/news" className={styles.hintChip}>
            ⚖️ Traffic Laws
          </Link>
          <Link href="/news" className={styles.hintChip}>
            📰 General News
          </Link>
        </div>

        <div className={styles.grid}>
          {displayArticles.map((article) => {
            const isOfficial = article.sourceType === 'legislation';
            return (
              <article key={article._id} className={styles.card}>
                <Link href={`/news/${article.slug}`} className={styles.cardLink}>
                  <NewsThumbnail article={article} />
                  <div className={styles.cardBody}>
                    <div className={styles.badges}>
                      <Tag category={article.category} />
                      {isOfficial ? (
                        <span className={styles.official}>Official</span>
                      ) : null}
                      {article.sourceType === 'rss' ? (
                        <span className={styles.live}>Auto-updated</span>
                      ) : null}
                    </div>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                    <time className={styles.date} dateTime={article.publishedAt}>
                      {formatDate(article.publishedAt)}
                    </time>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
