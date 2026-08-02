import {
  OFFICIAL_SOURCE_RADA,
  TRAFFIC_RULES,
  type TrafficRule,
} from '@/lib/traffic-rules/trafficRulesData';

export interface AssistantRuleRef {
  id: string;
  code: string;
  title: string;
  href: string;
  officialUrl: string;
}

export interface AssistantReply {
  text: string;
  rules: AssistantRuleRef[];
  followUps?: string[];
  relatedLinks?: { label: string; href: string }[];
}

export const QUICK_PROMPTS = [
  {
    id: 'priority-cross',
    label: 'Хто має перевагу на перехресті?',
    prompt: 'Хто має перевагу на цьому перехресті?',
  },
  {
    id: 'pedestrian',
    label: 'Пішохід на переході',
    prompt: 'Хто має перевагу, якщо пішохід уже вийшов на пішохідний перехід?',
  },
  {
    id: 'solid-line',
    label: 'Суцільна лінія',
    prompt: 'Чи можна перетинати суцільну лінію розмітки?',
  },
  {
    id: 'speed-city',
    label: 'Швидкість у місті',
    prompt: 'Яка дозволена швидкість у населеному пункті?',
  },
  {
    id: 'yellow-light',
    label: 'Жовтий сигнал',
    prompt: 'Що робити на жовтий сигнал світлофора?',
  },
  {
    id: 'parking',
    label: 'Паркування біля перехрестя',
    prompt: 'Де не можна паркуватися біля перехрестя?',
  },
  {
    id: 'overtake',
    label: 'Обгін',
    prompt: 'Коли дозволений обгін?',
  },
  {
    id: 'stop-sign',
    label: 'Знак STOP',
    prompt: 'Що означає знак STOP і як діяти?',
  },
] as const;

function toRef(rule: TrafficRule): AssistantRuleRef {
  return {
    id: rule.id,
    code: rule.code,
    title: rule.title,
    href: `/traffic-rules?rule=${rule.id}`,
    officialUrl: OFFICIAL_SOURCE_RADA.url,
  };
}

function findRulesByIds(ids: string[]) {
  return TRAFFIC_RULES.filter((r) => ids.includes(r.id)).map(toRef);
}

type Intent = {
  match: RegExp;
  answer: string;
  ruleIds: string[];
  followUps?: string[];
};

