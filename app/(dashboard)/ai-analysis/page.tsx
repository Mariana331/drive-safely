import UploadVideoPageClient from '@/components/dashboard/analysis/UploadVideoPageClient';

export const metadata = {
  title: 'Upload Video — DriveSafely',
  description:
    'Upload your road video. Get AI analysis and learn how to drive safer.',
};

export default function AiAnalysisPage() {
  return <UploadVideoPageClient />;
}
