'use client';

import Link from 'next/link';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import type {
  LearningProgress,
  TrafficRule,
} from '@/lib/traffic-rules/trafficRulesData';
import styles from './TrafficRulesSidebar.module.css';

interface TrafficRulesSidebarProps {
  savedRules: TrafficRule[];
  learningProgress: LearningProgress;
}

const METRIC_KEYS = [
  'watchedVideos',
  'readRules',
  'practiceTests',
  'savedRulesMetric',
] as const;

export default function TrafficRulesSidebar({
  savedRules,
  learningProgress,
}: TrafficRulesSidebarProps) {
  const dict = useDictionary();
  const t = dict.trafficRules;
  const { overallPercent, metrics } = learningProgress;

  return (
    <aside className={styles.sidebar}>
      <section className={styles.widget}>
        <div className={styles.widgetHeader}>
          <h2 className={styles.widgetTitle}>{t.mySavedRules}</h2>
          <Link href="/saved-rules" className={styles.viewAll}>
            {dict.common.viewAll}
          </Link>
        </div>
        <ul className={styles.savedList}>
          {savedRules.slice(0, 4).map((rule) => (
            <li key={rule.id} className={styles.savedItem}>
              <Link
                href={`/traffic-rules?rule=${rule.id}`}
                className={styles.savedLink}
              >
                <span className={styles.savedCode}>{rule.code}</span>
                <span className={styles.savedTitle}>{rule.title}</span>
              </Link>
            </li>
          ))}
          {savedRules.length === 0 && (
            <li className={styles.empty}>{t.noSaved}</li>
          )}
        </ul>
        <Link href="/saved-rules" className={styles.primaryBtn}>
          {t.goToSaved}
        </Link>
      </section>

      <section className={styles.widget}>
        <h2 className={styles.widgetTitle}>{t.learningProgress}</h2>
        <div className={styles.donutWrap}>
          <div
            className={styles.donut}
            style={{ '--score': overallPercent } as React.CSSProperties}
          >
            <span className={styles.donutValue}>{overallPercent}%</span>
          </div>
          <p className={styles.donutLabel}>{t.overallProgress}</p>
        </div>
        <ul className={styles.bars}>
          {metrics.map((item, index) => {
            const percent =
              item.total === 0
                ? 0
                : Math.round((item.current / item.total) * 100);
            const labelKey = METRIC_KEYS[index];
            return (
              <li key={labelKey ?? item.label} className={styles.barItem}>
                <div className={styles.barHeader}>
                  <span>{labelKey ? t[labelKey] : item.label}</span>
                  <span>
                    {item.current}/{item.total}
                  </span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`${styles.widget} ${styles.help}`}>
        <div className={styles.helpIcon}>💬</div>
        <h2 className={styles.widgetTitle}>{t.needHelp}</h2>
        <p className={styles.helpText}>{t.needHelpText}</p>
        <Link href="/assistant" className={styles.primaryBtn}>
          {t.askAi}
        </Link>
      </section>
    </aside>
  );
}
