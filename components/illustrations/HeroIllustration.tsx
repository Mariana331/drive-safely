import styles from './HeroIllustration.module.css';
import DriveyMascot from './DriveyMascot';

interface HeroIllustrationProps {
  variant?: 'card' | 'background';
}

export default function HeroIllustration({
  variant = 'card',
}: HeroIllustrationProps) {
  return (
    <div
      className={`${styles.wrapper} ${
        variant === 'background' ? styles.background : ''
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 900 640"
        fill="none"
        className={styles.scene}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="55%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#E0F2FE" />
          </linearGradient>
          <linearGradient id="road" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        <rect width="900" height="640" fill="url(#sky)" />

        <ellipse cx="140" cy="90" rx="70" ry="28" fill="white" opacity="0.9" />
        <ellipse cx="190" cy="82" rx="50" ry="22" fill="white" opacity="0.85" />
        <ellipse cx="520" cy="70" rx="90" ry="32" fill="white" opacity="0.92" />
        <ellipse cx="600" cy="62" rx="60" ry="24" fill="white" opacity="0.8" />
        <ellipse cx="760" cy="100" rx="80" ry="30" fill="white" opacity="0.75" />

        <g opacity="0.85">
          <rect x="500" y="250" width="36" height="140" rx="4" fill="#7DD3FC" />
          <rect x="545" y="220" width="42" height="170" rx="4" fill="#38BDF8" />
          <rect x="595" y="240" width="34" height="150" rx="4" fill="#0EA5E9" />
          <rect x="640" y="200" width="48" height="190" rx="4" fill="#0284C7" />
          <rect x="695" y="230" width="38" height="160" rx="4" fill="#38BDF8" />
          <rect x="740" y="210" width="44" height="180" rx="4" fill="#0EA5E9" />
          <rect x="790" y="250" width="32" height="140" rx="4" fill="#7DD3FC" />
          <rect x="830" y="270" width="28" height="120" rx="4" fill="#BAE6FD" />
        </g>

        <path
          d="M0 430 C120 390 220 410 340 400 C460 390 560 420 700 410 C780 405 840 415 900 400 L900 640 L0 640Z"
          fill="url(#hill)"
        />
        <path
          d="M0 470 C150 450 280 465 420 455 C560 445 700 470 900 450 L900 640 L0 640Z"
          fill="#16A34A"
          opacity="0.55"
        />

        <ellipse cx="120" cy="410" rx="34" ry="42" fill="#15803D" />
        <ellipse cx="155" cy="400" rx="28" ry="36" fill="#16A34A" />
        <ellipse cx="210" cy="415" rx="40" ry="48" fill="#15803D" />
        <ellipse cx="255" cy="405" rx="30" ry="38" fill="#22C55E" />
        <ellipse cx="300" cy="418" rx="36" ry="44" fill="#16A34A" />

        <path
          d="M120 520 C260 470 420 470 560 500 C650 520 760 500 900 530 L900 640 L120 640Z"
          fill="url(#road)"
        />
        <path
          d="M180 545 C320 515 480 515 620 535 C720 550 820 535 900 555"
          stroke="white"
          strokeWidth="5"
          strokeDasharray="28 22"
          strokeLinecap="round"
        />

        <path
          d="M560 470 L900 470 L900 640 L620 640Z"
          fill="#94A3B8"
          opacity="0.35"
        />
        <rect x="680" y="468" width="220" height="8" rx="2" fill="#CBD5E1" />
        <rect x="700" y="456" width="6" height="184" fill="#E2E8F0" opacity="0.8" />
        <rect x="760" y="456" width="6" height="184" fill="#E2E8F0" opacity="0.8" />
        <rect x="820" y="456" width="6" height="184" fill="#E2E8F0" opacity="0.8" />

        <g transform="translate(330, 470)">
          <rect x="0" y="28" width="118" height="42" rx="10" fill="#2563EB" />
          <path d="M12 28 L28 8 L90 8 L106 28Z" fill="#1D4ED8" />
          <rect x="22" y="14" width="34" height="18" rx="4" fill="#93C5FD" />
          <rect x="62" y="14" width="34" height="18" rx="4" fill="#93C5FD" />
          <rect x="38" y="52" width="42" height="10" rx="3" fill="#1E293B" />
          <text
            x="59"
            y="60"
            textAnchor="middle"
            fill="#E2E8F0"
            fontSize="7"
            fontWeight="700"
            fontFamily="system-ui, sans-serif"
          >
            DRIVESAFELY
          </text>
          <circle cx="24" cy="72" r="14" fill="#0F172A" />
          <circle cx="94" cy="72" r="14" fill="#0F172A" />
          <circle cx="24" cy="72" r="7" fill="#64748B" />
          <circle cx="94" cy="72" r="7" fill="#64748B" />
          <rect x="8" y="36" width="8" height="12" rx="2" fill="#F87171" />
          <rect x="102" y="36" width="8" height="12" rx="2" fill="#F87171" />
        </g>

        <g transform="translate(210, 360)">
          <circle cx="28" cy="28" r="28" fill="white" stroke="#CBD5E1" strokeWidth="3" />
          <text
            x="28"
            y="36"
            textAnchor="middle"
            fill="#0F172A"
            fontSize="22"
            fontWeight="800"
            fontFamily="system-ui, sans-serif"
          >
            60
          </text>
        </g>

        <g transform="translate(500, 330)">
          <path
            d="M30 4 L56 58 L4 58Z"
            fill="#FACC15"
            stroke="#EAB308"
            strokeWidth="2"
          />
          <rect x="18" y="30" width="24" height="4" rx="1" fill="#0F172A" />
          <rect x="14" y="38" width="32" height="4" rx="1" fill="#0F172A" />
        </g>

        <g transform="translate(620, 300)">
          <rect x="0" y="0" width="18" height="70" rx="4" fill="#334155" />
          <circle cx="9" cy="14" r="7" fill="#EF4444" />
          <circle cx="9" cy="35" r="7" fill="#EAB308" />
          <circle cx="9" cy="56" r="7" fill="#22C55E" />
        </g>
      </svg>

      <div className={styles.mascotFloat}>
        <DriveyMascot size="md" waving />
      </div>
    </div>
  );
}
