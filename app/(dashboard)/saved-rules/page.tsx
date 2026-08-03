import SavedRulesPageClient from '@/components/dashboard/traffic-rules/SavedRulesPageClient';

export const metadata = {
  title: 'Saved Rules — DriveSafely',
  description:
    'Review the traffic rules you bookmarked while studying Ukrainian traffic laws.',
};

export default function SavedRulesPage() {
  return <SavedRulesPageClient />;
}
