import { CloudIcon, BrainIcon, DocumentIcon, TrophyIcon } from '@/components/icons';
import styles from './HowItWorks.module.css';

const steps = [
  {
    icon: <CloudIcon />,
    title: 'Upload',
    description:
      'Upload a video of a road situation from your dashcam or phone.',
  },
  {
    icon: <BrainIcon />,
    title: 'AI Analysis',
    description:
      'Our AI analyzes the video and detects objects, and possible violations.',
  },
  {
    icon: <DocumentIcon />,
    title: 'Read Explanation',
    description:
      'Get a clear explanation with traffic rules and helpful recommendations.',
  },
  {
    icon: <TrophyIcon />,
    title: 'Become Better Driver',
    description:
      'Learn from every situation and improve your driving skills every day.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className="container_beforeAuth">
        <h2 className={styles.heading}>How DriveSafely Works</h2>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.title} className={styles.step}>
              <div className={styles.stepInner}>
                <div className={styles.iconWrap}>{step.icon}</div>
                <div className={styles.stepNumber}>{index + 1}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.connector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
