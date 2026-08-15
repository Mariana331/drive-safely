import Link from 'next/link';
import styles from './InfoPage.module.css';

interface InfoPageProps {
  title: string;
  paragraphs: string[];
  ctaHref?: string;
  ctaLabel?: string;
}

export default function InfoPage({
  title,
  paragraphs,
  ctaHref = '/',
  ctaLabel = '← Back to home',
}: InfoPageProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1>{title}</h1>
        {paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
        <Link href={ctaHref} className={styles.back}>
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
