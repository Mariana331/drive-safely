'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { NewsArticle } from '@/lib/api/api';
import { formatNewsDate } from '@/lib/news/newsData';
import {
  NEWS_LEARNING_JOURNEY,
  VIDEO_LEARNING_JOURNEY,
} from '@/lib/news/journey';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import { useFavorites, useIsFavorite } from '@/lib/favorites/useFavorites';
import NewsCategoryBadge from './NewsCategoryBadge';
import LearningJourney from './LearningJourney';
import styles from './NewsArticle.module.css';

interface NewsArticleClientProps {
  article: NewsArticle;
}

function renderBody(body: string) {
  return body.split(/\n\n+/).map((paragraph, index) => {
    const withBold = paragraph.replace(
      /\*\*(.+?)\*\*/g,
      '<strong>$1</strong>',
    );
    return (
      <p
        key={index}
        className={styles.paragraph}
        dangerouslySetInnerHTML={{ __html: withBold }}
      />
    );
  });
}

export default function NewsArticleClient({ article }: NewsArticleClientProps) {
  const dict = useDictionary();
  const { toggle } = useFavorites();
  const saved = useIsFavorite('news', article.slug);
  const related =
    article.relatedLinks && article.relatedLinks.length > 0
      ? article.relatedLinks
      : NEWS_LEARNING_JOURNEY;

  const handleFavorite = () => {
    toggle({
      kind: 'news',
      entityId: article.slug,
      title: article.title,
      subtitle: article.excerpt,
      href: `/news/${article.slug}`,
      imageUrl: article.imageUrl || undefined,
      meta: `${formatNewsDate(article.publishedAt)}${
        article.readTimeMinutes ? ` · ${article.readTimeMinutes} min` : ''
      }`,
    });
  };

  return (
    <>
      <DashboardHeader
        title="News article"
        subtitle="Official sources and next learning steps"
      />

      <div className={styles.page}>
        <div className={styles.topBar}>
          <Link href="/news" className={styles.back}>
            ← Back to News
          </Link>
          <button
            type="button"
            className={`${styles.favBtn} ${saved ? styles.favBtnActive : ''}`}
            onClick={handleFavorite}
            aria-pressed={saved}
          >
            {saved ? `★ ${dict.favorites.added}` : `☆ ${dict.favorites.add}`}
          </button>
        </div>

        <article className={styles.article}>
          <div className={styles.metaRow}>
            <NewsCategoryBadge category={article.category} />
            {article.sourceType === 'legislation' ? (
              <span className={styles.official}>Official source</span>
            ) : null}
            {article.sourceType === 'rss' ? (
              <span className={styles.live}>Auto-updated</span>
            ) : null}
          </div>

          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.byline}>
            <time dateTime={article.publishedAt}>
              {formatNewsDate(article.publishedAt)}
            </time>
            {article.sourceName ? <> · {article.sourceName}</> : null}
            {article.readTimeMinutes ? (
              <> · {article.readTimeMinutes} min read</>
            ) : null}
          </p>

          {article.imageUrl ? (
            <div className={styles.heroImage}>
              <Image
                src={article.imageUrl}
                alt=""
                fill
                className={styles.image}
                sizes="(max-width: 900px) 100vw, 800px"
                priority
              />
            </div>
          ) : null}

          <p className={styles.excerpt}>{article.excerpt}</p>
          <div className={styles.body}>
            {renderBody(article.body ?? article.excerpt)}
          </div>

          {article.sourceUrl ? (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceBtn}
            >
              Open official / original source ↗
            </a>
          ) : null}
        </article>

        <section className={styles.continue}>
          <h2 className={styles.continueTitle}>Continue learning</h2>
          <div className={styles.continueGrid}>
            {related.map((link) => (
              <Link key={link.href + link.label} href={link.href} className={styles.continueCard}>
                <span className={styles.continueLabel}>{link.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>

        <LearningJourney
          variant="news"
          title="From this news"
          subtitle="NEWS → Traffic Rules → Practice Test → AI Assistant"
          steps={NEWS_LEARNING_JOURNEY}
        />
        <LearningJourney
          variant="video"
          title="Or start from a video"
          subtitle="VIDEO → AI Analysis → Traffic Rules → Practice Test"
          steps={VIDEO_LEARNING_JOURNEY}
        />

        <DashboardFooter />
      </div>
    </>
  );
}
