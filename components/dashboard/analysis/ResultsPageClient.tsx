'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader/DashboardHeader';
import { useDictionary } from '@/lib/i18n/LocaleProvider';
import { useFavorites, useIsFavorite } from '@/lib/favorites/useFavorites';
import {
  buildDemoResult,
  formatAnalysisDate,
  type AnalysisResult,
  type ViolationSeverity,
} from '@/lib/analysis/analysisData';
import { getAnalysisSession } from '@/lib/analysis/analysisSession';
import {
  getAnalysisVideoBlob,
  parseTimeLabel,
} from '@/lib/analysis/analysisVideoStore';
import styles from './ResultsPage.module.css';

const severityClass: Record<ViolationSeverity, string> = {
  high: styles.high,
  medium: styles.medium,
  low: styles.low,
};

export default function ResultsPageClient() {
  const dict = useDictionary();
  const params = useParams<{ id: string }>();
  const { toggle } = useFavorites();
  const saved = useIsFavorite('analysis', params.id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoMissing, setVideoMissing] = useState(false);

  useEffect(() => {
    const session = getAnalysisSession(params.id);
    if (session?.result) {
      setResult(session.result);
      setActiveId(session.result.violations[0]?.id ?? null);
      return;
    }

    // Demo fallback for seeded recent items
    if (params.id.startsWith('demo-')) {
      const demo = buildDemoResult(params.id, 'City Center Drive');
      setResult(demo);
      setActiveId(demo.violations[0]?.id ?? null);
    }
  }, [params.id]);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    (async () => {
      const blob = await getAnalysisVideoBlob(params.id);
      if (cancelled) return;
      if (!blob) {
        setVideoMissing(true);
        setVideoUrl(null);
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      setVideoUrl(objectUrl);
      setVideoMissing(false);
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [params.id]);

  useEffect(() => {
    if (!result || !activeId || !videoRef.current) return;
    const active = result.violations.find((v) => v.id === activeId);
    if (!active) return;
    const seconds = parseTimeLabel(active.timeLabel);
    const video = videoRef.current;
    const seek = () => {
      try {
        video.currentTime = seconds;
      } catch {
        // ignore seek errors before metadata is ready
      }
    };
    if (video.readyState >= 1) seek();
    else video.addEventListener('loadedmetadata', seek, { once: true });
  }, [activeId, result, videoUrl]);

  if (!result) {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1>Result not found</h1>
          <p>Upload a video to generate an analysis result.</p>
          <Link href="/ai-analysis" className={styles.primaryBtn}>
            Upload Video
          </Link>
        </div>
      </div>
    );
  }

  const active = result.violations.find((v) => v.id === activeId) ?? result.violations[0];

  const handleFavorite = () => {
    toggle({
      kind: 'analysis',
      entityId: params.id,
      title: result.title,
      subtitle: `${result.violations.length} issues · risk ${result.riskScore.toFixed(1)}`,
      href: `/ai-analysis/results/${params.id}`,
      meta: formatAnalysisDate(result.createdAt),
    });
  };

  const handleDownloadReport = () => {
    const lines = [
      `DriveSafely Analysis Report`,
      `Title: ${result.title}`,
      `Date: ${formatAnalysisDate(result.createdAt)}`,
      `Risk score: ${result.riskScore.toFixed(1)}`,
      '',
      'Violations:',
      ...result.violations.map(
        (v) =>
          `- [${v.severity}] ${v.timeLabel} ${v.title}: ${v.description}`,
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '_')}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Analysis: ${result.title}`,
          text: `${result.violations.length} issues · risk ${result.riskScore.toFixed(1)}`,
          url: shareUrl,
        });
        return;
      }
    } catch {
      // fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore
    }
  };

  const selectViolation = (id: string) => {
    setActiveId(id);
    const item = result.violations.find((v) => v.id === id);
    if (!item || !videoRef.current) return;
    const seconds = parseTimeLabel(item.timeLabel);
    try {
      videoRef.current.currentTime = seconds;
      void videoRef.current.play();
    } catch {
      // ignore
    }
  };

  return (
    <>
      <DashboardHeader
        title="Analysis Result"
        subtitle={`${result.title} · ${formatAnalysisDate(result.createdAt)}`}
      />

      <div className={styles.page}>
        <div className={styles.topActions}>
          <button
            type="button"
            className={`${styles.ghostBtn} ${saved ? styles.favActive : ''}`}
            onClick={handleFavorite}
            aria-pressed={saved}
          >
            {saved ? `★ ${dict.favorites.added}` : `☆ ${dict.favorites.add}`}
          </button>
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={handleDownloadReport}
          >
            Download Report
          </button>
          <button type="button" className={styles.ghostBtn} onClick={handleShare}>
            Share
          </button>
        </div>

        <div className={styles.alert}>
          <strong>Possible Violations Found</strong>
          <span>{result.violations.length} issues detected in this clip</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.mainCol}>
            <section className={styles.playerCard}>
              <div className={styles.player}>
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    className={styles.video}
                    src={videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <div className={styles.playerFallback}>
                    <div className={styles.playerIcon}>▶️</div>
                    <p>
                      {videoMissing
                        ? 'Original video is unavailable for this session. Upload again to replay.'
                        : 'Loading video…'}
                    </p>
                    {videoMissing && (
                      <Link href="/ai-analysis" className={styles.primaryBtn}>
                        Upload Video
                      </Link>
                    )}
                  </div>
                )}
                {active && (
                  <div className={styles.overlayTag}>
                    {active.title} · {active.timeLabel}
                  </div>
                )}
                <div className={styles.timelineBar}>
                  {result.violations.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`${styles.marker} ${severityClass[v.severity]} ${
                        activeId === v.id ? styles.markerActive : ''
                      }`}
                      style={{
                        left: `${Math.min(
                          90,
                          10 + result.violations.indexOf(v) * 28,
                        )}%`,
                      }}
                      onClick={() => selectViolation(v.id)}
                      aria-label={v.title}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <h2>Timeline</h2>
              <ul className={styles.violationList}>
                {result.violations.map((v) => (
                  <li
                    key={v.id}
                    className={`${styles.violationItem} ${
                      activeId === v.id ? styles.violationActive : ''
                    }`}
                  >
                    <button
                      type="button"
                      className={styles.violationBtn}
                      onClick={() => selectViolation(v.id)}
                    >
                      <div className={styles.violationTop}>
                        <strong>{v.title}</strong>
                        <span className={`${styles.severity} ${severityClass[v.severity]}`}>
                          {v.severity}
                        </span>
                      </div>
                      <span className={styles.time}>{v.timeLabel}</span>
                      {v.note && <p className={styles.note}>{v.note}</p>}
                    </button>
                    {activeId === v.id && (
                      <div className={styles.explanation}>
                        <h3>Explanation</h3>
                        <p>{v.description}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className={styles.sideCol}>
            <section className={styles.riskCard}>
              <h2>Risk Score</h2>
              <div className={styles.riskValue}>{result.riskScore.toFixed(1)}</div>
              <p>Moderate risk — review the flagged moments below.</p>
            </section>

            <section className={styles.card}>
              <h2>Objects Detected</h2>
              <ul className={styles.objects}>
                {result.objects.map((obj) => (
                  <li key={obj.name}>
                    <span>
                      {obj.icon} {obj.name}
                    </span>
                    <strong>{obj.count}</strong>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.nextCard}>
              <h2>Next Steps</h2>
              <Link href="/tests" className={styles.primaryBtn}>
                Take Practice Test
              </Link>
              <Link href="/assistant" className={styles.secondaryBtn}>
                Ask AI Assistant
              </Link>
              <Link href="/favorites" className={styles.secondaryBtn}>
                {dict.sidebar.favorites}
              </Link>
            </section>

            <section className={styles.funFact}>
              <div className={styles.funFactIcon}>💡</div>
              <div className={styles.funFactBody}>
                <strong>Fun fact</strong>
                <p>
                  Checking mirrors every 5–8 seconds helps you spot risks before
                  they become emergencies.
                </p>
              </div>
              <Image
                src="/images/smarter/smarter.png"
                alt=""
                width={96}
                height={104}
                className={styles.funFactMascot}
              />
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
