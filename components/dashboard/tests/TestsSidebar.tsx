import type { TestsStats } from '@/lib/tests/testsData';
import styles from './TestsSidebar.module.css';

interface TestsSidebarProps {
  stats: TestsStats;
}

export default function TestsSidebar({ stats }: TestsSidebarProps) {
  const goalPercent = Math.round(
    (stats.dailyGoal.current / stats.dailyGoal.target) * 100,
  );
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <aside className={styles.sidebar}>
      <section className={styles.widget}>
        <h2 className={styles.widgetTitle}>Your Progress</h2>
        <div className={styles.donutWrap}>
          <div
            className={styles.donut}
            style={
              {
                '--score': stats.overallScore,
              } as React.CSSProperties
            }
          >
            <span className={styles.donutValue}>{stats.overallScore}%</span>
          </div>
          <p className={styles.donutLabel}>Overall Score</p>
        </div>
        <ul className={styles.statList}>
          <li>
            <span>Tests Completed</span>
            <strong>
              {stats.testsCompleted}/{stats.totalTests}
            </strong>
          </li>
          <li>
            <span>Correct Answers</span>
            <strong>
              {stats.correctAnswers}/{stats.totalAnswers}
            </strong>
          </li>
          <li>
            <span>Average Score</span>
            <strong>{stats.averageScore}%</strong>
          </li>
          <li>
            <span>Best Score</span>
            <strong>{stats.bestScore}%</strong>
          </li>
        </ul>
      </section>

      <section className={styles.widget}>
        <h2 className={styles.widgetTitle}>Performance by Category</h2>
        <ul className={styles.bars}>
          {stats.categoryPerformance.map((item) => (
            <li key={item.name} className={styles.barItem}>
              <div className={styles.barHeader}>
                <span>{item.name}</span>
                <span>{item.percent}%</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.widget}>
        <h2 className={styles.widgetTitle}>Daily Goal</h2>
        <div className={styles.goalRing}>
          <div
            className={styles.goalCircle}
            style={
              {
                '--goal': goalPercent,
              } as React.CSSProperties
            }
          >
            <span>
              {stats.dailyGoal.current}/{stats.dailyGoal.target}
            </span>
          </div>
        </div>
        <p className={styles.goalText}>Questions Answered</p>
        <p className={styles.goalMessage}>🏆 Great job! Keep going!</p>
      </section>

      <section className={styles.widget}>
        <h2 className={styles.widgetTitle}>Study Streak</h2>
        <div className={styles.streakDays}>
          {weekDays.map((day, i) => (
            <span
              key={`${day}-${i}`}
              className={`${styles.streakDay} ${
                i < stats.streak ? styles.streakActive : ''
              }`}
            >
              {day}
            </span>
          ))}
        </div>
        <p className={styles.streakMessage}>🔥 {stats.streak} days in a row!</p>
      </section>
    </aside>
  );
}
