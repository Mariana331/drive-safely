import { cookies } from 'next/headers';
import {
  apiFetch,
  getApiBaseUrl,
  type NewsArticle,
  type NewsListResponse,
  type ProfileData,
} from './api';
import { FALLBACK_NEWS, countByCategory } from '@/lib/news/newsData';

export async function getNews(limit = 10): Promise<NewsArticle[]> {
  try {
    const data = await apiFetch<{ articles: NewsArticle[] }>(
      `/api/news?limit=${limit}`,
      { next: { revalidate: 60 } },
    );
    return data.articles.length > 0 ? data.articles : FALLBACK_NEWS.slice(0, limit);
  } catch {
    return FALLBACK_NEWS.slice(0, limit);
  }
}

export async function getNewsList(params?: {
  page?: number;
  limit?: number;
  category?: string;
  country?: string;
  search?: string;
}): Promise<NewsListResponse> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 6;
  const category = params?.category ?? 'all';
  const country = params?.country ?? 'All Countries';
  const search = params?.search ?? '';

  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      category,
      country,
      ...(search ? { search } : {}),
    });

    const data = await apiFetch<NewsListResponse>(`/api/news?${query}`, {
      next: { revalidate: 60 },
    });

    if (data.articles.length > 0) {
      return data;
    }
  } catch {
    // fall through to local data
  }

  const { filterNewsArticles, paginateArticles } = await import(
    '@/lib/news/newsData'
  );
  const filtered = filterNewsArticles(FALLBACK_NEWS, {
    category,
    country,
    search,
  });
  const paginated = paginateArticles(filtered, page, limit);

  return {
    articles: paginated.items,
    total: paginated.total,
    page: paginated.page,
    limit,
    totalPages: paginated.totalPages,
    categoryCounts: countByCategory(FALLBACK_NEWS),
  };
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

export async function getProfile(): Promise<ProfileData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const response = await fetch(`${getApiBaseUrl()}/api/users/me/profile`, {
      headers: {
        Cookie: `token=${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const json = await response.json();
    return json.data.profile as ProfileData;
  } catch {
    return null;
  }
}
