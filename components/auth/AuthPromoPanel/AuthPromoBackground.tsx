'use client';

import Image from 'next/image';
import styles from './AuthPromoPanel.module.css';

export default function AuthPromoBackground() {
  return (
    <div className={styles.bgWrap} aria-hidden="true">
      <Image
        src="/images/register/register.png"
        alt=""
        fill
        priority
        className={styles.bgImage}
        sizes="(max-width: 1023px) 100vw, 50vw"
      />
    </div>
  );
}
