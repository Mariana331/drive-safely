'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './AuthPromoPanel.module.css';

const AUTH_BG_LOCAL = '/images/auth-registration-bg.jpg';
const AUTH_BG_FALLBACK =
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=85';

export default function AuthPromoBackground() {
  const [src, setSrc] = useState(AUTH_BG_LOCAL);

  return (
    <div className={styles.bgWrap} aria-hidden="true">
      <Image
        src={src}
        alt=""
        fill
        priority
        className={styles.bgImage}
        sizes="(max-width: 1023px) 100vw, 50vw"
        onError={() => {
          if (src !== AUTH_BG_FALLBACK) {
            setSrc(AUTH_BG_FALLBACK);
          }
        }}
      />
    </div>
  );
}
