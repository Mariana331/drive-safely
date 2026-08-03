'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

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
          <button type="button" className={styles.ghostBtn}>
            Download Report
          </button>
          <button type="button" className={styles.ghostBtn}>
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
                <div className={styles.playerIcon}>▶️</div>
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
                      onClick={() => setActiveId(v.id)}
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
                      onClick={() => setActiveId(v.id)}
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
          </aside>
        </div>
      </div>
    </>
  );
}
