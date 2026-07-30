import {
  buildDemoResult,
  type AnalysisResult,
  type AnalysisStatus,
  type RecentUpload,
} from './analysisData';

export interface AnalysisSession {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  status: AnalysisStatus;
  progress: number;
  result?: AnalysisResult;
}

const SESSIONS_KEY = 'drivesafely_analysis_sessions';
const RECENT_KEY = 'drivesafely_analysis_recent';

function readSessions(): Record<string, AnalysisSession> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, AnalysisSession>) : {};
  } catch {
    return {};
  }
}

function writeSessions(sessions: Record<string, AnalysisSession>) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function readRecent(): RecentUpload[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as RecentUpload[]) : [];
  } catch {
    return [];
  }
}

function writeRecent(items: RecentUpload[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, 10)));
}

export function createAnalysisSession(file: File): AnalysisSession {
  const id = `an_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const title = file.name.replace(/\.[^.]+$/, '') || 'Road Video';
  const session: AnalysisSession = {
    id,
    title,
    fileName: file.name,
    fileSize: file.size,
    createdAt: new Date().toISOString(),
    status: 'processing',
    progress: 0,
  };

  const sessions = readSessions();
  sessions[id] = session;
  writeSessions(sessions);

  const recent = readRecent();
  recent.unshift({
    id,
    title,
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    status: 'processing',
    thumbnail: '🎥',
  });
  writeRecent(recent);

  return session;
}

export function getAnalysisSession(id: string): AnalysisSession | null {
  return readSessions()[id] ?? null;
}

export function saveAnalysisSession(session: AnalysisSession) {
  const sessions = readSessions();
  sessions[session.id] = session;
  writeSessions(sessions);

  const recent = readRecent();
  const idx = recent.findIndex((item) => item.id === session.id);
  if (idx >= 0) {
    recent[idx] = {
      ...recent[idx],
      status: session.status,
      title: session.title,
    };
    writeRecent(recent);
  }
}

export function completeAnalysisSession(id: string): AnalysisSession | null {
  const session = getAnalysisSession(id);
  if (!session) return null;

  session.status = 'analyzed';
  session.progress = 100;
  session.result = buildDemoResult(id, session.title);
  saveAnalysisSession(session);
  return session;
}

export function getRecentUploads(fallback: RecentUpload[]): RecentUpload[] {
  const recent = readRecent();
  if (recent.length === 0) return fallback;
  return recent;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const MAX_UPLOAD_BYTES = 500 * 1024 * 1024;
export const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'];
