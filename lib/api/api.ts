export type NewsCategory =
  | 'Traffic News'
  | 'Road Safety'
  | 'Traffic Laws'
  | 'AI & Automotive'
  | 'New Law'
  | 'Update'
  | 'Reminder';

export type NewsSourceType = 'legislation' | 'editorial' | 'rss';

export type NewsStream = 'laws' | 'general';

export type NewsRelatedType =
  | 'traffic-rule'
  | 'practice-test'
  | 'ai-assistant'
  | 'ai-analysis';

export interface NewsRelatedLink {
  type: NewsRelatedType;
  href: string;
  label: string;
}

export type ExperienceLevel = 'new' | 'experienced' | 'professional';

export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body?: string;
  category: NewsCategory;
  imageUrl: string;
  readTimeMinutes?: number;
  country?: string;
  publishedAt: string;
  isPublished: boolean;
  sourceType?: NewsSourceType;
  sourceName?: string;
  sourceUrl?: string;
  stream?: NewsStream;
  relatedLinks?: NewsRelatedLink[];
}

export interface NewsListResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categoryCounts: Record<string, number>;
}

export interface UserStats {
  videosAnalyzed: number;
  videosAnalyzedMonthly: number;
  rulesLearned: number;
  rulesLearnedMonthly: number;
  testsCompleted: number;
  testsCompletedMonthly: number;
  aiQuestions: number;
  aiQuestionsMonthly: number;
  achievementsCount: number;
  achievementsNew: number;
}

export interface UserSkill {
  name: string;
  percent: number;
}

export interface UserAchievement {
  id: string;
  title: string;
  unlocked: boolean;
}

export interface UserActivity {
  type: string;
  text: string;
  createdAt: string;
}

export interface UserStreak {
  current: number;
  lastActiveDate: string | null;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  dateOfBirth?: string;
  country: string;
  driverLicense?: string;
  experienceLevel: ExperienceLevel;
  avatarUrl: string;
  location: string;
  bio: string;
  safetyScore: number;
  xp: number;
  level: string;
  stats: UserStats;
  skills: UserSkill[];
  achievements: UserAchievement[];
  streak: UserStreak;
  activity: UserActivity[];
  createdAt: string;
}

export interface ProfileData {
  user: User;
  stats: UserStats;
  skills: UserSkill[];
  achievements: UserAchievement[];
  streak: UserStreak;
  activity: UserActivity[];
  safetyScore: number;
  xp: number;
  level: string;
  totalAchievements: number;
  unlockedAchievements: number;
  xpToNextLevel: number;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  country: string;
  driverLicense?: string;
  experienceLevel: ExperienceLevel;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T;
}

export function getApiBaseUrl(): string {
  // Browser: always same-origin so auth cookies stay on the frontend domain.
  if (typeof window !== 'undefined') {
    return '';
  }

  const fromEnv =
    process.env.API_INTERNAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();

  if (fromEnv) return fromEnv.replace(/\/$/, '');

  return 'https://drive-safely-node-js.onrender.com';
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  } catch {
    throw new ApiError(
      0,
      'Cannot connect to the server. Start the backend or check API_INTERNAL_URL.',
    );
  }

  const raw = await response.text();
  let json: ApiResponse<T>;
  try {
    json = JSON.parse(raw) as ApiResponse<T>;
  } catch {
    if (response.status === 404) {
      throw new ApiError(
        404,
        'API route not found (404). Redeploy the frontend and set API_INTERNAL_URL on the host.',
      );
    }
    if (response.status === 503 || raw.trimStart().toLowerCase().startsWith('<!')) {
      throw new ApiError(
        response.status || 503,
        'Server is waking up or returned HTML instead of JSON. Wait a few seconds and try again.',
      );
    }
    throw new ApiError(
      response.status,
      `Unexpected server response (${response.status || 'network'}).`,
    );
  }

  if (!response.ok) {
    throw new ApiError(response.status, json.message ?? 'Request failed');
  }

  return json.data as T;
}
