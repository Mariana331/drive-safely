'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import RuleCard from './RuleCard';
import TrafficRulesSidebar from './TrafficRulesSidebar';
import {
  OFFICIAL_SOURCE_HSC,
  OFFICIAL_SOURCE_RADA,
  QUICK_LEARN,
  RULE_CATEGORIES,
  TRAFFIC_RULES,
  filterTrafficRules,
  getFeaturedRule,
  loadSavedRuleIds,
  persistSavedRuleIds,
  type RuleCategoryId,
} from '@/lib/traffic-rules/trafficRulesData';
import { useUserProgress } from '@/lib/progress/useUserProgress';
import styles from './TrafficRulesPage.module.css';

const INITIAL_VISIBLE = 5;

const CATEGORY_LABEL_KEY: Record<
  RuleCategoryId,
  | 'catAll'
  | 'catRoadSigns'
  | 'catPriority'
  | 'catSpeed'
  | 'catParking'
  | 'catManeuvers'
  | 'catLights'
> = {
  all: 'catAll',
  'road-signs': 'catRoadSigns',
  priority: 'catPriority',
  speed: 'catSpeed',
  parking: 'catParking',
  maneuvers: 'catManeuvers',
  lights: 'catLights',
};

const QUICK_LEARN_COPY: Record<
  (typeof QUICK_LEARN)[number]['id'],
  {
    label: 'watchVideos' | 'illustrations' | 'examples' | 'saveStudy';
    meta: 'videosMeta' | 'diagramsMeta' | 'casesMeta' | 'yourList';
  }
> = {
  videos: { label: 'watchVideos', meta: 'videosMeta' },
  illustrations: { label: 'illustrations', meta: 'diagramsMeta' },
  examples: { label: 'examples', meta: 'casesMeta' },
  save: { label: 'saveStudy', meta: 'yourList' },
};

