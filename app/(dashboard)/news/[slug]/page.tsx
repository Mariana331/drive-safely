import { notFound } from 'next/navigation';
import { getNewsList, getNewsBySlug } from '@/lib/api/ServerApi';
import {
  getNewsCatalog,
  findArticleBySlug,
} from '@/lib/news/getNewsCatalog';
import NewsArticleClient from '@/components/dashboard/news/NewsArticleClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const apiData = await getNewsList({ page: 1, limit: 50 });
  const catalog = await getNewsCatalog(apiData.articles);
  const article =
    findArticleBySlug(catalog, slug) ?? (await getNewsBySlug(slug));

  if (!article) {
    return { title: 'News — DriveSafely' };
  }

  return {
    title: `${article.title} — DriveSafely`,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const apiData = await getNewsList({ page: 1, limit: 50 });
  const catalog = await getNewsCatalog(apiData.articles);
  const article =
    findArticleBySlug(catalog, slug) ?? (await getNewsBySlug(slug));

  if (!article) {
    notFound();
  }

  return <NewsArticleClient article={article} />;
}
