'use client';

import Image from 'next/image';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import {
  OFFICIAL_SOURCE_RADA,
  PRIORITY_STYLES,
  type TrafficRule,
} from '@/lib/traffic-rules/trafficRulesData';
import styles from './RuleCard.module.css';

interface RuleCardProps {
  rule: TrafficRule;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

export default function RuleCard({
  rule,
  saved,
  onToggleSave,
}: RuleCardProps) {
  const dict = useDictionary();
  const t = dict.trafficRules;
  const priority = PRIORITY_STYLES[rule.priority];
  const priorityLabel =
    rule.priority === 'high'
      ? t.highPriority
      : rule.priority === 'medium'
        ? t.mediumPriority
        : t.lowPriority;

  return (
    <article className={styles.card}>
      <div className={styles.thumb}>
        <Image
          src={rule.imageUrl}
          alt=""
          fill
          className={styles.image}
          sizes="88px"
        />
      </div>

      <div className={styles.body}>
        <div className={styles.top}>
          <span className={styles.code}>{rule.code}</span>
          <button
            type="button"
            className={`${styles.bookmark} ${saved ? styles.bookmarkActive : ''}`}
            aria-label={saved ? t.unsaveRule : t.saveRule}
            aria-pressed={saved}
            onClick={() => onToggleSave(rule.id)}
          >
            {saved ? '🔖' : '📑'}
          </button>
        </div>

        <h3 className={styles.title}>{rule.title}</h3>
        <p className={styles.summary}>{rule.summary}</p>

        <div className={styles.footer}>
          <span
            className={styles.priority}
            style={{ background: priority.bg, color: priority.color }}
          >
            {priorityLabel}
          </span>
          <a
            href={OFFICIAL_SOURCE_RADA.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.source}
          >
            {dict.common.officialSource} ↗
          </a>
        </div>
      </div>
    </article>
  );
}
