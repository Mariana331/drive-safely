'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import { PROCESSING_STEPS, buildDemoResult } from '@/lib/analysis/analysisData';
import {
  completeAnalysisSession,
  getAnalysisSession,
  saveAnalysisSession,
  type AnalysisSession,
} from '@/lib/analysis/analysisSession';
import styles from './ProcessingPage.module.css';

export default function ProcessingPageClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [progress, setProgress] = useState(8);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const found = getAnalysisSession(params.id);
    if (!found) {
      // Allow opening demo ids from fallback recent list
      if (params.id.startsWith('demo-')) {
        setMissing(false);
        setSession({
          id: params.id,
          title: 'Demo Analysis',
          fileName: 'demo.mp4',
          fileSize: 0,
          createdAt: new Date().toISOString(),
          status: 'processing',
          progress: 8,
        });
        return;
      }
      setMissing(true);
      return;
    }

    if (found.status === 'analyzed') {
      router.replace(`/ai-analysis/results/${found.id}`);
      return;
    }

    setSession(found);
    setProgress(Math.max(found.progress, 8));
  }, [params.id, router]);

  useEffect(() => {
    if (!session || missing) return;

    if (progress >= 100) {
      const timer = window.setTimeout(() => {
        if (session.id.startsWith('demo-')) {
          const demoSession = {
            ...session,
            status: 'analyzed' as const,
            progress: 100,
            result: buildDemoResult(session.id, session.title),
          };
          saveAnalysisSession(demoSession);
          router.push(`/ai-analysis/results/${session.id}`);
          return;
        }

        const completed = completeAnalysisSession(session.id);
        if (completed) router.push(`/ai-analysis/results/${completed.id}`);
      }, 600);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.floor(Math.random() * 9) + 4, 100);
        if (!session.id.startsWith('demo-')) {
          const current = getAnalysisSession(session.id);
          if (current) {
            current.progress = next;
            saveAnalysisSession(current);
          }
        }
        return next;
      });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [progress, session, missing, router]);

  if (missing) {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1>Analysis not found</h1>
          <p>Start a new upload from the Upload Video page.</p>
          <Link href="/ai-analysis" className={styles.primaryBtn}>
            Back to Upload
          </Link>
        </div>
      </div>
    );
  }

  const activeStep = Math.min(
    Math.floor((progress / 100) * PROCESSING_STEPS.length),
    PROCESSING_STEPS.length - 1,
  );

  return (
    <>
      <DashboardHeader
        title="AI Analysis"
        subtitle="Please don't close this page while we analyze your video."
      />

      <div className={styles.page}>
        <div className={styles.grid}>
          <section className={styles.card}>
            <div className={styles.progressWrap}>
              <div
                className={styles.ring}
                style={{ '--progress': progress } as React.CSSProperties}
              >
                <span>{progress}%</span>
              </div>
              <p className={styles.progressLabel}>Analyzing your driving video…</p>
            </div>

            <div className={styles.preview}>
              <div className={styles.previewFrame}>
                <span className={styles.box} style={{ top: '28%', left: '18%' }}>
                  car
                </span>
                <span className={styles.box} style={{ top: '42%', left: '55%' }}>
                  sign
                </span>
                <span className={styles.box} style={{ top: '58%', left: '40%' }}>
                  lane
                </span>
                <div className={styles.previewIcon}>🎥</div>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2>Analysis Steps</h2>
            <ul className={styles.steps}>
              {PROCESSING_STEPS.map((step, index) => {
                const done = index < activeStep;
                const current = index === activeStep && progress < 100;
                return (
                  <li
                    key={step.id}
                    className={`${styles.step} ${done ? styles.done : ''} ${
                      current ? styles.current : ''
                    }`}
                  >
                    <span className={styles.stepIcon}>
                      {done ? '✓' : current ? '…' : '○'}
                    </span>
                    <span>{step.label}</span>
                  </li>
                );
              })}
            </ul>

            <div className={styles.tip}>
              <strong>Safety tip</strong>
              <p>
                Keep both hands on the wheel and scan intersections early — AI
                feedback works best when the road ahead is clearly visible.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
