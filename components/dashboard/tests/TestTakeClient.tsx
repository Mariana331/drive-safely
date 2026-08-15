'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  answerQuestion,
  getTestSession,
  saveTestSession,
  submitTestSession,
  type TestSession,
} from '@/lib/tests/testSession';
import styles from './TestTake.module.css';

export default function TestTakeClient() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const sessionId = params.sessionId;

  const [session, setSession] = useState<TestSession | null>(null);
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const found = getTestSession(sessionId);
    if (!found) {
      setError('Test session not found. Start a new test from Practice Tests.');
      return;
    }
    if (found.completedAt) {
      router.replace(`/tests/results/${found.id}`);
      return;
    }
    setSession(found);
    setIndex(found.currentIndex);
    setSecondsLeft(found.timeLimitSeconds);
  }, [sessionId, router]);

  useEffect(() => {
    if (secondsLeft === null || !session || session.completedAt) return;
    if (secondsLeft <= 0) {
      const submitted = submitTestSession(session.id);
      if (submitted) router.replace(`/tests/results/${submitted.id}`);
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((prev) => (prev === null ? null : prev - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft, session, router]);

  const question = session?.questions[index];
  const answeredCount = useMemo(() => {
    if (!session) return 0;
    return Object.values(session.answers).filter((v) => v !== null).length;
  }, [session]);

  if (error) {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <h1>Test unavailable</h1>
          <p>{error}</p>
          <Link href="/tests" className={styles.primaryBtn}>
            Back to Practice Tests
          </Link>
        </div>
      </div>
    );
  }

  if (!session || !question) {
    return (
      <div className={styles.wrap}>
        <div className={styles.card}>
          <p>Loading test...</p>
        </div>
      </div>
    );
  }

  const selected = session.answers[question.id];
  const isCorrect = selected !== null && selected === question.correctIndex;
  const progress = Math.round(((index + 1) / session.questions.length) * 100);

  const onSelect = (answerIndex: number) => {
    const updated = answerQuestion(session.id, question.id, answerIndex);
    if (updated) setSession({ ...updated });
  };

  const goNext = () => {
    if (index >= session.questions.length - 1) return;
    const next = index + 1;
    setIndex(next);
    const updated = { ...session, currentIndex: next };
    setSession(updated);
    saveTestSession(updated);
  };

  const goPrev = () => {
    if (index <= 0) return;
    const prev = index - 1;
    setIndex(prev);
    const updated = { ...session, currentIndex: prev };
    setSession(updated);
    saveTestSession(updated);
  };

  const onSubmit = () => {
    if (answeredCount < session.questions.length) {
      const ok = window.confirm(
        `You answered ${answeredCount}/${session.questions.length} questions. Submit anyway?`,
      );
      if (!ok) return;
    }
    const submitted = submitTestSession(session.id);
    if (submitted) router.push(`/tests/results/${submitted.id}`);
  };

  const minutes = secondsLeft === null ? null : Math.floor(secondsLeft / 60);
  const seconds = secondsLeft === null ? null : secondsLeft % 60;

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <div>
          <p className={styles.mode}>{session.title}</p>
          <h1 className={styles.heading}>
            Question {index + 1} of {session.questions.length}
          </h1>
        </div>
        {minutes !== null && seconds !== null && (
          <div className={styles.timer}>
            ⏱ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        )}
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.card}>
        <p className={styles.question}>{question.text}</p>
        <div className={styles.options}>
          {question.options.map((option, optionIndex) => {
            const showReveal = selected !== null;
            const isRight = optionIndex === question.correctIndex;
            const isChosen = selected === optionIndex;
            return (
              <button
                key={option}
                type="button"
                className={`${styles.option} ${
                  isChosen ? styles.optionSelected : ''
                } ${
                  showReveal && isRight
                    ? styles.optionCorrect
                    : showReveal && isChosen && !isRight
                      ? styles.optionWrong
                      : ''
                }`}
                onClick={() => onSelect(optionIndex)}
              >
                <span className={styles.optionLetter}>
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div
            className={`${styles.feedback} ${
              isCorrect ? styles.feedbackCorrect : styles.feedbackWrong
            }`}
          >
            <div className={styles.feedbackBody}>
              <strong>{isCorrect ? 'Correct!' : 'Not quite'}</strong>
              <p>
                {isCorrect
                  ? question.explanation ||
                    'Nice work — that matches the traffic rule.'
                  : `Right answer: ${question.options[question.correctIndex]}${
                      question.explanation ? ` — ${question.explanation}` : ''
                    }`}
              </p>
            </div>
            <Image
              src="/images/smarter/minismarter.png"
              alt=""
              width={88}
              height={96}
              className={styles.feedbackMascot}
            />
          </div>
        )}

        <div className={styles.nav}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={goPrev}
            disabled={index === 0}
          >
            Previous
          </button>

          {index < session.questions.length - 1 ? (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={goNext}
              disabled={selected === null}
            >
              Next
            </button>
          ) : (
            <button type="button" className={styles.primaryBtn} onClick={onSubmit}>
              Submit Test
            </button>
          )}
        </div>
      </div>

      <p className={styles.meta}>
        Answered {answeredCount}/{session.questions.length}
      </p>
    </div>
  );
}
