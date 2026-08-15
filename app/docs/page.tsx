import InfoPage from '@/components/info/InfoPage';

export const metadata = {
  title: 'Documentation — DriveSafely',
};

export default function DocsPage() {
  return (
    <InfoPage
      title="Documentation"
      paragraphs={[
        'Product guides live inside the app: Traffic Rules, Practice Tests, AI Analysis, and the AI Assistant.',
        'Backend API documentation (Swagger) is available when the API server is running at http://localhost:3002/api-docs.',
      ]}
      ctaHref="/traffic-rules"
      ctaLabel="→ Browse Traffic Rules"
    />
  );
}
