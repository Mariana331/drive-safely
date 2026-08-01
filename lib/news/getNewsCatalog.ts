import type { NewsArticle, NewsListResponse } from '@/lib/api/api';
import { OFFICIAL_LAWS_NEWS } from './officialLaws';
import { fetchRssGeneralNews } from './rssNews';
import {
  FALLBACK_NEWS,
  countByCategory,
  normalizeCategory,
} from './newsData';
import { defaultRelatedForCategory } from './journey';

function enrich(article: NewsArticle): NewsArticle {
  const category = normalizeCategory(article.category);
  const stream =
    article.stream ??
    (category === 'Traffic Laws' || category === 'New Law' ? 'laws' : 'general');

  return {
    ...article,
    category,
    stream,
    sourceType:
      article.sourceType ??
      (stream === 'laws' ? 'legislation' : 'editorial'),
    relatedLinks:
      article.relatedLinks && article.relatedLinks.length > 0
        ? article.relatedLinks
        : defaultRelatedForCategory(category),
    body:
      article.body ??
      `${article.excerpt}\n\nContinue with Traffic Rules, Practice Tests, or the AI Assistant to apply what you learned.`,
  };
}

/** Merge official legislation + RSS general news (+ optional API articles). */
export async function getNewsCatalog(
  apiArticles: NewsArticle[] = [],
): Promise<NewsArticle[]> {
  const rss = await fetchRssGeneralNews();

  const generalFallback = FALLBACK_NEWS.filter((a) => {
    const cat = normalizeCategory(a.category);
    return cat !== 'Traffic Laws' && cat !== 'New Law';
  }).map((a) =>
    enrich({
      ...a,
      stream: 'general',
      sourceType: 'editorial',
    }),
  );

  const fromApi = apiArticles
    .map(enrich)
    .filter((a) => a.stream === 'general');

  const bySlug = new Map<string, NewsArticle>();

  for (const article of [
    ...OFFICIAL_LAWS_NEWS.map(enrich),
    ...rss,
    ...fromApi,
    ...generalFallback,
  ]) {
    if (!bySlug.has(article.slug)) {
      bySlug.set(article.slug, article);
    }
  }

  return [...bySlug.values()].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function findArticleBySlug(
  articles: NewsArticle[],
  slug: string,
): NewsArticle | null {
  return articles.find((a) => a.slug === slug) ?? null;
}

export function toListResponse(
  articles: NewsArticle[],
  page = 1,
  limit = 50,
): NewsListResponse {
  const total = articles.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  return {
    articles: articles.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
    categoryCounts: countByCategory(articles),
  };
}

export function splitNewsStreams(articles: NewsArticle[]) {
  const laws = articles.filter(
    (a) => a.stream === 'laws' || a.category === 'Traffic Laws',
  );
  const general = articles.filter(
    (a) => a.stream !== 'laws' && a.category !== 'Traffic Laws',
  );
  return { laws, general };
}
