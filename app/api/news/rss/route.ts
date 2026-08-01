import { NextResponse } from 'next/server';
import { fetchRssGeneralNews } from '@/lib/news/rssNews';

export async function GET() {
  const articles = await fetchRssGeneralNews();
  return NextResponse.json(
    {
      status: 200,
      message: 'Success',
      data: { articles, total: articles.length },
    },
    {
      headers: {
        'Cache-Control': 's-maxage=1800, stale-while-revalidate=3600',
      },
    },
  );
}
