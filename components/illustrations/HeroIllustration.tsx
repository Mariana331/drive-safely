import styles from './HeroIllustration.module.css';
import DriveyMascot from './DriveyMascot';

export default function HeroIllustration() {
  return (
    <div className={styles.wrapper}>
      <svg
        viewBox="0 0 400 320"
        fill="none"
        className={styles.scene}
        aria-hidden="true"
      >
        <rect width="400" height="320" rx="24" fill="#EFF6FF" />
        <rect x="0" y="200" width="400" height="120" fill="#E2E8F0" />
        <path
          d="M0 240 Q100 220 200 240 T400 240"
          stroke="#94A3B8"
          strokeWidth="40"
          fill="none"
        />
        <path
          d="M0 240 Q100 220 200 240 T400 240"
          stroke="white"
          strokeWidth="2"
          strokeDasharray="20 15"
          fill="none"
        />
        <rect x="280" y="60" width="30" height="80" rx="4" fill="#64748B" />
        <circle cx="295" cy="70" r="8" fill="#EF4444" />
        <circle cx="295" cy="90" r="8" fill="#EAB308" />
        <circle cx="295" cy="110" r="8" fill="#22C55E" />
        <rect x="60" y="100" width="50" height="70" rx="8" fill="white" stroke="#CBD5E1" strokeWidth="2" />
        <text x="85" y="145" textAnchor="middle" fill="#1E293B" fontSize="20" fontWeight="bold">
          60
        </text>
        <rect x="320" y="150" width="40" height="40" rx="4" fill="white" stroke="#3B82F6" strokeWidth="2" />
        <path d="M330 175h20M340 165v20" stroke="#3B82F6" strokeWidth="2" />
        <rect x="30" y="40" width="20" height="60" fill="#94A3B8" rx="2" />
        <rect x="55" y="55" width="20" height="45" fill="#94A3B8" rx="2" />
        <rect x="80" y="35" width="20" height="65" fill="#94A3B8" rx="2" />
        <rect x="105" y="50" width="20" height="50" fill="#94A3B8" rx="2" />
        <rect x="130" y="30" width="20" height="70" fill="#64748B" rx="2" />
        <rect x="155" y="45" width="20" height="55" fill="#94A3B8" rx="2" />
        <rect x="180" y="25" width="20" height="75" fill="#64748B" rx="2" />
        <g transform="translate(120, 195)">
          <rect x="0" y="10" width="80" height="30" rx="8" fill="#3B82F6" />
          <rect x="10" y="0" width="50" height="25" rx="6" fill="#2563EB" />
          <rect x="15" y="5" width="20" height="12" rx="3" fill="#93C5FD" />
          <circle cx="18" cy="42" r="10" fill="#1E293B" />
          <circle cx="62" cy="42" r="10" fill="#1E293B" />
          <circle cx="18" cy="42" r="5" fill="#64748B" />
          <circle cx="62" cy="42" r="5" fill="#64748B" />
        </g>
      </svg>
      <div className={styles.driveyCard}>
        <DriveyMascot size="sm" showSpeech />
      </div>
    </div>
  );
}
