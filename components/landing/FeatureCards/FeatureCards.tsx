import Link from 'next/link';
import {
  AnalysisIcon,
  RulesIcon,
  AssistantIcon,
  TestsIcon,
} from '@/components/icons';
import styles from './FeatureCards.module.css';

const features = [
  {
    icon: <AnalysisIcon />,
    title: 'AI Analysis',
    description: 'Upload video and AI analyzes road situations.',
    href: '/ai-analysis',
    colorClass: styles.blue,
  },
  {
    icon: <RulesIcon />,
    title: 'Traffic Rules',
    description: 'Browse rules with simple explanations.',
    href: '/traffic-rules',
    colorClass: styles.green,
  },
  {
    icon: <AssistantIcon />,
    title: 'AI Assistant',
    description: 'Ask questions and get instant answers.',
    href: '/assistant',
    colorClass: styles.orange,
  },
  {
    icon: <TestsIcon />,
    title: 'Practice Tests',
    description: 'Test knowledge and track progress.',
    href: '/tests',
    colorClass: styles.purple,
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className={styles.section}>
      <div className={`container_beforeAuth ${styles.grid}`}>
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className={`${styles.card} ${feature.colorClass}`}
          >
            <div className={styles.iconWrap}>{feature.icon}</div>
            <h3 className={styles.title}>{feature.title}</h3>
            <p className={styles.description}>{feature.description}</p>
            <span className={styles.explore}>Explore →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
