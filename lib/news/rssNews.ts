import type { NewsArticle, NewsCategory } from '@/lib/api/api';
import { defaultRelatedForCategory } from './journey';

const FEEDS: { category: NewsCategory; url: string }[] = [
  {
    category: 'Road Safety',
    url: 'https://news.google.com/rss/search?q=road+safety+OR+traffic+safety&hl=en-US&gl=US&ceid=US:en',
  },
  {
    category: 'AI & Automotive',
    url: 'https://news.google.com/rss/search?q=automotive+OR+electric+vehicle+OR+ADAS&hl=en-US&gl=US&ceid=US:en',
  },
  {
    category: 'Traffic News',
    url: 'https://news.google.com/rss/search?q=%D0%9F%D0%94%D0%A0+OR+%D0%B4%D0%BE%D1%80%D0%BE%D0%B6%D0%BD%D1%96%D0%B9+%D1%80%D1%83%D1%85+Ukraine&hl=uk&gl=UA&ceid=UA:uk',
  },
];

function decodeXml(text: string) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(text: string) {
  return decodeXml(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґ]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function extractTag(block: string, tag: string) {
  const cdata = block.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'),
  );
  if (cdata?.[1]) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return plain?.[1]?.trim() ?? '';
}

function parseRssItems(xml: string, category: NewsCategory): NewsArticle[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return items.slice(0, 8).map((item, index) => {
    const title = stripHtml(extractTag(item, 'title')) || 'Untitled';
    const link = stripHtml(extractTag(item, 'link'));
    const description = stripHtml(
      extractTag(item, 'description') || extractTag(item, 'content:encoded'),
    );
    const pubDate = extractTag(item, 'pubDate');
    const publishedAt = pubDate
      ? new Date(pubDate).toISOString()
      : new Date().toISOString();
    const slugBase = slugify(title) || `rss-${category}-${index}`;

    return {
      _id: `rss-${slugBase}-${index}`,
      title,
      slug: `rss-${slugBase}`,
      excerpt: description.slice(0, 220) || title,
      body: `${description}\n\nThis item was imported from a public news feed. Open the original source for the full article.`,
      category,
      imageUrl: '',
      readTimeMinutes: 2,
      country: category === 'Traffic News' ? 'Ukraine' : 'All Countries',
      publishedAt,
      isPublished: true,
      sourceType: 'rss' as const,
      sourceName: 'News feed',
      sourceUrl: link || undefined,
      stream: 'general' as const,
      relatedLinks: defaultRelatedForCategory(category),
    };
  });
}

export async function fetchRssGeneralNews(): Promise<NewsArticle[]> {
  const results: NewsArticle[] = [];

  await Promise.all(
    FEEDS.map(async (feed) => {
      try {
        const res = await fetch(feed.url, {
          next: { revalidate: 1800 },
          headers: {
            'User-Agent': 'DriveSafelyNewsBot/1.0',
            Accept: 'application/rss+xml, application/xml, text/xml, */*',
          },
        });
        if (!res.ok) return;
        const xml = await res.text();
        results.push(...parseRssItems(xml, feed.category));
      } catch {
        // ignore feed failures — official/curated news still work
      }
    }),
  );

  const seen = new Set<string>();
  return results
    .filter((article) => {
      if (seen.has(article.slug)) return false;
      seen.add(article.slug);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}
