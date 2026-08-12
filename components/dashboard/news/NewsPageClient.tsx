'use client';

import { useMemo, useState } from 'react';
import type { NewsArticle, NewsListResponse } from '@/lib/api/api';
import {
  NEWS_COUNTRIES,
  countByCategory,
  filterNewsArticles,
  paginateArticles,
} from '@/lib/news/newsData';
import {
  NEWS_LEARNING_JOURNEY,
  VIDEO_LEARNING_JOURNEY,
} from '@/lib/news/journey';
import { splitNewsStreams } from '@/lib/news/getNewsCatalog';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import NewsCard from './NewsCard';
import NewsSidebar from './NewsSidebar';
import LearningJourney from './LearningJourney';
import styles from './NewsPage.module.css';

interface NewsPageClientProps {
  initialData: NewsListResponse;
  allArticles: NewsArticle[];
}

type StreamTab = 'laws' | 'general';

const PAGE_SIZE = 6;

export default function NewsPageClient({
  initialData,
  allArticles,
}: NewsPageClientProps) {
  const dict = useDictionary();
  const [stream, setStream] = useState<StreamTab>('laws');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('All Countries');
  const [page, setPage] = useState(1);

  const { laws, general } = useMemo(
    () => splitNewsStreams(allArticles),
    [allArticles],
  );

  const streamArticles = stream === 'laws' ? laws : general;

  const generalFilters = [
    { id: 'all', label: 'All', icon: '📰' },
    { id: 'Traffic News', label: 'Traffic News', icon: '📰' },
    { id: 'Road Safety', label: 'Road Safety', icon: '🛡️' },
    { id: 'AI & Automotive', label: 'AI & Automotive', icon: '🤖' },
  ];

  const filtered = useMemo(
    () =>
      filterNewsArticles(streamArticles, {
        category: stream === 'laws' ? 'all' : category,
        country: stream === 'laws' ? 'All Countries' : country,
        search,
      }),
    [streamArticles, stream, category, country, search],
  );

  const paginated = useMemo(
    () => paginateArticles(filtered, page, PAGE_SIZE),
    [filtered, page],
  );

  const categoryCounts = useMemo(
    () =>
      Object.keys(initialData.categoryCounts).length > 0
        ? initialData.categoryCounts
        : countByCategory(allArticles),
    [initialData.categoryCounts, allArticles],
  );

  const topStories = streamArticles.slice(0, 3);
  const start = filtered.length === 0 ? 0 : (paginated.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(paginated.page * PAGE_SIZE, filtered.length);

  return (
    <>
      <DashboardHeader
        title={dict.dashboard.newsTitle}
        subtitle={dict.dashboard.newsSubtitle}
      />

      <div className={styles.page}>
        <LearningJourney
          variant="news"
          title="Learning path from News"
          subtitle="NEWS → Traffic Rules → Practice Test → AI Assistant"
          steps={NEWS_LEARNING_JOURNEY}
        />
        <LearningJourney
          variant="video"
          title="Learning path from Video"
          subtitle="VIDEO → AI Analysis → Traffic Rules → Practice Test"
          steps={VIDEO_LEARNING_JOURNEY}
        />

        <div className={styles.streamTabs} role="tablist" aria-label="News streams">
          <button
            type="button"
            role="tab"
            aria-selected={stream === 'laws'}
            className={`${styles.streamTab} ${
              stream === 'laws' ? styles.streamTabActive : ''
            }`}
            onClick={() => {
              setStream('laws');
              setPage(1);
              setCategory('all');
            }}
          >
            ⚖️ Traffic Laws
            <span className={styles.streamCount}>{laws.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={stream === 'general'}
            className={`${styles.streamTab} ${
              stream === 'general' ? styles.streamTabActive : ''
            }`}
            onClick={() => {
              setStream('general');
              setPage(1);
            }}
          >
            📰 General News
            <span className={styles.streamCount}>{general.length}</span>
          </button>
        </div>

        <p className={styles.streamHint}>
          {stream === 'laws'
            ? 'Changes to PDR, fines and legislation — official sources only (Verkhovna Rada, HSC MIA).'
            : 'Road Safety / Automotive / Traffic headlines from public news feeds. Auto-updated.'}
        </p>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search news..."
              className={styles.searchInput}
              aria-label="Search news"
            />
          </div>

          {stream === 'general' ? (
            <div className={styles.filters}>
              <div className={styles.filterPills}>
                {generalFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`${styles.pill} ${
                      category === filter.id ? styles.pillActive : ''
                    }`}
                    onClick={() => {
                      setCategory(filter.id);
                      setPage(1);
                    }}
                  >
                    {filter.icon ? (
                      <span className={styles.pillIcon}>{filter.icon}</span>
                    ) : null}
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className={styles.countrySelectWrap}>
                <select
                  className={styles.countrySelect}
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by country"
                >
                  {NEWS_COUNTRIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <span className={styles.selectChevron} aria-hidden="true">
                  ▾
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.content}>
          <div className={styles.main} id="news-feed">
            {paginated.items.length === 0 ? (
              <div className={styles.empty}>
                <p>No articles in this section yet.</p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => {
                    setSearch('');
                    setCategory('all');
                    setCountry('All Countries');
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className={styles.grid}>
                {paginated.items.map((article) => (
                  <NewsCard key={article._id} article={article} />
                ))}
              </div>
            )}

            {filtered.length > 0 ? (
              <div className={styles.pagination}>
                <p className={styles.paginationInfo}>
                  Showing {start}–{end} of {filtered.length}
                </p>
                <div className={styles.paginationControls}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ←
                  </button>
                  {Array.from({ length: paginated.totalPages }, (_, i) => i + 1)
                    .slice(
                      Math.max(0, page - 3),
                      Math.max(0, page - 3) + 5,
                    )
                    .map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`${styles.pageBtn} ${
                          n === page ? styles.pageBtnActive : ''
                        }`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))}
                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={page >= paginated.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    →
                  </button>
                </div>
              </div>
            ) : null}

            <DashboardFooter />
          </div>

          <NewsSidebar
            topStories={topStories}
            categoryCounts={categoryCounts}
            onViewAll={() => {
              setSearch('');
              setCategory('all');
              setCountry('All Countries');
              setPage(1);
              if (stream === 'laws' && general.length > 0) {
                setStream('general');
              }
              window.requestAnimationFrame(() => {
                document
                  .getElementById('news-feed')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              });
            }}
            onSelectCategory={(nextCategory) => {
              if (nextCategory === 'Traffic Laws') {
                setStream('laws');
                setCategory('all');
              } else {
                setStream('general');
                setCategory(nextCategory);
              }
              setSearch('');
              setCountry('All Countries');
              setPage(1);
              window.requestAnimationFrame(() => {
                document
                  .getElementById('news-feed')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              });
            }}
          />
        </div>
      </div>
    </>
  );
}
