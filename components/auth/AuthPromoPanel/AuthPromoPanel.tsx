'use client';

import Link from 'next/link';
import { ShieldIcon } from '@/components/icons';
import AuthPromoBackground from './AuthPromoBackground';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './AuthPromoPanel.module.css';

export default function AuthPromoPanel() {
  const dict = useDictionary();
  const a = dict.auth;

  const features = [
    {
      icon: '🎥',
      title: a.feature1Title,
      description: a.feature1Desc,
      color: styles.purple,
    },
    {
      icon: '📚',
      title: a.feature2Title,
      description: a.feature2Desc,
      color: styles.green,
    },
    {
      icon: '📊',
      title: a.feature3Title,
      description: a.feature3Desc,
      color: styles.orange,
    },
    {
      icon: '🏆',
      title: a.feature4Title,
      description: a.feature4Desc,
      color: styles.blue,
    },
  ];

  return (
    <div className={styles.panel}>
      <AuthPromoBackground />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.logo}>
            <ShieldIcon size={32} />
            <div>
              <span className={styles.brand}>
                <span className={styles.brandDrive}>Drive</span>
                <span className={styles.brandSafely}>Safely</span>
              </span>
              <span className={styles.tagline}>{a.tagline}</span>
            </div>
          </Link>
          <LanguageSwitcher variant="auth" />
        </div>

        <div className={styles.hero}>
          <h1 className={styles.heading}>{a.joinTitle}</h1>
          <p className={styles.subheading}>{a.joinSubtitle}</p>
        </div>

        <ul className={styles.features}>
          {features.map((f) => (
            <li key={f.title} className={`${styles.featureCard} ${f.color}`}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.testimonial}>
          <div className={styles.avatar}>SK</div>
          <div>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.quote}>&ldquo;{a.quote}&rdquo;</p>
            <span className={styles.author}>- Sarah K.</span>
            <div className={styles.pagination} aria-hidden="true">
              <span className={`${styles.dot} ${styles.dotActive}`} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
