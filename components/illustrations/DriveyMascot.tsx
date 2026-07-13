import styles from './DriveyMascot.module.css';

interface DriveyMascotProps {
  size?: 'sm' | 'md' | 'lg';
  waving?: boolean;
  showSpeech?: boolean;
}

export default function DriveyMascot({
  size = 'md',
  waving = false,
  showSpeech = false,
}: DriveyMascotProps) {
  return (
    <div className={`${styles.wrapper} ${styles[size]}`}>
      {showSpeech && (
        <div className={styles.speech}>
          I&apos;m Drivey! Your AI road safety assistant.
        </div>
      )}
      <svg viewBox="0 0 80 90" fill="none" aria-label="Drivey mascot" className={styles.mascot}>
        {waving && (
          <path
            d="M62 35l8-6 4 5-8 6"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            className={styles.wave}
          />
        )}
        <path
          d="M40 8L20 18v18c0 14 8.5 27.1 20 30.5C51.5 63.1 60 50 60 36V18L40 8z"
          fill="#3B82F6"
        />
        <path
          d="M40 8L20 18v18c0 14 8.5 27.1 20 30.5"
          fill="#2563EB"
          opacity="0.3"
        />
        <circle cx="32" cy="32" r="4" fill="white" />
        <circle cx="48" cy="32" r="4" fill="white" />
        <circle cx="33" cy="32" r="2" fill="#1E293B" />
        <circle cx="49" cy="32" r="2" fill="#1E293B" />
        <path
          d="M34 42c2 3 10 3 12 0"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {!waving && (
          <>
            <path d="M18 38l-6 4" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            <path d="M62 38l6 4" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {waving && (
          <path d="M18 38l-6 4" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}
