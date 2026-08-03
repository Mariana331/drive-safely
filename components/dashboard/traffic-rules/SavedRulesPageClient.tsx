'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import { useUserProgress } from '@/lib/progress/useUserProgress';
import {
  TRAFFIC_RULES,
  loadSavedRuleIds,
  persistSavedRuleIds,
} from '@/lib/traffic-rules/trafficRulesData';
import RuleCard from './RuleCard';
import styles from './SavedRulesPage.module.css';

export default function SavedRulesPageClient() {
  const dict = useDictionary();
  const t = dict.trafficRules;
  const { progress, refresh } = useUserProgress();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSavedIds(loadSavedRuleIds());
  }, [progress.rulesStudied]);

  const savedRules = useMemo(() => {
    const rules = TRAFFIC_RULES.filter((r) => savedIds.includes(r.id));
    const q = search.trim().toLowerCase();
    if (!q) return rules;
    return rules.filter(
      (rule) =>
        rule.title.toLowerCase().includes(q) ||
        rule.summary.toLowerCase().includes(q) ||
        rule.code.toLowerCase().includes(q),
    );
  }, [savedIds, search]);

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

  const handleClearAll = () => {
    if (savedIds.length === 0) return;
    persistSavedRuleIds([]);
    setSavedIds([]);
    refresh();
  };

  return (
    <>
      <DashboardHeader title={t.savedPageTitle} subtitle={t.savedPageSubtitle} />

      <div className={styles.page}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden="true">
              🔍
            </span>
            <input
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
            />
          </div>

          <div className={styles.metaRow}>
            <p className={styles.count}>
              {t.savedCount.replace('{count}', String(savedIds.length))}
            </p>
            <div className={styles.actions}>
              {savedIds.length > 0 ? (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={handleClearAll}
                >
                  {t.clearAllSaved}
                </button>
              ) : null}
              <Link href="/traffic-rules" className={styles.browseLink}>
                {t.browseRules}
              </Link>
            </div>
          </div>
        </div>

        {savedIds.length === 0 ? (
          <section className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden="true">
              🔖
            </div>
            <h2 className={styles.emptyTitle}>{t.emptySavedTitle}</h2>
            <p className={styles.emptyText}>{t.emptySavedText}</p>
            <Link href="/traffic-rules" className={styles.primaryBtn}>
              {t.browseRules}
            </Link>
          </section>
        ) : savedRules.length === 0 ? (
          <section className={styles.empty}>
            <h2 className={styles.emptyTitle}>{t.noMatch}</h2>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setSearch('')}
            >
              {dict.common.resetFilters}
            </button>
          </section>
        ) : (
          <div className={styles.layout}>
            <div className={styles.ruleList}>
              {savedRules.map((rule) => (
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  saved
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>

            <aside className={styles.sidebar}>
              <section className={styles.widget}>
                <h2 className={styles.widgetTitle}>{t.needHelp}</h2>
                <p className={styles.widgetText}>{t.needHelpText}</p>
                <Link href="/assistant" className={styles.primaryBtn}>
                  {t.askAi}
                </Link>
              </section>
              <section className={styles.widget}>
                <h2 className={styles.widgetTitle}>{t.testTitle}</h2>
                <p className={styles.widgetText}>{t.testText}</p>
                <Link href="/tests" className={styles.secondaryBtn}>
                  {t.startTest}
                </Link>
              </section>
            </aside>
          </div>
        )}

        <DashboardFooter />
      </div>
    </>
  );
}
