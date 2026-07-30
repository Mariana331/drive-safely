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

export function buildDemoResult(id: string, title: string): AnalysisResult {
  return {
    id,
    title,
    createdAt: new Date().toISOString(),
    riskScore: 6.5,
    violations: [
      {
        id: 'v1',
        title: 'Crossing solid line',
        severity: 'high',
        timeLabel: '00:12',
        description:
          'The vehicle crossed a solid lane marking. Solid lines usually prohibit lane changes.',
      },
      {
        id: 'v2',
        title: 'Speed limit exceeded',
        severity: 'medium',
        timeLabel: '00:28',
        description: 'Detected speed appears higher than the posted limit in this segment.',
        note: 'Detected ~58 in a 50 zone (demo estimate)',
      },
      {
        id: 'v3',
        title: 'Pedestrian priority',
        severity: 'low',
        timeLabel: '00:41',
        description:
          'A pedestrian was near a crossing. Slow down earlier and prepare to yield.',
      },
    ],
    objects: [
      { name: 'Car', count: 4, icon: '🚗' },
      { name: 'Pedestrian', count: 2, icon: '🚶' },
      { name: 'Traffic Light', count: 1, icon: '🚦' },
      { name: 'Road Sign', count: 3, icon: '🛑' },
      { name: 'Lane Marking', count: 6, icon: '➖' },
    ],
    tip: 'Keep more distance from pedestrians and avoid crossing solid lines unless directed by signs or police.',
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
