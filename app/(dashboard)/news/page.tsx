import { getNewsList } from '@/lib/api/ServerApi';
import { FALLBACK_NEWS } from '@/lib/news/newsData';
import NewsPageClient from '@/components/dashboard/news/NewsPageClient';

export const metadata = {
  title: 'News & Updates — DriveSafely',
  description:
    'Stay informed about traffic rules, safety tips, and driving news.',
};

export default async function NewsPage() {
  const allData = await getNewsList({ page: 1, limit: 50 });
  const allArticles =
    allData.articles.length > 0 ? allData.articles : FALLBACK_NEWS;

  return (
    <NewsPageClient
      initialData={allData}
      allArticles={allArticles}
    />
  );
}
