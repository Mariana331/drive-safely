export type AnalysisStatus = 'analyzed' | 'processing' | 'failed';
export type ViolationSeverity = 'high' | 'medium' | 'low';

export interface RecentUpload {
  id: string;
  title: string;
  date: string;
  status: AnalysisStatus;
  thumbnail: string;
}

export interface DetectedObject {
  name: string;
  count: number;
  icon: string;
}

export interface AnalysisViolation {
  id: string;
  title: string;
  severity: ViolationSeverity;
  timeLabel: string;
  description: string;
  note?: string;
}

export interface AnalysisResult {
  id: string;
  title: string;
  createdAt: string;
  riskScore: number;
  violations: AnalysisViolation[];
  objects: DetectedObject[];
  tip: string;
}

export interface BuildResultOptions {
  fileName?: string;
  fileSize?: number;
  /** Video length in seconds — used to place markers inside the clip. */
  durationSec?: number;
}

export const ANALYSIS_TIPS = [
  { icon: '☀️', title: 'Good lighting', text: 'Record in daylight when possible.' },
  { icon: '📱', title: 'Stable camera', text: 'Keep your phone or dashcam steady.' },
  { icon: '🚸', title: 'Show road signs', text: 'Include visible traffic signs in frame.' },
  { icon: '🛣️', title: 'Show lane markings', text: 'Capture clear lane lines on the road.' },
  { icon: '⏱️', title: 'At least 10 seconds', text: 'Longer clips give better AI feedback.' },
];

export const PROCESSING_STEPS = [
  { id: 'scan', label: 'Scanning road' },
  { id: 'vehicles', label: 'Detecting vehicles' },
  { id: 'pedestrians', label: 'Detecting pedestrians' },
  { id: 'signs', label: 'Reading traffic signs' },
  { id: 'lanes', label: 'Analyzing lane markings' },
  { id: 'rules', label: 'Checking traffic rules' },
  { id: 'explain', label: 'Generating explanation' },
];

export const FALLBACK_RECENT: RecentUpload[] = [
  {
    id: 'demo-1',
    title: 'City Center Drive',
    date: 'May 16, 2024',
    status: 'analyzed',
    thumbnail: '🚗',
  },
  {
    id: 'demo-2',
    title: 'Morning Commute',
    date: 'May 14, 2024',
    status: 'processing',
    thumbnail: '🌅',
  },
  {
    id: 'demo-3',
    title: 'Highway Clip',
    date: 'May 12, 2024',
    status: 'failed',
    thumbnail: '🛣️',
  },
];

const VIOLATION_POOL: Omit<AnalysisViolation, 'id' | 'timeLabel'>[] = [
  {
    title: 'Crossing solid line',
    severity: 'high',
    description:
      'The vehicle crossed a solid lane marking. Solid lines usually prohibit lane changes.',
  },
  {
    title: 'Speed limit exceeded',
    severity: 'medium',
    description: 'Detected speed appears higher than the posted limit in this segment.',
    note: 'Estimate based on clip motion cues',
  },
  {
    title: 'Pedestrian priority',
    severity: 'low',
    description:
      'A pedestrian was near a crossing. Slow down earlier and prepare to yield.',
  },
  {
    title: 'Insufficient following distance',
    severity: 'medium',
    description:
      'The gap to the vehicle ahead looks short. Leave more space for emergency braking.',
  },
  {
    title: 'Late signal / no turn signal',
    severity: 'medium',
    description:
      'A turn or lane change may have started without a clear signal. Signal early.',
  },
  {
    title: 'Stop line / red light risk',
    severity: 'high',
    description:
      'Approach to a controlled junction looks rushed. Be ready to stop fully behind the line.',
  },
  {
    title: 'Phone distraction risk',
    severity: 'high',
    description:
      'Hand movement near the cabin suggests possible phone use. Keep both hands on the wheel.',
  },
  {
    title: 'Blind spot check missed',
    severity: 'low',
    description:
      'Lane change without an obvious shoulder check. Always verify the blind spot.',
  },
];

