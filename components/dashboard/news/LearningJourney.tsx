'use client';

import Link from 'next/link';
import type { NewsRelatedLink } from '@/lib/api/api';
import styles from './LearningJourney.module.css';

interface LearningJourneyProps {
  title: string;
  subtitle?: string;
  steps: NewsRelatedLink[];
  variant?: 'news' | 'video';
}

export default function LearningJourney({
  title,
  subtitle,
  steps,
  variant = 'news',
}: LearningJourneyProps) {
  return (
    <section className={`${styles.wrap} ${styles[variant]}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.href + step.label} className={styles.step}>
            <span className={styles.index}>{index + 1}</span>
            <Link href={step.href} className={styles.link}>
              {step.label}
            </Link>
            {index < steps.length - 1 ? (
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
