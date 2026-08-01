import {
  getNewsCatalog,
  findArticleBySlug,
  toListResponse,
} from '@/lib/news/getNewsCatalog';
import { getNewsList } from '@/lib/api/ServerApi';
import NewsPageClient from '@/components/dashboard/news/NewsPageClient';

export const metadata = {
  title: 'News & Updates — DriveSafely',
  description:
    'Official traffic law updates from Verkhovna Rada and HSC MIA, plus road safety and automotive news.',
};

export default async function NewsPage() {
  const apiData = await getNewsList({ page: 1, limit: 50 });
  const catalog = await getNewsCatalog(apiData.articles);
  const initialData = toListResponse(catalog, 1, 50);

  return (
    <NewsPageClient initialData={initialData} allArticles={catalog} />
  );
}
