import type { NewsArticle, NewsCategory } from '@/lib/api/api';

export const NEWS_FILTERS: { id: string; label: string; icon?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'Traffic News', label: 'Traffic News', icon: '📰' },
  { id: 'Road Safety', label: 'Road Safety', icon: '🛡️' },
  { id: 'Traffic Laws', label: 'Traffic Laws', icon: '📋' },
  { id: 'AI & Automotive', label: 'AI & Automotive', icon: '🤖' },
];

export const NEWS_COUNTRIES = [
  'All Countries',
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Poland',
  'Ukraine',
];

export const CATEGORY_STYLES: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  'Traffic News': { bg: '#dcfce7', color: '#15803d', label: 'TRAFFIC NEWS' },
  'Road Safety': { bg: '#f3e8ff', color: '#7e22ce', label: 'ROAD SAFETY' },
  'Traffic Laws': { bg: '#ffedd5', color: '#c2410c', label: 'TRAFFIC LAWS' },
  'AI & Automotive': { bg: '#dbeafe', color: '#1d4ed8', label: 'AI & AUTOMOTIVE' },
  'New Law': { bg: '#fef9c3', color: '#a16207', label: 'NEW LAW' },
  Update: { bg: '#dcfce7', color: '#15803d', label: 'UPDATE' },
  Reminder: { bg: '#fee2e2', color: '#b91c1c', label: 'REMINDER' },
};

export const DEFAULT_CATEGORY_COUNTS: Record<string, number> = {
  'Traffic News': 12,
  'Road Safety': 8,
  'Traffic Laws': 6,
  'AI & Automotive': 4,
};

export function formatNewsDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatNewsDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function normalizeCategory(category: NewsCategory): NewsCategory {
  const map: Partial<Record<NewsCategory, NewsCategory>> = {
    'New Law': 'Traffic Laws',
    Update: 'Traffic News',
    Reminder: 'Road Safety',
  };
  return map[category] ?? category;
}

