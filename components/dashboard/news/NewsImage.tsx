'use client';

import { useState } from 'react';
import Image from 'next/image';

interface NewsImageProps {
  src: string;
  alt?: string;
  className?: string;
  sizes?: string;
  /** When true, fills the positioned parent (same as next/image fill). */
  fill?: boolean;
  priority?: boolean;
}

const FALLBACK =
  'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80';

function isTrustedOptimizerHost(src: string) {
  try {
    const host = new URL(src).hostname;
    return host === 'images.unsplash.com';
  } catch {
    return false;
  }
}

/** Renders news covers from Unsplash via next/image, other hosts via <img>. */
export default function NewsImage({
  src,
  alt = '',
  className,
  sizes,
  fill,
  priority,
}: NewsImageProps) {
  const [current, setCurrent] = useState(src);

  if (isTrustedOptimizerHost(current)) {
    return (
      <Image
        src={current}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => {
          if (current !== FALLBACK) setCurrent(FALLBACK);
        }}
      />
    );
  }

  return (
    // External RSS hosts vary widely; native img avoids next/image allowlist gaps.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (current !== FALLBACK) setCurrent(FALLBACK);
      }}
      style={
        fill
          ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }
          : undefined
      }
    />
  );
}
