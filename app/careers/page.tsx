import InfoPage from '@/components/info/InfoPage';

export const metadata = {
  title: 'Careers — DriveSafely',
};

export default function CareersPage() {
  return (
    <InfoPage
      title="Careers"
      paragraphs={[
        'We are building tools that make roads safer with AI and education.',
        'Interested in joining? Send your CV and a short note to careers@drivesafely.app — we review every application.',
      ]}
      ctaHref="/contact"
      ctaLabel="← Contact us"
    />
  );
}
