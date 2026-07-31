import TrafficRulesPageClient from '@/components/dashboard/traffic-rules/TrafficRulesPageClient';

export const metadata = {
  title: 'Traffic Rules — DriveSafely',
  description:
    'Browse Ukrainian traffic rules with explanations, official sources from Verkhovna Rada and HSC MIA exam materials.',
};

export default function TrafficRulesPage() {
  return <TrafficRulesPageClient />;
}
