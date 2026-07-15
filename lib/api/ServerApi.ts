import { cookies } from 'next/headers';
import { apiFetch, type NewsArticle, type ProfileData, API_URL } from './api';

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

export async function getProfile(): Promise<ProfileData | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const response = await fetch(`${API_URL}/api/users/me/profile`, {
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
