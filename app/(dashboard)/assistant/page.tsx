import { Suspense } from 'react';
import AssistantPageClient from '@/components/dashboard/assistant/AssistantPageClient';

export const metadata = {
  title: 'AI Assistant — DriveSafely',
  description:
    'Ask driving questions, upload road sign photos, and get answers linked to official Traffic Rules.',
};

export default function AssistantPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading assistant…</div>}>
      <AssistantPageClient />
    </Suspense>
  );
}
