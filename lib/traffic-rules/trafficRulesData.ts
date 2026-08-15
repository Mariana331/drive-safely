import { readUserJson, writeUserJson } from '@/lib/progress/progressUser';

export type RulePriority = 'high' | 'medium' | 'low';

export type RuleCategoryId =
  | 'all'
  | 'road-signs'
  | 'priority'
  | 'speed'
  | 'parking'
  | 'maneuvers'
  | 'lights';

export interface TrafficRule {
  id: string;
  code: string;
  title: string;
  summary: string;
  category: Exclude<RuleCategoryId, 'all'>;
  priority: RulePriority;
  imageUrl: string;
  tip?: string;
  featured?: boolean;
}

export interface RuleCategory {
  id: RuleCategoryId;
  label: string;
  icon: string;
  count: number;
}

export interface LearningProgress {
  overallPercent: number;
  metrics: { label: string; current: number; total: number }[];
}

/** Official Ukrainian traffic rules (CMU Resolution №1306). */
export const OFFICIAL_SOURCE_RADA = {
  name: 'Verkhovna Rada',
  label: 'Official source',
  title: 'CMU Resolution №1306 of 10.10.2001 — Traffic Rules of Ukraine',
  url: 'https://zakon.rada.gov.ua/laws/show/1306-2001-%D0%BF',
  description:
    'Official text of the Traffic Rules of Ukraine (Постанова КМУ №1306 від 10.10.2001). Current edition is available in the legislation database of Ukraine.',
};

/** Exam materials for drivers (HSC / GSC MIA). */
export const OFFICIAL_SOURCE_HSC = {
  name: 'HSC MIA (ГСЦ МВС)',
  title: 'Order №225 of 29.10.2025 — exam questions',
  url: 'https://hsc.gov.ua/index/poslugi/vidacha-posvidchennya-vodiya/pitannya-ta-ispit-z-pdr/',
  description:
    'Current theoretical exam questions and answers for drivers, approved by HSC MIA Order №225 of 29.10.2025.',
};

export const RULES_STATUS = {
  message: 'Rules updated from official source',
  lastChecked: 'July 2026',
};

export const RULE_CATEGORIES: RuleCategory[] = [
  { id: 'all', label: 'All Rules', icon: '📚', count: 132 },
  { id: 'road-signs', label: 'Road Signs', icon: '🛑', count: 28 },
  { id: 'priority', label: 'Priority', icon: '↔️', count: 16 },
  { id: 'speed', label: 'Speed & Distance', icon: '⏱️', count: 14 },
  { id: 'parking', label: 'Parking', icon: '🅿️', count: 12 },
  { id: 'maneuvers', label: 'Maneuvers', icon: '↪️', count: 18 },
  { id: 'lights', label: 'Lights & Signals', icon: '🚦', count: 12 },
];

export const PRIORITY_STYLES: Record<
  RulePriority,
  { label: string; bg: string; color: string }
> = {
  high: { label: 'High priority', bg: '#fee2e2', color: '#b91c1c' },
  medium: { label: 'Medium priority', bg: '#ffedd5', color: '#c2410c' },
  low: { label: 'Low priority', bg: '#dcfce7', color: '#15803d' },
};

export const LEARNING_PROGRESS: LearningProgress = {
  overallPercent: 75,
  metrics: [
    { label: 'Watched videos', current: 18, total: 24 },
    { label: 'Read rules', current: 32, total: 40 },
    { label: 'Practice tests', current: 12, total: 20 },
    { label: 'Saved rules', current: 25, total: 30 },
  ],
};

export const QUICK_LEARN = [
  {
    id: 'videos',
    label: 'Watch Videos',
    meta: '23 videos',
    icon: '▶️',
    color: '#dbeafe',
    href: '/tests',
  },
  {
    id: 'illustrations',
    label: 'Illustrations',
    meta: '45 diagrams',
    icon: '🖼️',
    color: '#f3e8ff',
    href: '#',
  },
  {
    id: 'examples',
    label: 'Examples',
    meta: '32 real cases',
    icon: '📖',
    color: '#ffedd5',
    href: '#',
  },
  {
    id: 'save',
    label: 'Save & Study',
    meta: 'Your list',
    icon: '🔖',
    color: '#dcfce7',
    href: '/saved-rules',
  },
] as const;

