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

const CATEGORY_FALLBACK_IMAGES: Record<NewsCategory, string[]> = {
  'Traffic News': [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
  ],
  'Road Safety': [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  ],
  'Traffic Laws': [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  ],
  'AI & Automotive': [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  ],
  'New Law': [
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
  ],
  Update: [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
  ],
  Reminder: [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
  ],
};

function decodeXml(text: string) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => {
      const n = Number(code);
      return Number.isFinite(n) ? String.fromCharCode(n) : '';
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const n = parseInt(hex, 16);
      return Number.isFinite(n) ? String.fromCharCode(n) : '';
    });
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

function normalizeImageUrl(raw: string): string | null {
  if (!raw) return null;
  let url = decodeXml(raw).trim().replace(/^['"]|['"]$/g, '');
  if (url.startsWith('//')) url = `https:${url}`;
  if (!/^https?:\/\//i.test(url)) return null;
  // Skip tracking pixels / tiny icons
  if (/1x1|pixel\.|spacer|blank\.gif/i.test(url)) return null;
  return url;
}

/** Pull the best image URL from a single RSS <item> block. */
function extractImageUrl(item: string): string | null {
  const mediaContent =
    item.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] ??
    item.match(/<media:content[^>]+url=([^\s>]+)/i)?.[1];
  const mediaThumb =
    item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] ??
    item.match(/<media:thumbnail[^>]+url=([^\s>]+)/i)?.[1];
  const enclosure = item.match(
    /<enclosure[^>]+(?:type=["']image\/[^"']*["'][^>]+url=["']([^"']+)["']|url=["']([^"']+)["'][^>]+type=["']image\/[^"']*["'])/i,
  );
  const enclosureUrl = enclosure?.[1] || enclosure?.[2];

  const rawDescription =
    extractTag(item, 'description') || extractTag(item, 'content:encoded');
  const decodedDesc = decodeXml(rawDescription);
  const imgFromHtml =
    decodedDesc.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ??
    decodedDesc.match(/<img[^>]+src=([^\s>]+)/i)?.[1];

  const ogImage =
    decodedDesc.match(
      /property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ??
    decodedDesc.match(
      /content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    )?.[1];

  for (const candidate of [
    mediaContent,
    mediaThumb,
    enclosureUrl,
    imgFromHtml,
    ogImage,
  ]) {
    const normalized = candidate ? normalizeImageUrl(candidate) : null;
    if (normalized) return normalized;
  }

  return null;
}

function fallbackImage(category: NewsCategory, index: number) {
  const list = CATEGORY_FALLBACK_IMAGES[category] ?? CATEGORY_FALLBACK_IMAGES['Traffic News'];
  return list[index % list.length];
}

function parseRssItems(xml: string, category: NewsCategory): NewsArticle[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return items.slice(0, 8).map((item, index) => {
    const title = stripHtml(extractTag(item, 'title')) || 'Untitled';
    const link = stripHtml(extractTag(item, 'link'));
    const rawDescription =
      extractTag(item, 'description') || extractTag(item, 'content:encoded');
    const description = stripHtml(rawDescription);
    const pubDate = extractTag(item, 'pubDate');
    const publishedAt = pubDate
      ? new Date(pubDate).toISOString()
      : new Date().toISOString();
    const slugBase = slugify(title) || `rss-${category}-${index}`;
    const imageUrl =
      extractImageUrl(item) ?? fallbackImage(category, index);

    return {
      _id: `rss-${slugBase}-${index}`,
      title,
      slug: `rss-${slugBase}`,
      excerpt: description.slice(0, 220) || title,
      body: `${description}\n\nThis item was imported from a public news feed. Open the original source for the full article.`,
      category,
      imageUrl,
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
