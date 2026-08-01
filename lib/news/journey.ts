import type { NewsRelatedLink } from '@/lib/api/api';

/** NEWS → Traffic Rule → Practice Test → AI Assistant */
export const NEWS_LEARNING_JOURNEY: NewsRelatedLink[] = [
  {
    type: 'traffic-rule',
    href: '/traffic-rules',
    label: 'Study Traffic Rules',
  },
  {
    type: 'practice-test',
    href: '/tests',
    label: 'Take a Practice Test',
  },
  {
    type: 'ai-assistant',
    href: '/assistant',
    label: 'Ask AI Assistant',
  },
];

/** VIDEO → AI Analysis → Traffic Rule → Practice Test */
export const VIDEO_LEARNING_JOURNEY: NewsRelatedLink[] = [
  {
    type: 'ai-analysis',
    href: '/ai-analysis',
    label: 'Upload Video / AI Analysis',
  },
  {
    type: 'traffic-rule',
    href: '/traffic-rules',
    label: 'Related Traffic Rules',
  },
  {
    type: 'practice-test',
    href: '/tests',
    label: 'Practice Test',
  },
];

export function defaultRelatedForCategory(
  category: string,
): NewsRelatedLink[] {
  if (category === 'Traffic Laws' || category === 'New Law') {
    return [
      {
        type: 'traffic-rule',
        href: '/traffic-rules',
        label: 'Open Traffic Rules',
      },
      {
        type: 'practice-test',
        href: '/tests',
        label: 'Practice on this topic',
      },
      {
        type: 'ai-assistant',
        href: '/assistant',
        label: 'Ask about this law',
      },
    ];
  }

  if (category === 'Road Safety' || category === 'Reminder') {
    return [
      {
        type: 'traffic-rule',
        href: '/traffic-rules',
        label: 'Browse safety rules',
      },
      {
        type: 'practice-test',
        href: '/tests',
        label: 'Test your knowledge',
      },
      {
        type: 'ai-analysis',
        href: '/ai-analysis',
        label: 'Analyze a road video',
      },
    ];
  }

  return NEWS_LEARNING_JOURNEY;
}
