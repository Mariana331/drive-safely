'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button/Button';
import { UploadIcon, PlayIcon } from '@/components/icons';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './Hero.module.css';

const AVATARS = [
  '/images/people/images.jpg',
  '/images/people/images (1).jpg',
  '/images/people/images (2).jpg',
  '/images/people/images (3).jpg',
];

export default function Hero() {
  const dict = useDictionary();
  const h = dict.hero;

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.heroBg}>
        <Image
          src="/images/Hero/hero.png"
          alt={h.imageAlt}
          fill
          priority
          className={styles.heroImage}
          sizes="100vw"
        />
        <div className={styles.mascot} aria-hidden="true">
          <Image
            src="/images/smarter/minismarter.png"
            alt=""
            width={200}
            height={220}
            priority
            className={styles.mascotImage}
          />
        </div>
      </div>

      <div className={`container_beforeAuth ${styles.inner}`}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🛡️</span>
            <span>{h.badge}</span>
            <span className={styles.badgeStar}>★</span>
          </div>

          <h1 className={styles.title}>
            {h.titleLine1Before}{' '}
            <span className={styles.accentBlue}>{h.titleLine1Accent}</span>
            <br />
            {h.titleLine2Before}{' '}
            <span className={styles.accentGreen}>{h.titleLine2Accent}</span>
          </h1>
          <p className={styles.subtitle}>{h.subtitle}</p>
          <div className={styles.ctas}>
            <Button variant="primary" size="lg" href="/ai-analysis">
              <UploadIcon />
              {h.uploadVideo}
            </Button>
            <Button variant="secondary" size="lg" href="#how-it-works">
              <PlayIcon />
              {h.learnMore}
            </Button>
          </div>
          <div className={styles.socialProof}>
            <div className={styles.avatars} aria-hidden="true">
              {AVATARS.map((src, index) => (
                <span
                  key={src}
                  className={styles.avatar}
                  style={{ zIndex: index + 1 }}
                >
                  <Image
                    src={src}
                    alt=""
                    width={40}
                    height={40}
                    className={styles.avatarImage}
                  />
                </span>
              ))}
            </div>
            <p className={styles.proofText}>{h.proofText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
