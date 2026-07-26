'use client';

import { useMemo, useState } from 'react';
import type { NewsArticle, NewsListResponse } from '@/lib/api/api';
import {
  FALLBACK_NEWS,
  NEWS_COUNTRIES,
  NEWS_FILTERS,
  countByCategory,
  filterNewsArticles,
  paginateArticles,
} from '@/lib/news/newsData';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import NewsCard from './NewsCard';
import NewsSidebar from './NewsSidebar';
import styles from './NewsPage.module.css';

interface NewsPageClientProps {
  initialData: NewsListResponse;
  allArticles: NewsArticle[];
}

const PAGE_SIZE = 6;

export default function NewsPageClient({
  initialData,
  allArticles,
}: NewsPageClientProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [country, setCountry] = useState('All Countries');
  const [page, setPage] = useState(1);

  const sourceArticles =
    allArticles.length > 0 ? allArticles : FALLBACK_NEWS;

  const filtered = useMemo(
    () =>
      filterNewsArticles(sourceArticles, {
        category,
        country,
        search,
      }),
    [sourceArticles, category, country, search],
  );

  const paginated = useMemo(
    () => paginateArticles(filtered, page, PAGE_SIZE),
    [filtered, page],
  );

  const categoryCounts = useMemo(
    () =>
      Object.keys(initialData.categoryCounts).length > 0
        ? initialData.categoryCounts
        : countByCategory(sourceArticles),
    [initialData.categoryCounts, sourceArticles],
  );

  const topStories = sourceArticles.slice(0, 3);
  const start = filtered.length === 0 ? 0 : (paginated.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(paginated.page * PAGE_SIZE, filtered.length);

  const handleCategoryChange = (next: string) => {
    setCategory(next);
    setPage(1);
  };

  const handleCountryChange = (next: string) => {
    setCountry(next);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <>
      <DashboardHeader
        title="News & Updates"
        subtitle="Stay informed about traffic rules, safety tips, and driving news."
      />

      <div className={styles.page}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search news..."
              className={styles.searchInput}
              aria-label="Search news"
            />
          </div>

          <div className={styles.filters}>
            <div className={styles.filterPills}>
              {NEWS_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`${styles.pill} ${
                    category === filter.id ? styles.pillActive : ''
                  }`}
                  onClick={() => handleCategoryChange(filter.id)}
                >
                  {filter.icon && (
                    <span className={styles.pillIcon}>{filter.icon}</span>
                  )}
                  {filter.label}
                </button>
              ))}
            </div>

            <div className={styles.countrySelectWrap}>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className={styles.countrySelect}
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
        </div>

        <div className={styles.content}>
          <div className={styles.main}>
            {paginated.items.length > 0 ? (
              <div className={styles.grid}>
                {paginated.items.map((article) => (
                  <NewsCard key={article._id} article={article} />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <p>No articles match your filters.</p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => {
                    setSearch('');
                    setCategory('all');
                    setCountry('All Countries');
                    setPage(1);
                  }}
                >
                  Reset filters
                </button>
              </div>
            )}

            {filtered.length > 0 && (
              <div className={styles.pagination}>
                <p className={styles.paginationInfo}>
                  Showing {start}–{end} of {filtered.length} news
                </p>
                <div className={styles.paginationControls}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={paginated.page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                  {Array.from({ length: paginated.totalPages }, (_, i) => i + 1)
                    .slice(0, 5)
                    .map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        className={`${styles.pageBtn} ${
                          pageNum === paginated.page ? styles.pageBtnActive : ''
                        }`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                  <button
                    type="button"
                    className={styles.pageBtn}
                    disabled={paginated.page >= paginated.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    aria-label="Next page"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}

            <DashboardFooter />
          </div>

          <NewsSidebar
            topStories={topStories}
            categoryCounts={categoryCounts}
          />
        </div>
      </div>
    </>
  );
}
