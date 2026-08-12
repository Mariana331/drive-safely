import type { TestDifficulty } from './testsData';
import { EXTRA_QUESTIONS } from './questionBankExtra';

export interface TestQuestion {
  id: string;
  category: string;
  difficulty: TestDifficulty;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const CORE_QUESTIONS: TestQuestion[] = [
  {
    id: 'q1',
    category: 'signs',
    difficulty: 'easy',
    text: 'What does a red circular traffic sign with a white horizontal bar mean?',
    options: ['No entry', 'Stop and wait', 'One-way street', 'Give way'],
    correctIndex: 0,
    explanation: 'A red circle with a white bar means vehicles are not allowed to enter.',
  },
  {
    id: 'q2',
    category: 'signs',
    difficulty: 'easy',
    text: 'A triangular sign with a red border usually means:',
    options: ['Mandatory action', 'Warning / hazard ahead', 'Parking only', 'End of restriction'],
    correctIndex: 1,
    explanation: 'Triangular signs with red borders warn of hazards ahead.',
  },
  {
    id: 'q3',
    category: 'signs',
    difficulty: 'medium',
    text: 'A circular blue sign with a white arrow pointing left means:',
    options: ['No left turn', 'Turn left only', 'Left lane ends', 'Keep left temporarily'],
    correctIndex: 1,
    explanation: 'Blue circular signs indicate mandatory instructions — turn left only.',
  },
  {
    id: 'q4',
    category: 'signs',
    difficulty: 'medium',
    text: 'What does a yellow diamond pedestrian crossing sign indicate?',
    options: [
      'School zone only',
      'Pedestrian crossing ahead',
      'No pedestrians allowed',
      'Emergency vehicle lane',
    ],
    correctIndex: 1,
    explanation: 'It warns that a pedestrian crossing is ahead and you should slow down.',
  },
  {
    id: 'q5',
    category: 'priority',
    difficulty: 'easy',
    text: 'At an uncontrolled intersection, who usually has priority?',
    options: [
      'The larger vehicle',
      'The vehicle on the left',
      'The vehicle on the right',
      'The faster vehicle',
    ],
    correctIndex: 2,
    explanation: 'In most jurisdictions, the vehicle approaching from the right has priority.',
  },
  {
    id: 'q6',
    category: 'priority',
    difficulty: 'medium',
    text: 'When entering a roundabout, you should:',
    options: [
      'Always stop completely',
      'Yield to traffic already in the roundabout',
      'Accelerate and claim the lane',
      'Honk to get priority',
    ],
    correctIndex: 1,
    explanation: 'Traffic already circulating in the roundabout has priority.',
  },
  {
    id: 'q7',
    category: 'priority',
    difficulty: 'hard',
    text: 'An emergency vehicle with lights and sirens approaches from behind. You should:',
    options: [
      'Speed up to clear the road',
      'Stop immediately in the middle of the lane',
      'Pull over safely and let it pass',
      'Ignore it if you are turning soon',
    ],
    correctIndex: 2,
    explanation: 'Move to the side safely and stop if needed so the emergency vehicle can pass.',
  },
  {
    id: 'q8',
    category: 'lights',
    difficulty: 'easy',
    text: 'A steady red traffic light means:',
    options: [
      'Proceed with caution',
      'Stop and wait until green',
      'Stop only if other cars are present',
      'Slow down then continue',
    ],
    correctIndex: 1,
    explanation: 'A red light requires a full stop until the signal changes.',
  },
  {
    id: 'q9',
    category: 'lights',
    difficulty: 'medium',
    text: 'A yellow (amber) light usually means:',
    options: [
      'Speed up to beat the red',
      'Stop if you can do so safely',
      'Treat it like green',
      'Ignore if turning right',
    ],
    correctIndex: 1,
    explanation: 'Yellow means prepare to stop if you can stop safely before the intersection.',
  },
  {
    id: 'q10',
    category: 'lights',
    difficulty: 'easy',
    text: 'A green arrow at a traffic light means:',
    options: [
      'You may turn in that direction with priority',
      'Turning is forbidden',
      'Wait for a full green circle',
      'Only buses may turn',
    ],
    correctIndex: 0,
    explanation: 'A green arrow allows a protected turn in the indicated direction.',
  },
  {
    id: 'q11',
    category: 'parking',
    difficulty: 'easy',
    text: 'Parking on a pedestrian crossing is:',
    options: ['Allowed at night', 'Allowed for 2 minutes', 'Forbidden', 'Allowed if hazard lights are on'],
    correctIndex: 2,
    explanation: 'You must never park on a pedestrian crossing.',
  },
  {
    id: 'q12',
    category: 'parking',
    difficulty: 'medium',
    text: 'When parking uphill with a curb, you should turn your wheels:',
    options: [
      'Away from the curb',
      'Toward the curb',
      'Straight ahead only',
      'It does not matter',
    ],
    correctIndex: 0,
    explanation: 'Uphill with curb: turn wheels away so the car rolls into the curb if brakes fail.',
  },
  {
    id: 'q13',
    category: 'parking',
    difficulty: 'hard',
    text: 'Stopping in a bike lane is generally:',
    options: [
      'Allowed during rush hour',
      'Allowed with hazard lights',
      'Not allowed except emergencies',
      'Allowed for deliveries only',
    ],
    correctIndex: 2,
    explanation: 'Bike lanes must stay clear except in genuine emergencies.',
  },
  {
    id: 'q14',
    category: 'maneuvers',
    difficulty: 'medium',
    text: 'Before changing lanes you should:',
    options: [
      'Only use mirrors',
      'Signal, check mirrors and blind spot',
      'Speed up without signaling',
      'Brake hard first',
    ],
    correctIndex: 1,
    explanation: 'Always signal early and check mirrors plus the blind spot.',
  },
  {
    id: 'q15',
    category: 'maneuvers',
    difficulty: 'hard',
    text: 'When overtaking on a two-lane road, you must:',
    options: [
      'Overtake only if the opposite lane is clear and it is safe',
      'Overtake whenever you feel confident',
      'Overtake on solid center lines',
      'Overtake on the shoulder',
    ],
    correctIndex: 0,
    explanation: 'Overtaking is allowed only when the road markings and traffic make it safe.',
  },
  {
    id: 'q16',
    category: 'maneuvers',
    difficulty: 'easy',
    text: 'The safest way to reverse from a driveway is to:',
    options: [
      'Rely only on reverse camera',
      'Check surroundings and reverse slowly',
      'Reverse quickly to clear the road',
      'Honk continuously while reversing',
    ],
    correctIndex: 1,
    explanation: 'Check all around and reverse slowly, using cameras as a help — not the only check.',
  },
  {
    id: 'q17',
    category: 'speed',
    difficulty: 'easy',
    text: 'In wet conditions you should generally:',
    options: [
      'Drive at the posted limit always',
      'Reduce speed and increase following distance',
      'Use cruise control aggressively',
      'Brake later than usual',
    ],
    correctIndex: 1,
    explanation: 'Wet roads reduce grip — slow down and leave more space.',
  },
  {
    id: 'q18',
    category: 'speed',
    difficulty: 'medium',
    text: 'The “two-second rule” helps you:',
    options: [
      'Time traffic lights',
      'Keep a safe following distance',
      'Park accurately',
      'Calculate fuel economy',
    ],
    correctIndex: 1,
    explanation: 'It is a simple way to maintain a safe gap behind the vehicle ahead.',
  },
  {
    id: 'q19',
    category: 'speed',
    difficulty: 'hard',
    text: 'If you enter a curve too fast, the safest first action is usually to:',
    options: [
      'Brake hard while turning sharply',
      'Ease off the accelerator and steer smoothly',
      'Accelerate through the curve',
      'Look away from the road',
    ],
    correctIndex: 1,
    explanation: 'Smoothly reduce speed and look/steer through the curve without panic braking.',
  },
  {
    id: 'q20',
    category: 'signs',
    difficulty: 'hard',
    text: 'A speed limit sign shows “50”. This means:',
    options: [
      'You must drive exactly 50',
      '50 is the maximum allowed under normal conditions',
      '50 is recommended only at night',
      'You may exceed 50 if traffic is light',
    ],
    correctIndex: 1,
    explanation: 'Posted limits are maximums in good conditions — go slower if needed for safety.',
  },
  {
    id: 'q21',
    category: 'priority',
    difficulty: 'easy',
    text: 'At a STOP sign you must:',
    options: [
      'Slow down and continue if clear',
      'Come to a complete stop, then proceed when safe',
      'Stop only if you see another car',
      'Wave other drivers through without stopping',
    ],
    correctIndex: 1,
    explanation: 'A STOP sign requires a full stop before continuing.',
  },
  {
    id: 'q22',
    category: 'lights',
    difficulty: 'hard',
    text: 'A flashing yellow traffic light usually means:',
    options: [
      'Stop completely',
      'Proceed with caution',
      'Turn only left',
      'Road closed',
    ],
    correctIndex: 1,
    explanation: 'Flashing yellow means proceed carefully and yield as needed.',
  },
  {
    id: 'q23',
    category: 'parking',
    difficulty: 'easy',
    text: 'Leaving your car with the engine running while unattended is:',
    options: [
      'Recommended in winter',
      'Often unsafe and may be illegal',
      'Required for electric cars',
      'Fine if doors are locked',
    ],
    correctIndex: 1,
    explanation: 'Unattended running vehicles are a safety and theft risk and often prohibited.',
  },
  {
    id: 'q24',
    category: 'maneuvers',
    difficulty: 'medium',
    text: 'When preparing to turn right, you should usually position yourself:',
    options: [
      'In the leftmost lane',
      'In the correct right-turn lane early',
      'In the middle of the intersection',
      'On the sidewalk if crowded',
    ],
    correctIndex: 1,
    explanation: 'Enter the proper lane in advance and signal your intention.',
  },
  {
    id: 'q25',
    category: 'speed',
    difficulty: 'easy',
    text: 'In a school zone during active hours, you should:',
    options: [
      'Drive at highway speed if no children are visible',
      'Obey the reduced school-zone speed limit',
      'Ignore signs if the road looks empty',
      'Use the horn continuously',
    ],
    correctIndex: 1,
    explanation: 'School-zone limits protect children and must be obeyed during posted times.',
  },
  {
    id: 'q26',
    category: 'signs',
    difficulty: 'easy',
    text: 'A “Give Way / Yield” sign means:',
    options: [
      'You have absolute priority',
      'Slow down and give priority to other traffic',
      'Stop for exactly 3 seconds always',
      'No vehicles allowed',
    ],
    correctIndex: 1,
    explanation: 'Yield means give priority and proceed only when it is safe.',
  },
  {
    id: 'q27',
    category: 'priority',
    difficulty: 'medium',
    text: 'When a pedestrian is already on a marked crosswalk, you should:',
    options: [
      'Honk so they hurry',
      'Stop and let them cross',
      'Drive around them carefully',
      'Flash high beams',
    ],
    correctIndex: 1,
    explanation: 'Pedestrians on a marked crosswalk have priority — stop and wait.',
  },
  {
    id: 'q28',
    category: 'maneuvers',
    difficulty: 'easy',
    text: 'Using a turn signal is required:',
    options: [
      'Only on highways',
      'Before turns and lane changes',
      'Only at night',
      'Only when police are nearby',
    ],
    correctIndex: 1,
    explanation: 'Signal early before turns and lane changes so others know your intention.',
  },
  {
    id: 'q29',
    category: 'speed',
    difficulty: 'medium',
    text: 'Tailgating (following too closely) is dangerous because:',
    options: [
      'It improves fuel economy',
      'You have less time to react and stop',
      'It keeps other drivers awake',
      'It is required in city traffic',
    ],
    correctIndex: 1,
    explanation: 'A short gap leaves almost no reaction time if the car ahead brakes.',
  },
  {
    id: 'q30',
    category: 'lights',
    difficulty: 'medium',
    text: 'A flashing red traffic light should be treated like:',
    options: ['A green light', 'A yield sign', 'A stop sign', 'A one-way sign'],
    correctIndex: 2,
    explanation: 'Flashing red means stop fully, then proceed when safe — like a stop sign.',
  },
];

export const QUESTION_BANK: TestQuestion[] = [
  ...CORE_QUESTIONS,
  ...(EXTRA_QUESTIONS as TestQuestion[]),
];

export function getCategoryQuestionCount(category: string) {
  return QUESTION_BANK.filter((q) => q.category === category).length;
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function pickQuestions(options: {
  mode: 'quick' | 'category' | 'exam' | 'ai' | 'challenge' | 'review';
  category?: string;
  count?: number;
}): TestQuestion[] {
  const { mode, category } = options;
  let pool = [...QUESTION_BANK];

  if (mode === 'category' && category) {
    pool = pool.filter((q) => q.category === category);
    const wanted = options.count ?? pool.length;
    if (pool.length < wanted) {
      // Top up from full bank if a category is still short (should not happen).
      const extra = shuffle(
        QUESTION_BANK.filter((q) => q.category !== category),
      ).slice(0, wanted - pool.length);
      return shuffle([...pool, ...extra]).slice(0, wanted);
    }
    return shuffle(pool).slice(0, wanted);
  }

  if (mode === 'ai' || mode === 'challenge') {
    pool = pool.filter((q) => q.difficulty === 'hard' || q.difficulty === 'medium');
  }

  if (mode === 'exam') {
    return shuffle(pool).slice(0, options.count ?? 20);
  }

  if (mode === 'quick') {
    return shuffle(pool).slice(0, options.count ?? 5);
  }

  if (mode === 'review') {
    return shuffle(pool.filter((q) => q.difficulty !== 'easy')).slice(
      0,
      options.count ?? 8,
    );
  }

  return shuffle(pool).slice(0, options.count ?? Math.min(10, pool.length));
}
