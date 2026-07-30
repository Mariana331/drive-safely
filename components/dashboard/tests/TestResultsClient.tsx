'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  getPassThreshold,
  getTestSession,
  type TestSession,
} from '@/lib/tests/testSession';
import styles from './TestResults.module.css';

export default function TestResultsClient() {
  const params = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<TestSession | null>(null);

  useEffect(() => {
    setSession(getTestSession(params.sessionId));
  }, [params.sessionId]);

  if (!session || !session.completedAt) {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1>Results not found</h1>
          <p>This test has not been submitted yet.</p>
          <Link href="/tests" className={styles.primaryBtn}>
            Back to Practice Tests
          </Link>
        </div>
      </div>
    );
  }

  const passMark = getPassThreshold(session.mode);
  const passed = (session.score ?? 0) >= passMark;

  return (
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <p className={styles.mode}>{session.title}</p>
        <h1 className={styles.heading}>{passed ? 'Passed 🎉' : 'Keep practicing'}</h1>
        <div
          className={styles.scoreCircle}
          style={{ '--score': session.score ?? 0 } as React.CSSProperties}
        >
          <span>{session.score}%</span>
        </div>
        <p className={styles.summary}>
          You got <strong>{session.correctCount}</strong> of{' '}
          <strong>{session.questions.length}</strong> correct. Pass mark:{' '}
          {passMark}%.
        </p>
        <div className={styles.actions}>
          <Link href="/tests" className={styles.primaryBtn}>
            Back to Tests
          </Link>
          <Link href="/tests" className={styles.secondaryBtn}>
            Take another test
          </Link>
        </div>
      </div>

      <div className={styles.list}>
        {session.questions.map((question, i) => {
          const chosen = session.answers[question.id];
          const isCorrect = chosen === question.correctIndex;

          return (
            <article
              key={question.id}
              className={`${styles.item} ${isCorrect ? styles.correct : styles.wrong}`}
            >
              <div className={styles.itemHeader}>
                <span>
                  Q{i + 1}. {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              <p className={styles.itemQuestion}>{question.text}</p>
              <p className={styles.itemAnswer}>
                Your answer:{' '}
                {chosen === null || chosen === undefined
                  ? 'Not answered'
                  : question.options[chosen]}
              </p>
              {!isCorrect && (
                <p className={styles.itemAnswer}>
                  Correct: {question.options[question.correctIndex]}
                </p>
              )}
              <p className={styles.explanation}>{question.explanation}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