const OBJECT_POOL: Omit<DetectedObject, 'count'>[] = [
  { name: 'Car', icon: '🚗' },
  { name: 'Pedestrian', icon: '🚶' },
  { name: 'Traffic Light', icon: '🚦' },
  { name: 'Road Sign', icon: '🛑' },
  { name: 'Lane Marking', icon: '➖' },
  { name: 'Bicycle', icon: '🚲' },
  { name: 'Bus', icon: '🚌' },
  { name: 'Motorcycle', icon: '🏍️' },
];

const TIPS = [
  'Keep more distance from pedestrians and avoid crossing solid lines unless directed by signs or police.',
  'Scan intersections early and cover the brake when visibility drops.',
  'Signal before every turn or lane change — even if the road looks empty.',
  'Match speed to conditions, not only to the posted number on the sign.',
  'Checking mirrors every 5–8 seconds helps you spot risks before they become emergencies.',
];

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createRng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function formatTimeLabel(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function riskLabel(score: number): string {
  if (score >= 7.5) return 'High risk — prioritize the flagged moments below.';
  if (score >= 4.5) return 'Moderate risk — review the flagged moments below.';
  return 'Lower risk — still review the moments below for safer habits.';
}

/** Deterministic demo analysis shaped by clip id / file meta / duration. */
export function buildDemoResult(
  id: string,
  title: string,
  options: BuildResultOptions = {},
): AnalysisResult {
  const seed = hashSeed(
    `${id}|${title}|${options.fileName ?? ''}|${options.fileSize ?? 0}|${options.durationSec ?? 0}`,
  );
  const rand = createRng(seed);

  const duration = Math.max(
    5,
    Number.isFinite(options.durationSec) && (options.durationSec ?? 0) > 0
      ? (options.durationSec as number)
      : 34 + Math.floor(rand() * 40),
  );

  const count = 1 + Math.floor(rand() * Math.min(4, VIOLATION_POOL.length));
  const pool = [...VIOLATION_POOL];
  const violations: AnalysisViolation[] = [];

  for (let i = 0; i < count; i += 1) {
    const index = Math.floor(rand() * pool.length);
    const [picked] = pool.splice(index, 1);
    const ratio = (i + 1) / (count + 1) + (rand() - 0.5) * 0.12;
    const at = Math.min(
      duration - 0.5,
      Math.max(0.5, duration * Math.min(0.95, Math.max(0.08, ratio))),
    );
    violations.push({
      ...picked,
      id: `v${i + 1}`,
      timeLabel: formatTimeLabel(at),
      note:
        picked.title === 'Speed limit exceeded'
          ? `Detected ~${45 + Math.floor(rand() * 25)} in a ${
              40 + Math.floor(rand() * 3) * 10
            } zone (demo estimate)`
          : picked.note,
    });
  }

  violations.sort(
    (a, b) =>
      a.timeLabel.localeCompare(b.timeLabel) || a.title.localeCompare(b.title),
  );

  const severityWeight = violations.reduce((sum, v) => {
    if (v.severity === 'high') return sum + 2.4;
    if (v.severity === 'medium') return sum + 1.4;
    return sum + 0.7;
  }, 0);
  const riskScore = Math.min(
    9.5,
    Math.max(1.8, 2 + severityWeight + rand() * 1.5),
  );

  const objectCount = 3 + Math.floor(rand() * 4);
  const objectsPool = [...OBJECT_POOL];
  const objects: DetectedObject[] = [];
  for (let i = 0; i < objectCount; i += 1) {
    const index = Math.floor(rand() * objectsPool.length);
    const [picked] = objectsPool.splice(index, 1);
    objects.push({
      ...picked,
      count: 1 + Math.floor(rand() * (picked.name === 'Lane Marking' ? 8 : 5)),
    });
  }

  return {
    id,
    title,
    createdAt: new Date().toISOString(),
    riskScore: Math.round(riskScore * 10) / 10,
    violations,
    objects,
    tip: TIPS[Math.floor(rand() * TIPS.length)],
  };
}

export function formatAnalysisDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const STATUS_LABEL: Record<AnalysisStatus, string> = {
  analyzed: 'Analyzed',
  processing: 'Processing',
  failed: 'Failed',
};
