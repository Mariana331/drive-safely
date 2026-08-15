import InfoPage from '@/components/info/InfoPage';

export const metadata = {
  title: 'About Us — DriveSafely',
};

export default function AboutPage() {
  return (
    <InfoPage
      title="About DriveSafely"
      paragraphs={[
        'DriveSafely helps drivers learn traffic rules, practice with tests, and improve through AI video analysis.',
        'Our goal is simple: drive smarter, stay safer — with clear feedback and daily learning habits.',
      ]}
      ctaHref="/#how-it-works"
      ctaLabel="← See how it works"
    />
  );
}
