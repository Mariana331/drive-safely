import InfoPage from '@/components/info/InfoPage';

export const metadata = {
  title: 'Contact — DriveSafely',
};

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact"
      paragraphs={[
        'Need help with your account, analysis results, or partnership ideas?',
        'Email us at support@drivesafely.app — we usually reply within 1–2 business days.',
        'You can also ask the in-app AI Assistant about traffic rules anytime.',
      ]}
      ctaHref="/assistant"
      ctaLabel="→ Open AI Assistant"
    />
  );
}