export const FALLBACK_NEWS: NewsArticle[] = [
  {
    _id: '1',
    title: 'New Speed Limit Changes in City Center',
    slug: 'new-speed-limit-changes-city-center',
    excerpt:
      'City officials announced reduced speed limits in downtown areas to improve pedestrian safety and reduce accidents.',
    category: 'Traffic News',
    imageUrl:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 3,
    country: 'United States',
    publishedAt: '2024-05-16T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '2',
    title: 'How to Drive Safely in Rainy Conditions',
    slug: 'drive-safely-rainy-conditions',
    excerpt:
      'Essential tips for maintaining control on wet roads, including proper following distance and braking techniques.',
    category: 'Road Safety',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    country: 'United Kingdom',
    publishedAt: '2024-05-14T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '3',
    title: 'Understanding Right-of-Way Rules',
    slug: 'understanding-right-of-way-rules',
    excerpt:
      'A comprehensive guide to right-of-way at intersections, roundabouts, and pedestrian crossings.',
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 5,
    country: 'Canada',
    publishedAt: '2024-05-12T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '4',
    title: 'AI Dashcams: The Future of Road Safety',
    slug: 'ai-dashcams-future-road-safety',
    excerpt:
      'How artificial intelligence in dashcams is revolutionizing driver monitoring and accident prevention.',
    category: 'AI & Automotive',
    imageUrl:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 6,
    country: 'United States',
    publishedAt: '2024-05-10T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '5',
    title: 'New Parking Regulations in Downtown Area',
    slug: 'new-parking-regulations-downtown',
    excerpt:
      'Updated parking zones and time limits take effect next month. Here is what drivers need to know.',
    category: 'Traffic News',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 3,
    country: 'Germany',
    publishedAt: '2024-05-08T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '6',
    title: 'Winter Driving Tips for Beginners',
    slug: 'winter-driving-tips-beginners',
    excerpt:
      'Prepare for icy roads with these essential winter driving techniques and vehicle preparation tips.',
    category: 'Road Safety',
    imageUrl:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    country: 'Canada',
    publishedAt: '2024-05-06T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '7',
    title: 'Lane Departure Warning Systems Explained',
    slug: 'lane-departure-warning-systems',
    excerpt:
      'Modern ADAS features help prevent accidents. Learn how lane departure warnings work and when to trust them.',
    category: 'AI & Automotive',
    imageUrl:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 5,
    country: 'United States',
    publishedAt: '2024-05-04T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '8',
    title: 'Updated Highway Code for 2024',
    slug: 'updated-highway-code-2024',
    excerpt:
      'Key changes to the highway code including new rules for cyclists, pedestrians, and electric vehicles.',
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 7,
    country: 'United Kingdom',
    publishedAt: '2024-05-02T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '9',
    title: 'Pedestrian Crosswalk Safety Campaign Launches',
    slug: 'pedestrian-crosswalk-safety-campaign',
    excerpt:
      'National campaign raises awareness about yielding to pedestrians at marked and unmarked crosswalks.',
    category: 'Road Safety',
    imageUrl:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 3,
    country: 'France',
    publishedAt: '2024-04-30T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '10',
    title: 'Electric Vehicle Charging Lane Rules',
    slug: 'ev-charging-lane-rules',
    excerpt:
      'New regulations clarify who can use EV charging lanes and penalties for misuse by non-electric vehicles.',
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    country: 'Germany',
    publishedAt: '2024-04-28T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '11',
    title: 'Night Driving: Visibility and Headlight Use',
    slug: 'night-driving-visibility-headlights',
    excerpt:
      'Improve your night driving safety with proper headlight settings, anti-glare techniques, and fatigue management.',
    category: 'Road Safety',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 5,
    country: 'Poland',
    publishedAt: '2024-04-26T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '12',
    title: 'Traffic Congestion Pricing Starts in Major Cities',
    slug: 'traffic-congestion-pricing-major-cities',
    excerpt:
      'Several cities introduce congestion pricing to reduce traffic during peak hours. See how it affects your commute.',
    category: 'Traffic News',
    imageUrl:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    country: 'United States',
    publishedAt: '2024-04-24T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '13',
    title: 'Self-Driving Cars: Current Legal Status',
    slug: 'self-driving-cars-legal-status',
    excerpt:
      'An overview of autonomous vehicle regulations across different countries and what drivers should expect.',
    category: 'AI & Automotive',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 8,
    country: 'United States',
    publishedAt: '2024-04-22T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '14',
    title: 'School Zone Speed Limits: What You Need to Know',
    slug: 'school-zone-speed-limits',
    excerpt:
      'School zone speed limits are strictly enforced. Learn the rules, times, and penalties for violations.',
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 3,
    country: 'Canada',
    publishedAt: '2024-04-20T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '15',
    title: 'Distracted Driving Statistics for 2024',
    slug: 'distracted-driving-statistics-2024',
    excerpt:
      'Latest data shows phone use remains the leading cause of distracted driving incidents nationwide.',
    category: 'Traffic News',
    imageUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    country: 'United States',
    publishedAt: '2024-04-18T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '16',
    title: 'Defensive Driving Course Benefits',
    slug: 'defensive-driving-course-benefits',
    excerpt:
      'Taking a defensive driving course can lower insurance premiums and improve your safety score.',
    category: 'Road Safety',
    imageUrl:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 5,
    country: 'United Kingdom',
    publishedAt: '2024-04-16T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '17',
    title: 'Roundabout Navigation: Common Mistakes',
    slug: 'roundabout-navigation-mistakes',
    excerpt:
      'Avoid the most common roundabout errors including wrong lane choice and failure to yield.',
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    country: 'Germany',
    publishedAt: '2024-04-14T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '18',
    title: 'Smart Traffic Lights Coming to Your City',
    slug: 'smart-traffic-lights-your-city',
    excerpt:
      'AI-powered traffic lights adapt to real-time traffic flow, reducing wait times and emissions.',
    category: 'AI & Automotive',
    imageUrl:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 5,
    country: 'France',
    publishedAt: '2024-04-12T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '19',
    title: 'Motorcycle Safety Awareness Month',
    slug: 'motorcycle-safety-awareness-month',
    excerpt:
      'Drivers and riders share responsibility on the road. Key tips for safely sharing lanes with motorcycles.',
    category: 'Road Safety',
    imageUrl:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 3,
    country: 'United States',
    publishedAt: '2024-04-10T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '20',
    title: 'New DUI Penalties Take Effect',
    slug: 'new-dui-penalties',
    excerpt:
      'Stricter DUI laws include mandatory ignition interlock devices and longer license suspensions.',
    category: 'Traffic Laws',
    imageUrl:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 6,
    country: 'United States',
    publishedAt: '2024-04-08T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '21',
    title: 'Highway Construction Zones: Safety Guide',
    slug: 'highway-construction-zones-safety',
    excerpt:
      'Navigate construction zones safely with reduced speeds, lane changes, and worker awareness tips.',
    category: 'Traffic News',
    imageUrl:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 4,
    country: 'Canada',
    publishedAt: '2024-04-06T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '22',
    title: 'Blind Spot Detection Technology Review',
    slug: 'blind-spot-detection-review',
    excerpt:
      'We compare the latest blind spot monitoring systems and how they integrate with driver awareness.',
    category: 'AI & Automotive',
    imageUrl:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 7,
    country: 'Germany',
    publishedAt: '2024-04-04T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '23',
    title: 'Child Car Seat Regulations Updated',
    slug: 'child-car-seat-regulations-updated',
    excerpt:
      'New guidelines for rear-facing seats and booster requirements aim to better protect young passengers.',
    category: 'Road Safety',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 5,
    country: 'United Kingdom',
    publishedAt: '2024-04-02T00:00:00.000Z',
    isPublished: true,
  },
  {
    _id: '24',
    title: 'Toll Road Electronic Payment Expansion',
    slug: 'toll-road-electronic-payment',
    excerpt:
      'More highways are going cashless. Learn how to set up electronic toll accounts and avoid penalties.',
    category: 'Traffic News',
    imageUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    readTimeMinutes: 3,
    country: 'Poland',
    publishedAt: '2024-04-01T00:00:00.000Z',
    isPublished: true,
  },
];

export function filterNewsArticles(
  articles: NewsArticle[],
  {
    category,
    country,
    search,
  }: { category: string; country: string; search: string },
) {
  const query = search.trim().toLowerCase();

  return articles.filter((article) => {
    const matchesCategory =
      category === 'all' || article.category === category;
    const matchesCountry =
      country === 'All Countries' || article.country === country;
    const matchesSearch =
      !query ||
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query);

    return matchesCategory && matchesCountry && matchesSearch;
  });
}

export function paginateArticles<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    total,
    page: safePage,
    totalPages,
  };
}

export function countByCategory(articles: NewsArticle[]) {
  return articles.reduce<Record<string, number>>((acc, article) => {
    acc[article.category] = (acc[article.category] ?? 0) + 1;
    return acc;
  }, {});
}
