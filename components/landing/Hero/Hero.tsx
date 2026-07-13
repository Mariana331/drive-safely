import Button from '@/components/ui/Button/Button';
import { UploadIcon, PlayIcon } from '@/components/icons';
import HeroIllustration from '@/components/illustrations/HeroIllustration';
import styles from './Hero.module.css';

const avatars = ['#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6'];

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={`container_beforeAuth ${styles.inner}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Drive <span className={styles.accentBlue}>smarter.</span>
            <br />
            Stay <span className={styles.accentGreen}>safer.</span>
          </h1>
          <p className={styles.subtitle}>
            Upload a road video and get AI analysis, learn the rules and become a
            better driver every day.
          </p>
          <div className={styles.ctas}>
            <Button variant="primary" size="lg" href="/ai-analysis">
              <UploadIcon />
              Upload Video
            </Button>
            <Button variant="secondary" size="lg" href="#how-it-works">
              <PlayIcon />
              Learn More
            </Button>
          </div>
          <div className={styles.socialProof}>
            <div className={styles.avatars}>
              {avatars.map((color, i) => (
                <span
                  key={i}
                  className={styles.avatar}
                  style={{ background: color }}
                />
              ))}
            </div>
            <p className={styles.proofText}>
              Join <strong>25,000+</strong> drivers making roads safer.
            </p>
          </div>
        </div>
        <div className={styles.illustration}>
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
