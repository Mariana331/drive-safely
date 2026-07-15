export type NewsCategory = 'New Law' | 'Update' | 'Reminder';
export type ExperienceLevel = 'new' | 'experienced' | 'professional';

export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: NewsCategory;
  imageUrl: string;
  publishedAt: string;
  isPublished: boolean;
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

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';

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
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const json: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, json.message ?? 'Request failed');
  }

  return json.data as T;
}
