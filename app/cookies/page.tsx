import InfoPage from '@/components/info/InfoPage';

export const metadata = {
  title: 'Cookie Policy — DriveSafely',
};

export default function CookiesPage() {
  return (
    <InfoPage
      title="Cookie Policy"
      paragraphs={[
        'DriveSafely uses essential cookies for authentication (login session) and preferences such as language and theme.',
        'These cookies are required for the product to work securely. We do not use third-party advertising cookies.',
        'You can clear cookies in your browser settings at any time; you may need to log in again afterward.',
      ]}
      ctaHref="/privacy"
      ctaLabel="← Privacy Policy"
    />
  );
}
