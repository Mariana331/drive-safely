'use client';

import Button from '@/components/ui/Button/Button';
import { ShieldIcon } from '@/components/icons';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './CTABanner.module.css';

export default function CTABanner() {
  const dict = useDictionary();

  return (
    <section className={styles.section}>
      <div className={`container_beforeAuth ${styles.banner}`}>
        <div className={styles.mascot}>
          <ShieldIcon size={68} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{dict.cta.title}</h2>
          <p className={styles.text}>{dict.cta.text}</p>
          <Button
            variant="secondary"
            size="lg"
            href="/signup"
            className={styles.btn}
          >
            {dict.cta.button}
          </Button>
        </div>
      </div>
    </section>
  );
}