const INTENTS: Intent[] = [
  {
    match:
      /(переваг|пріоритет|перехрест|right of way|priority|intersection|хто має)/i,
    answer:
      '🚦 У цій ситуації спочатку дивіться на знаки та світлофори. Якщо напрямки рівнозначні і немає регулювальника — перевагу має транспорт, що наближається **справа** (правило правої руки). Не створюйте перешкод тим, хто вже вʼїхав на перехрестя.',
    ruleIds: ['r-16-12', 'r-13-2'],
    followUps: [
      'Що якщо є знак «Головна дорога»?',
      'Хто має перевагу на кільці?',
    ],
  },
  {
    match: /(пішохід|перехід|pedestrian|crosswalk)/i,
    answer:
      '🚶 Якщо пішохід уже вийшов на пішохідний перехід (або починає переходити на регульованому переході за дозволеним сигналом), водій зобовʼязаний дати дорогу. Знизьте швидкість заздалегідь і будьте готові зупинитися.',
    ruleIds: ['r-16-2', 'r-16-12'],
    followUps: ['Чи можна обганяти перед переходом?'],
  },
  {
    match: /(суцільн|solid line|подвійн)/i,
    answer:
      '➖ Перетинати суцільну лінію розмітки заборонено, окрім обʼїзду перешкоди, яку неможливо обʼїхати інакше без порушення безпеки. Для повороту чи розвороту шукайте розрив або дозволену розмітку.',
    ruleIds: ['r-11-4'],
  },
  {
    match: /(швидк|speed|км\/год|50|ліміт)/i,
    answer:
      '⏱️ У населеному пункті загальне обмеження зазвичай **50 км/год**, якщо дорожні знаки не встановлюють інше. Поза населеним пунктом діють інші ліміти — завжди дивіться на знаки.',
    ruleIds: ['r-12-1', 'r-10-2'],
  },
  {
    match: /(жовтий|yellow|світлофор|traffic light)/i,
    answer:
      '🚦 Червоний — стій. Жовтий (крім миготливого) забороняє починати рух; якщо ви вже так близько, що різке гальмування небезпечне — завершіть проїзд обережно. Зелений дозволяє рух, якщо шлях вільний.',
    ruleIds: ['r-9-1', 'r-9-5'],
  },
  {
    match: /(парк|стоянк|parking|тротуар|sidewalk)/i,
    answer:
      '🅿️ Паркування заборонене ближче ніж **10 м** від перехресть і на пішохідних переходах (та в межах 10 м від них). На тротуарі — лише де це дозволено знаками/розміткою і без перешкод пішоходам.',
    ruleIds: ['r-15-4', 'r-15-9'],
  },
  {
    match: /(обгін|overtak)/i,
    answer:
      '↪️ Обгін дозволений зліва, коли зустрічна смуга вільна і маневр не створює небезпеки. Не обганяйте через суцільну, на пішохідних переходах, підйомах із обмеженою видимістю тощо.',
    ruleIds: ['r-14-1', 'r-11-4'],
  },
  {
    match: /(stop|стоп|give way|поступись|уступи)/i,
    answer:
      '🛑 Біля знака STOP потрібно **повністю зупинитися** перед стоп-лінією (або краєм проїзної частини) і пропустити транспорт на пересічній дорозі. Знак «Дати дорогу» вимагає поступитися без обовʼязкової повної зупинки, якщо шлях вільний.',
    ruleIds: ['r-8-3', 'r-16-12'],
  },
  {
    match: /(вʼїзд заборонено|no entry|односторонн|one-way)/i,
    answer:
      '🚫 Знак «Вʼїзд заборонено» означає, що заїжджати на цю ділянку не можна. На дорозі з одностороннім рухом рухайтеся лише у зазначеному напрямку.',
    ruleIds: ['r-8-7'],
  },
];

export function answerAssistantPrompt(prompt: string): AssistantReply {
  const text = prompt.trim();
  if (!text) {
    return {
      text: 'Напишіть питання про дорожню ситуацію — наприклад, хто має перевагу на перехресті.',
      rules: [],
    };
  }

  const intent = INTENTS.find((item) => item.match.test(text));
  if (intent) {
    return {
      text: intent.answer,
      rules: findRulesByIds(intent.ruleIds),
      followUps: intent.followUps,
      relatedLinks: [
        { label: 'Practice this topic', href: '/tests' },
        { label: 'Analyze a road video', href: '/ai-analysis' },
      ],
    };
  }

  // Keyword fallback against rule titles/summaries
  const q = text.toLowerCase();
  const scored = TRAFFIC_RULES.map((rule) => {
    const hay = `${rule.title} ${rule.summary} ${rule.code}`.toLowerCase();
    let score = 0;
    for (const word of q.split(/\s+/)) {
      if (word.length < 3) continue;
      if (hay.includes(word)) score += 1;
    }
    return { rule, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length > 0) {
    const top = scored.slice(0, 2).map((x) => x.rule);
    return {
      text: `🧠 Ось що знайдено за вашим запитом щодо **${top[0].title}**:\n\n${top[0].summary}\n\nРекомендую відкрити повне правило і закріпити тему тестом.`,
      rules: top.map(toRef),
      relatedLinks: [
        { label: 'Open Traffic Rules', href: '/traffic-rules' },
        { label: 'Take a Practice Test', href: '/tests' },
      ],
    };
  }

  return {
    text: '🤔 Я можу пояснити пріоритет, знаки, швидкість, паркування, світлофори та обгін. Сформулюйте ситуацію точніше або завантажте фото знака — і я підкажу відповідне правило ПДР.',
    rules: findRulesByIds(['r-16-12', 'r-8-3']),
    followUps: QUICK_PROMPTS.slice(0, 4).map((p) => p.prompt),
    relatedLinks: [
      { label: 'Browse Traffic Rules', href: '/traffic-rules' },
      { label: 'Upload road video', href: '/ai-analysis' },
    ],
  };
}