export default function TrafficRulesPageClient() {
  const dict = useDictionary();
  const t = dict.trafficRules;
  const { progress, refresh } = useUserProgress();
  const searchParams = useSearchParams();
  const focusRuleId = searchParams.get('rule');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<RuleCategoryId>('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setSavedIds(loadSavedRuleIds());
  }, [progress.rulesStudied]);

  useEffect(() => {
    if (!focusRuleId) return;
    setCategory('all');
    setSearch('');
    setShowAll(true);
    const timer = window.setTimeout(() => {
      document
        .getElementById(`rule-${focusRuleId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [focusRuleId]);

  const filtered = useMemo(
    () => filterTrafficRules(TRAFFIC_RULES, { category, search }),
    [category, search],
  );

  const featured = useMemo(() => getFeaturedRule(TRAFFIC_RULES), []);
  const visibleRules = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const savedRules = TRAFFIC_RULES.filter((r) => savedIds.includes(r.id));

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      persistSavedRuleIds(next);
      queueMicrotask(() => refresh());
      return next;
    });
  };

  const handleCategoryChange = (next: RuleCategoryId) => {
    setCategory(next);
    setShowAll(false);
  };

  return (
    <>
      <DashboardHeader title={t.title} subtitle={t.subtitle} />

      <div className={styles.page}>
        <div className={styles.status} role="status">
          <span className={styles.statusDot} aria-hidden="true">
            🟢
          </span>
          <div>
            <p className={styles.statusTitle}>{t.statusMessage}</p>
            <p className={styles.statusMeta}>{t.lastChecked}</p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchRow}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon} aria-hidden="true">
                🔍
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowAll(false);
                }}
                placeholder={t.searchPlaceholder}
                className={styles.searchInput}
                aria-label={t.searchPlaceholder}
              />
            </div>

            <div className={styles.selectWrap}>
              <select
                className={styles.select}
                value={category}
                onChange={(e) =>
                  handleCategoryChange(e.target.value as RuleCategoryId)
                }
                aria-label={t.allCategories}
              >
                {RULE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {t[CATEGORY_LABEL_KEY[cat.id]]}
                  </option>
                ))}
              </select>
              <span className={styles.selectChevron} aria-hidden="true">
                ▾
              </span>
            </div>
          </div>

          <div className={styles.pills} role="tablist" aria-label={t.allCategories}>
            {RULE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={category === cat.id}
                className={`${styles.pill} ${
                  category === cat.id ? styles.pillActive : ''
                }`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                <span aria-hidden="true">{cat.icon}</span>
                {t[CATEGORY_LABEL_KEY[cat.id]]}
                <span className={styles.pillCount}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.mainColumn}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>{t.popularRules}</h2>
                <span className={styles.panelMeta}>
                  {t.shown.replace('{count}', String(filtered.length))}
                </span>
              </div>

              {visibleRules.length === 0 ? (
                <div className={styles.empty}>
                  <p>{t.noMatch}</p>
                  <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={() => {
                      setSearch('');
                      setCategory('all');
                    }}
                  >
                    {dict.common.resetFilters}
                  </button>
                </div>
              ) : (
                <div className={styles.ruleList}>
                  {visibleRules.map((rule) => (
                    <RuleCard
                      key={rule.id}
                      rule={rule}
                      saved={savedIds.includes(rule.id)}
                      focused={focusRuleId === rule.id}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              )}

              {filtered.length > INITIAL_VISIBLE && (
                <button
                  type="button"
                  className={styles.showMore}
                  onClick={() => setShowAll((v) => !v)}
                >
                  {showAll ? t.showFewerRules : t.showMoreRules}{' '}
                  <span aria-hidden="true">{showAll ? '▴' : '▾'}</span>
                </button>
              )}
            </section>

            <section className={styles.featured}>
              <div className={styles.featuredTop}>
                <div>
                  <p className={styles.featuredEyebrow}>{t.ruleOfTheDay}</p>
                  <p className={styles.featuredCode}>{featured.code}</p>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  <p className={styles.featuredSummary}>{featured.summary}</p>
                </div>
                <button type="button" className={styles.shareBtn}>
                  {dict.common.share}
                </button>
              </div>

              <div className={styles.featuredMedia}>
                <Image
                  src={featured.imageUrl}
                  alt=""
                  fill
                  className={styles.featuredImage}
                  sizes="(max-width: 900px) 100vw, 420px"
                />
              </div>

              {featured.tip && (
                <div className={styles.remember}>
                  <span className={styles.rememberMascot} aria-hidden="true">
                    🤖
                  </span>
                  <div>
                    <p className={styles.rememberLabel}>{t.remember}</p>
                    <p className={styles.rememberText}>{featured.tip}</p>
                  </div>
                </div>
              )}

              <a
                href={OFFICIAL_SOURCE_RADA.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                {dict.common.officialSource} ↗
              </a>
            </section>

            <section className={styles.quickLearn}>
              <h2 className={styles.panelTitle}>{t.quickLearn}</h2>
              <div className={styles.quickGrid}>
                {QUICK_LEARN.map((item) => {
                  const copy = QUICK_LEARN_COPY[item.id];
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={styles.quickCard}
                      style={{ background: item.color }}
                    >
                      <span className={styles.quickIcon} aria-hidden="true">
                        {item.icon}
                      </span>
                      <span className={styles.quickLabel}>{t[copy.label]}</span>
                      <span className={styles.quickMeta}>{t[copy.meta]}</span>
                    </Link>
                  );
                })}
              </div>
              <p className={styles.quickNote}>
                {t.quickNoteBefore}{' '}
                <a
                  href={OFFICIAL_SOURCE_HSC.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.quickNoteLink}
                </a>{' '}
                {t.quickNoteAfter}
              </p>
            </section>
          </div>

          <TrafficRulesSidebar
            savedRules={savedRules}
            learningProgress={progress.learningProgress}
          />
        </div>

        <div className={styles.banners}>
          <div className={`${styles.banner} ${styles.bannerTest}`}>
            <div>
              <p className={styles.bannerIcon} aria-hidden="true">
                🏆
              </p>
              <h3 className={styles.bannerTitle}>{t.testTitle}</h3>
              <p className={styles.bannerText}>{t.testText}</p>
            </div>
            <Link href="/tests" className={styles.bannerBtn}>
              {t.startTest}
            </Link>
          </div>

          <div className={`${styles.banner} ${styles.bannerNews}`}>
            <div>
              <p className={styles.bannerIcon} aria-hidden="true">
                📢
              </p>
              <h3 className={styles.bannerTitle}>{t.stayUpdated}</h3>
              <p className={styles.bannerText}>{t.stayUpdatedText}</p>
            </div>
            <Link href="/news" className={styles.bannerBtnSecondary}>
              {t.viewNews}
            </Link>
          </div>
        </div>

        <section className={styles.sources} aria-label={t.sourcesTitle}>
          <h2 className={styles.sourcesTitle}>{t.sourcesTitle}</h2>
          <div className={styles.sourcesGrid}>
            <article className={styles.sourceCard}>
              <p className={styles.sourceBadge}>{t.source1Badge}</p>
              <h3 className={styles.sourceCardTitle}>
                {OFFICIAL_SOURCE_RADA.title}
              </h3>
              <p className={styles.sourceCardText}>
                {OFFICIAL_SOURCE_RADA.description}
              </p>
              <a
                href={OFFICIAL_SOURCE_RADA.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                {t.openRada}
              </a>
            </article>
            <article className={styles.sourceCard}>
              <p className={styles.sourceBadge}>{t.source2Badge}</p>
              <h3 className={styles.sourceCardTitle}>
                {OFFICIAL_SOURCE_HSC.title}
              </h3>
              <p className={styles.sourceCardText}>
                {OFFICIAL_SOURCE_HSC.description}
              </p>
              <a
                href={OFFICIAL_SOURCE_HSC.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                {t.openHsc}
              </a>
            </article>
          </div>
        </section>

        <DashboardFooter />
      </div>
    </>
  );
}
