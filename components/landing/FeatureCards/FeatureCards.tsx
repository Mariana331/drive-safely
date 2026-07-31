'use client';

import Link from 'next/link';
import {
  AnalysisIcon,
  RulesIcon,
  AssistantIcon,
  TestsIcon,
} from '@/components/icons';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './FeatureCards.module.css';

export default function FeatureCards() {
  const dict = useDictionary();
  const f = dict.features;

  const features = [
    {
      icon: <AnalysisIcon />,
      title: f.aiAnalysisTitle,
      description: f.aiAnalysisDesc,
      href: '/ai-analysis',
      colorClass: styles.blue,
    },
    {
      icon: <RulesIcon />,
      title: f.trafficRulesTitle,
      description: f.trafficRulesDesc,
      href: '/traffic-rules',
      colorClass: styles.green,
    },
    {
      icon: <AssistantIcon />,
      title: f.assistantTitle,
      description: f.assistantDesc,
      href: '/assistant',
      colorClass: styles.orange,
    },
    {
      icon: <TestsIcon />,
      title: f.testsTitle,
      description: f.testsDesc,
      href: '/tests',
      colorClass: styles.purple,
    },
  ];

  return (
    <section id="features" className={styles.section}>
      <div className={`container_beforeAuth ${styles.grid}`}>
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className={`${styles.card} ${feature.colorClass}`}
          >
            <div className={styles.iconWrap}>{feature.icon}</div>
            <h3 className={styles.title}>{feature.title}</h3>
            <p className={styles.description}>{feature.description}</p>
            <span className={styles.explore}>{dict.common.explore}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
