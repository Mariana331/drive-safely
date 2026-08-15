import InfoPage from '@/components/info/InfoPage';

export const metadata = {
  title: 'Help Center — DriveSafely',
};

export default function HelpPage() {
  return (
    <InfoPage
      title="Help Center"
      paragraphs={[
        'Upload a road video for AI analysis, study traffic rules, take practice tests, and track progress in your profile.',
        'For rule questions, open the AI Assistant. For account issues, visit Contact.',
      ]}
      ctaHref="/assistant"
      ctaLabel="→ Ask AI Assistant"
    />
  );
}
