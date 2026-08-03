import ProfilePageClient from '@/components/dashboard/profile/ProfilePageClient';

export const metadata = {
  title: 'My Profile — DriveSafely',
  description:
    'Track your driver level, safety score, and jump into saved rules, favourites, tests, and video analyses.',
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