export const TRAFFIC_RULES: TrafficRule[] = [
  {
    id: 'r-11-4',
    code: '11.4',
    title: 'Crossing solid line',
    summary:
      'Crossing a solid center line is prohibited, except when avoiding an obstacle that cannot be passed otherwise.',
    category: 'maneuvers',
    priority: 'high',
    imageUrl:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-16-2',
    code: '16.2',
    title: 'Yielding to pedestrians',
    summary:
      'Drivers must give way to pedestrians on marked crosswalks and at uncontrolled intersections where pedestrians have started crossing.',
    category: 'priority',
    priority: 'high',
    imageUrl:
      'https://images.unsplash.com/photo-1506521781263-d8422e94f995?auto=format&fit=crop&w=800&q=80',
    tip: 'Pedestrians always have priority at crosswalks.',
    featured: true,
  },
  {
    id: 'r-12-1',
    code: '12.1',
    title: 'Speed limits in built-up areas',
    summary:
      'In built-up areas the maximum speed is generally 50 km/h unless road signs indicate otherwise.',
    category: 'speed',
    priority: 'high',
    imageUrl:
      'https://images.unsplash.com/photo-1489824904134-891ab84532f1?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-8-3',
    code: '8.3',
    title: 'Stop and give way signs',
    summary:
      'At a STOP sign you must stop completely before the stop line and yield to vehicles on the intersecting road.',
    category: 'road-signs',
    priority: 'high',
    imageUrl:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-15-4',
    code: '15.4',
    title: 'Parking near intersections',
    summary:
      'Parking is prohibited closer than 10 m from intersections and on pedestrian crossings or within 10 m of them.',
    category: 'parking',
    priority: 'medium',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-10-2',
    code: '10.2',
    title: 'Safe following distance',
    summary:
      'Choose a distance that allows you to stop safely if the vehicle ahead brakes suddenly.',
    category: 'speed',
    priority: 'medium',
    imageUrl:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-9-1',
    code: '9.1',
    title: 'Traffic light signals',
    summary:
      'A red light means stop. Yellow (except flashing) forbids starting movement. Green allows movement if the path is clear.',
    category: 'lights',
    priority: 'high',
    imageUrl:
      'https://images.unsplash.com/photo-1519003729264-11996aac4f41?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-14-1',
    code: '14.1',
    title: 'Overtaking rules',
    summary:
      'Overtaking is allowed only on the left when the road ahead is clear and it does not create danger for other road users.',
    category: 'maneuvers',
    priority: 'high',
    imageUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-8-7',
    code: '8.7',
    title: 'No entry and one-way signs',
    summary:
      'Do not enter a road marked with a no-entry sign. On one-way roads, drive only in the indicated direction.',
    category: 'road-signs',
    priority: 'medium',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-13-2',
    code: '13.2',
    title: 'Right of way at uncontrolled intersections',
    summary:
      'At equivalent uncontrolled intersections, yield to vehicles approaching from the right.',
    category: 'priority',
    priority: 'high',
    imageUrl:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-16-12',
    code: '16.12',
    title: 'Priority at intersections',
    summary:
      'At an intersection, give way to vehicles that have priority according to signs, signals, or the right-hand rule when directions are equivalent.',
    category: 'priority',
    priority: 'high',
    tip: 'Look for priority signs first, then traffic lights, then the right-hand rule.',
    imageUrl:
      'https://images.unsplash.com/photo-1506521781263-d8422e94f995?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-15-9',
    code: '15.9',
    title: 'Parking on sidewalks',
    summary:
      'Parking on sidewalks is allowed only where signs or markings permit it, and must not obstruct pedestrians.',
    category: 'parking',
    priority: 'low',
    imageUrl:
      'https://images.unsplash.com/photo-1511919886586-b716af265bd8?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'r-9-5',
    code: '9.5',
    title: 'Turning signals',
    summary:
      'Signal before turning, changing lanes, or stopping. Cancel the signal immediately after the maneuver.',
    category: 'lights',
    priority: 'medium',
    imageUrl:
      'https://images.unsplash.com/photo-1558981403-c5f9899a5762?auto=format&fit=crop&w=400&q=80',
  },
];

export const SAVED_RULES_DEFAULT = TRAFFIC_RULES.filter((r) =>
  ['r-11-4', 'r-16-2', 'r-12-1', 'r-8-3'].includes(r.id),
);

const SAVED_STORAGE_KEY = 'drivesafely-saved-rules';

export function getFeaturedRule(rules: TrafficRule[] = TRAFFIC_RULES) {
  return rules.find((r) => r.featured) ?? rules[0];
}

export function filterTrafficRules(
  rules: TrafficRule[],
  opts: { category: RuleCategoryId; search: string },
) {
  const q = opts.search.trim().toLowerCase();
  return rules.filter((rule) => {
    const matchCategory =
      opts.category === 'all' || rule.category === opts.category;
    const matchSearch =
      !q ||
      rule.title.toLowerCase().includes(q) ||
      rule.summary.toLowerCase().includes(q) ||
      rule.code.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });
}

export function loadSavedRuleIds(): string[] {
  if (typeof window === 'undefined') return [];
  return readUserJson<string[]>(SAVED_STORAGE_KEY, []);
}

export function persistSavedRuleIds(ids: string[]) {
  writeUserJson(SAVED_STORAGE_KEY, ids);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('drivesafely:progress-updated'));
  }
}
