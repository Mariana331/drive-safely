'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter/DashboardFooter';
import LearningJourney from '@/components/dashboard/news/LearningJourney';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import { VIDEO_LEARNING_JOURNEY } from '@/lib/news/journey';
import {
  ANALYSIS_TIPS,
  FALLBACK_RECENT,
  STATUS_LABEL,
  type RecentUpload,
} from '@/lib/analysis/analysisData';
import {
  ACCEPTED_TYPES,
  MAX_UPLOAD_BYTES,
  createAnalysisSession,
  getRecentUploads,
} from '@/lib/analysis/analysisSession';
import styles from './UploadVideoPage.module.css';

export default function UploadVideoPageClient() {
  const dict = useDictionary();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState<RecentUpload[]>(FALLBACK_RECENT);

  useEffect(() => {
    setRecent(getRecentUploads(FALLBACK_RECENT));
  }, []);

  const handleFile = (file: File | undefined) => {
    setError('');
    if (!file) return;

    const isVideo =
      ACCEPTED_TYPES.includes(file.type) ||
      /\.(mp4|mov|avi)$/i.test(file.name);

    if (!isVideo) {
      setError('Please upload MP4, MOV, or AVI video files.');
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError('File is too large. Maximum size is 500MB.');
      return;
    }

    const session = createAnalysisSession(file);
    router.push(`/ai-analysis/processing/${session.id}`);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <>
      <DashboardHeader
        title={dict.sidebar.uploadVideo}
        subtitle={dict.dashboard.aiSubtitle}
      />

      <div className={styles.page}>
        <LearningJourney
          variant="video"
          title="Learning path from Video"
          subtitle="VIDEO → AI Analysis → Traffic Rules → Practice Test"
          steps={VIDEO_LEARNING_JOURNEY}
        />
        <div className={styles.content}>
          <div className={styles.main}>
            <section
              className={`${styles.uploadCard} ${dragging ? styles.dragging : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <div className={styles.uploadInner}>
                <div className={styles.uploadCopy}>
                  <div className={styles.cloud}>☁️</div>
                  <h2>Drag & drop your video here</h2>
                  <p>MP4, MOV, AVI up to 500MB</p>
                  <button
                    type="button"
                    className={styles.browseBtn}
                    onClick={() => inputRef.current?.click()}
                  >
                    Browse Files
                  </button>
                  {error && <p className={styles.error}>{error}</p>}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/x-msvideo,.mp4,.mov,.avi"
                    className={styles.hiddenInput}
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>
                <div className={styles.uploadArt} aria-hidden="true">
                  <div className={styles.artCar}>🚗</div>
                  <div className={styles.artMascot}>🛡️</div>
                  <p>Drive smarter with AI feedback</p>
                </div>
              </div>
            </section>

            <section className={styles.recentCard}>
              <div className={styles.recentHeader}>
                <h3>Recent Uploads</h3>
              </div>
              <ul className={styles.recentList}>
                {recent.map((item) => (
                  <li key={item.id} className={styles.recentItem}>
                    <div className={styles.thumb}>{item.thumbnail}</div>
                    <div className={styles.recentMeta}>
                      <strong>{item.title}</strong>
                      <span>{item.date}</span>
                    </div>
                    <span className={`${styles.status} ${styles[item.status]}`}>
                      {STATUS_LABEL[item.status]}
                    </span>
                    {item.status === 'analyzed' ? (
                      <Link
                        href={`/ai-analysis/results/${item.id}`}
                        className={styles.viewLink}
                      >
                        View
                      </Link>
                    ) : item.status === 'processing' ? (
                      <Link
                        href={`/ai-analysis/processing/${item.id}`}
                        className={styles.viewLink}
                      >
                        Open
                      </Link>
                    ) : (
                      <span className={styles.viewMuted}>—</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <DashboardFooter />
          </div>

          <aside className={styles.sidebar}>
            <section className={styles.tipsCard}>
              <h3>Tips for Better Analysis</h3>
              <ul className={styles.tipsList}>
                {ANALYSIS_TIPS.map((tip) => (
                  <li key={tip.title}>
                    <span className={styles.tipIcon}>{tip.icon}</span>
                    <div>
                      <strong>{tip.title}</strong>
                      <p>{tip.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.assistantCard}>
              <div className={styles.assistantIcon}>🤖</div>
              <h3>AI Assistant</h3>
              <p>Ask questions about road rules while your video is analyzed.</p>
              <Link href="/assistant" className={styles.chatBtn}>
                Chat now
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
