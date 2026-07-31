'use client';

import { CloudIcon, BrainIcon, DocumentIcon, TrophyIcon } from '@/components/icons';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  const dict = useDictionary();
  const h = dict.howItWorks;

  const steps = [
    {
      icon: <CloudIcon />,
      title: h.step1Title,
      description: h.step1Desc,
    },
    {
      icon: <BrainIcon />,
      title: h.step2Title,
      description: h.step2Desc,
    },
    {
      icon: <DocumentIcon />,
      title: h.step3Title,
      description: h.step3Desc,
    },
    {
      icon: <TrophyIcon />,
      title: h.step4Title,
      description: h.step4Desc,
    },
  ];

  return (
    <section id="how-it-works" className={styles.section}>
      <div className="container_beforeAuth">
        <h2 className={styles.heading}>{h.heading}</h2>
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
