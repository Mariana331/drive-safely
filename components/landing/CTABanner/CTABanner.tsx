import Button from '@/components/ui/Button/Button';
import DriveyMascot from '@/components/illustrations/DriveyMascot';
import styles from './CTABanner.module.css';

export default function CTABanner() {
  return (
    <section className={styles.section}>
      <div className={`container_beforeAuth ${styles.banner}`}>
        <div className={styles.mascot}>
          <DriveyMascot size="lg" />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>Ready to drive more safely?</h2>
          <p className={styles.text}>
            Join thousands of drivers who are learning and making our roads safer
            together.
          </p>
          <Button variant="secondary" size="lg" href="/signup" className={styles.btn}>
            Get Started Free →
          </Button>
        </div>
      </div>
    </section>
  );
}
