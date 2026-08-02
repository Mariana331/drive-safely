import type { AssistantReply } from './assistantEngine';
import { answerAssistantPrompt } from './assistantEngine';
import {
  OFFICIAL_SOURCE_RADA,
  TRAFFIC_RULES,
} from '@/lib/traffic-rules/trafficRulesData';

export interface SignDetection {
  signName: string;
  confidence: number;
  ruleIds: string[];
  explanation: string;
}

const SIGN_LIBRARY: {
  keys: RegExp;
  signName: string;
  ruleIds: string[];
  explanation: string;
}[] = [
  {
    keys: /(stop|стоп)/i,
    signName: 'STOP (Stop / Halt)',
    ruleIds: ['r-8-3', 'r-16-12'],
    explanation:
      'Це знак повної зупинки. Зупиніться перед стоп-лінією, оцініть обстановку і лише тоді продовжуйте рух, поступившись транспорту з перевагою.',
  },
  {
    keys: /(yield|give.?way|уступи|дати дорогу|поступись)/i,
    signName: 'Give way',
    ruleIds: ['r-8-3', 'r-16-12'],
    explanation:
      'Знак «Дати дорогу»: пропустіть транспорт на головній / пересічній дорозі. Повна зупинка обовʼязкова лише якщо інакше безпечно проїхати неможливо.',
  },
  {
    keys: /(no.?entry|вʼїзд заборонено|цегла)/i,
    signName: 'No entry',
    ruleIds: ['r-8-7'],
    explanation:
      'Знак «Вʼїзд заборонено» — заїзд на ділянку з цього напрямку заборонений.',
  },
  {
    keys: /(one.?way|односторон)/i,
    signName: 'One-way road',
    ruleIds: ['r-8-7'],
    explanation:
      'Односторонній рух: рухайтеся лише у напрямку стрілки на знаку.',
  },
  {
    keys: /(speed|швидк|50|60|40|70|limit)/i,
    signName: 'Speed limit',
    ruleIds: ['r-12-1', 'r-10-2'],
    explanation:
      'Обмежувальний знак швидкості. Не перевищуйте зазначене значення до знака скасування або іншого ліміту.',
  },
  {
    keys: /(pedestrian|пішохід|перехід|crosswalk)/i,
    signName: 'Pedestrian crossing',
    ruleIds: ['r-16-2'],
    explanation:
      'Попереду пішохідний перехід. Знизьте швидкість і будьте готові дати дорогу пішоходам.',
  },
  {
    keys: /(parking|парк|стоянк)/i,
    signName: 'Parking / No parking',
    ruleIds: ['r-15-4', 'r-15-9'],
    explanation:
      'Знак стосується режиму стоянки/зупинки. Перевірте стрілки й таблички — часто діє лише в певному напрямку чи час.',
  },
  {
    keys: /(light|світлофор|signal)/i,
    signName: 'Traffic signals ahead',
    ruleIds: ['r-9-1'],
    explanation:
      'Попереду регулювання світлофором. Підготуйтеся зменшити швидкість і виконати сигнал.',
  },
];

function refsFromIds(ids: string[]) {
  return TRAFFIC_RULES.filter((r) => ids.includes(r.id)).map((rule) => ({
    id: rule.id,
    code: rule.code,
    title: rule.title,
    href: `/traffic-rules?rule=${rule.id}`,
    officialUrl: OFFICIAL_SOURCE_RADA.url,
  }));
}

/** Lightweight client-side "recognition" from filename / optional hint. */
export function detectSignFromUpload(
  fileName: string,
  userHint = '',
): SignDetection {
  const hay = `${fileName} ${userHint}`;
  const hit = SIGN_LIBRARY.find((item) => item.keys.test(hay));
  if (hit) {
    return {
      signName: hit.signName,
      confidence: 0.86,
      ruleIds: hit.ruleIds,
      explanation: hit.explanation,
    };
  }

  // Default: treat as unknown regulatory sign → send user to signs + priority
  return {
    signName: 'Road sign (needs confirmation)',
    confidence: 0.55,
    ruleIds: ['r-8-3', 'r-16-12'],
    explanation:
      'Я бачу дорожній знак на фото. Точний тип не визначено автоматично — найчастіше в таких ситуаціях перевіряють знаки пріоритету (STOP / Дати дорогу) і правило проїзду перехресть. Нижче — правила для швидкої перевірки; також можете уточнити назву знака в чаті.',
  };
}

export function buildSignReply(detection: SignDetection): AssistantReply {
  return {
    text: `📸 Розпізнано: **${detection.signName}** (≈${Math.round(
      detection.confidence * 100,
    )}%)\n\n${detection.explanation}\n\nПояснення привʼязане до Traffic Rules — відкрийте правило й офіційний текст ПДР.`,
    rules: refsFromIds(detection.ruleIds),
    followUps: [
      'Хто має перевагу на цьому перехресті?',
      'Що означає знак STOP і як діяти?',
    ],
    relatedLinks: [
      { label: 'Browse road signs rules', href: '/traffic-rules' },
      { label: 'Practice signs test', href: '/tests' },
      { label: 'Analyze dashcam video', href: '/ai-analysis' },
    ],
  };
}

export function analyzeSignPhoto(
  fileName: string,
  userHint?: string,
): AssistantReply {
  const detection = detectSignFromUpload(fileName, userHint);
  // Also fold in any free-text hint via chat engine if provided
  if (userHint && userHint.trim().length > 3) {
    const textReply = answerAssistantPrompt(userHint);
    const detectionReply = buildSignReply(detection);
    const mergedRules = [
      ...detectionReply.rules,
      ...textReply.rules.filter(
        (r) => !detectionReply.rules.some((d) => d.id === r.id),
      ),
    ].slice(0, 3);
    return {
      text: `${detectionReply.text}\n\nДо вашого уточнення: ${textReply.text}`,
      rules: mergedRules,
      followUps: detectionReply.followUps,
      relatedLinks: detectionReply.relatedLinks,
    };
  }
  return buildSignReply(detection);
}
