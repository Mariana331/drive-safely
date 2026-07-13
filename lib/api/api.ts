export type NewsCategory = 'New Law' | 'Update' | 'Reminder';

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
