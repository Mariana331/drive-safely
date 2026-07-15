import Link from 'next/link';
import { ShieldIcon } from '@/components/icons';
import styles from './AuthPromoPanel.module.css';

const features = [
  {
    icon: '🎥',
    title: 'AI Video Analysis',
    description: 'Get instant feedback on your driving.',
    color: styles.purple,
  },
  {
    icon: '📚',
    title: 'Learn & Practice',
    description: 'Master traffic rules and pass tests.',
    color: styles.green,
  },
  {
    icon: '📊',
    title: 'Track Progress',
    description: 'Monitor your skills and improve daily.',
    color: styles.orange,
  },
  {
    icon: '🏆',
    title: 'Earn Achievements',
    description: 'Unlock badges and reach new levels.',
    color: styles.blue,
  },
];

export default function AuthPromoPanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <Link href="/" className={styles.logo}>
          <ShieldIcon size={32} />
          <div>
            <span className={styles.brand}>DriveSafely</span>
            <span className={styles.tagline}>Drive smarter. Stay safer.</span>
          </div>
        </Link>

        <div className={styles.hero}>
          <h1 className={styles.heading}>Join DriveSafely</h1>
          <p className={styles.subheading}>
            Start your journey to becoming a safer and smarter driver.
          </p>
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
            <p className={styles.quote}>
              &ldquo;DriveSafely helped me understand my mistakes and become a
              more confident driver.&rdquo;
            </p>
            <span className={styles.author}>Sarah K.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
