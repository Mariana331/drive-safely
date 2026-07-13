import { apiFetch, type NewsArticle } from './api';

export async function getNews(limit = 10): Promise<NewsArticle[]> {
  try {
    const data = await apiFetch<{ articles: NewsArticle[] }>(
      `/api/news?limit=${limit}`,
      { next: { revalidate: 60 } },
    );
    return data.articles;
  } catch {
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const data = await apiFetch<{ article: NewsArticle }>(
      `/api/news/${slug}`,
      { next: { revalidate: 60 } },
    );
    return data.article;
  } catch {
    return null;
  }
}
