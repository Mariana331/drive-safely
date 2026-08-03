'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import {
  filterFavorites,
  type FavoriteItem,
  type FavoriteKind,
} from '@/lib/favorites/favoritesStore';
import { useFavorites } from '@/lib/favorites/useFavorites';
import styles from './FavoritesPage.module.css';

type TabId = 'all' | FavoriteKind;

const KIND_ICONS: Record<FavoriteKind, string> = {
  news: '📰',
  test: '📝',
  analysis: '🎥',
  assistant: '🤖',
};

function actionLabel(
  kind: FavoriteKind,
  labels: {
    actionRead: string;
    actionStart: string;
    actionView: string;
    actionOpen: string;
  },
) {
  switch (kind) {
    case 'news':
      return labels.actionRead;
    case 'test':
      return labels.actionStart;
    case 'analysis':
      return labels.actionView;
    case 'assistant':
      return labels.actionOpen;
  }
}

function FavoriteCard({
  item,
  kindLabel,
  action,
  removeLabel,
  onRemove,
}: {
  item: FavoriteItem;
  kindLabel: string;
  action: string;
  removeLabel: string;
  onRemove: () => void;
}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon} aria-hidden="true">
          {KIND_ICONS[item.kind]}
        </span>
        <h2 className={styles.cardKind}>{kindLabel}</h2>
      </div>

      <p className={styles.cardTitle}>{item.title}</p>
      {item.subtitle ? (
        <p className={styles.cardSubtitle}>{item.subtitle}</p>
      ) : null}

      <div className={styles.cardFooter}>
        <Link href={item.href} className={styles.actionLink}>
          {action} →
        </Link>
        <button
          type="button"
          className={styles.heartBtn}
          aria-label={removeLabel}
          onClick={onRemove}
        >
          ❤️
        </button>
      </div>
    </article>
  );
}

export default function FavoritesPageClient() {
  const dict = useDictionary();
  const t = dict.favorites;
  const { items, remove } = useFavorites();
  const [tab, setTab] = useState<TabId>('all');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'all', label: t.tabAll },
    { id: 'news', label: t.tabNews },
    { id: 'test', label: t.tabTests },
    { id: 'analysis', label: t.tabVideo },
    { id: 'assistant', label: t.tabAi },
  ];

  const kindLabel = (kind: FavoriteKind) => {
    switch (kind) {
      case 'news':
        return t.kindNews;
      case 'test':
        return t.kindTest;
      case 'analysis':
        return t.kindAnalysis;
      case 'assistant':
        return t.kindAssistant;
    }
  };

  const visible = useMemo(
    () => filterFavorites(items, { kind: tab }),
    [items, tab],
  );

  const browseHref =
    tab === 'news'
      ? '/news'
      : tab === 'test'
        ? '/tests'
        : tab === 'analysis'
          ? '/ai-analysis'
          : tab === 'assistant'
            ? '/assistant'
            : '/news';

  return (
    <>
      <DashboardHeader title={`❤️ ${t.title}`} subtitle={t.subtitle} />

      <div className={styles.page}>
        <div className={styles.filters} role="tablist" aria-label={t.title}>
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`${styles.filter} ${
                tab === item.id ? styles.filterActive : ''
              }`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <section className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden="true">
              ❤️
            </div>
            <h2 className={styles.emptyTitle}>{t.emptyTitle}</h2>
            <p className={styles.emptyText}>{t.emptyText}</p>
            <div className={styles.emptyLinks}>
              <Link href="/news" className={styles.primaryBtn}>
                {t.browseNews}
              </Link>
              <Link href="/tests" className={styles.secondaryBtn}>
                {t.browseTests}
              </Link>
              <Link href="/ai-analysis" className={styles.secondaryBtn}>
                {t.browseAnalysis}
              </Link>
              <Link href="/assistant" className={styles.secondaryBtn}>
                {t.browseAssistant}
              </Link>
            </div>
          </section>
        ) : visible.length === 0 ? (
          <section className={styles.empty}>
            <h2 className={styles.emptyTitle}>{t.noMatch}</h2>
            <Link href={browseHref} className={styles.primaryBtn}>
              {t.browseMore}
            </Link>
          </section>
        ) : (
          <div className={styles.grid}>
            {visible.map((item) => (
              <FavoriteCard
                key={item.id}
                item={item}
                kindLabel={kindLabel(item.kind)}
                action={actionLabel(item.kind, t)}
                removeLabel={t.remove}
                onRemove={() => remove(item.kind, item.entityId)}
              />
            ))}
          </div>
        )}

        <DashboardFooter />
      </div>
    </>
  );
}
