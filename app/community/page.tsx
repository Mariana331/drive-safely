import InfoPage from '@/components/info/InfoPage';

export const metadata = {
  title: 'Community — DriveSafely',
};

export default function CommunityPage() {
  return (
    <InfoPage
      title="Community"
      paragraphs={[
        'Follow road-safety updates in News, share progress with friends, and keep learning every day.',
        'Join discussions around new rules and safer driving habits — start with the latest articles.',
      ]}
      ctaHref="/news"
      ctaLabel="→ Read News"
    />
  );
}
