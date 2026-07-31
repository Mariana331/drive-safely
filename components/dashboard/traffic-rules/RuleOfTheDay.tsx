'use client';

import Image from 'next/image';
import {
  OFFICIAL_SOURCE_RADA,
  type TrafficRule,
} from '@/lib/traffic-rules/trafficRulesData';
import styles from './RuleOfTheDay.module.css';

interface RuleOfTheDayProps {
  rule: TrafficRule;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

export default function RuleOfTheDay({
  rule,
  saved,
  onToggleSave,
}: RuleOfTheDayProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Rule of the Day</p>
          <h2 className={styles.title}>
            <span className={styles.code}>{rule.code}</span> {rule.title}
          </h2>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.share} aria-label="Share">
            Share
          </button>
          <button
            type="button"
            className={styles.bookmark}
            aria-label={saved ? 'Unsave' : 'Save'}
            onClick={() => onToggleSave(rule.id)}
          >
            {saved ? '🔖' : '📑'}
          </button>
        </div>
      </div>

      <div className={styles.media}>
        <Image
          src={rule.imageUrl}
          alt=""
          fill
          className={styles.image}
          sizes="(max-width: 1199px) 100vw, 360px"
          priority
        />
      </div>

      <p className={styles.summary}>{rule.summary}</p>

      {rule.tip && (
        <div className={styles.tip}>
          <span className={styles.tipIcon} aria-hidden="true">
            🤖
          </span>
          <div>
            <p className={styles.tipLabel}>Remember!</p>
            <p className={styles.tipText}>{rule.tip}</p>
          </div>
        </div>
      )}

      <a
        href={OFFICIAL_SOURCE_RADA.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.source}
      >
        {OFFICIAL_SOURCE_RADA.label} ↗
      </a>
    </section>
  );
}
