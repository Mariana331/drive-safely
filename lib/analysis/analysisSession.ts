import {
  buildDemoResult,
  type AnalysisResult,
  type AnalysisStatus,
  type RecentUpload,
} from './analysisData';
import { readUserJson, writeUserJson } from '@/lib/progress/progressUser';

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
  return readUserJson<Record<string, AnalysisSession>>(SESSIONS_KEY, {});
}

function writeSessions(sessions: Record<string, AnalysisSession>) {
  writeUserJson(SESSIONS_KEY, sessions);
}

function readRecent(): RecentUpload[] {
  return readUserJson<RecentUpload[]>(RECENT_KEY, []);
}

function writeRecent(items: RecentUpload[]) {
  writeUserJson(RECENT_KEY, items.slice(0, 10));
}

export function listAnalysisSessions(): AnalysisSession[] {
  return Object.values(readSessions()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
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

export function completeAnalysisSession(
  id: string,
  options: { durationSec?: number } = {},
): AnalysisSession | null {
  const session = getAnalysisSession(id);
  if (!session) return null;

  session.status = 'analyzed';
  session.progress = 100;
  session.result = buildDemoResult(id, session.title, {
    fileName: session.fileName,
    fileSize: session.fileSize,
    durationSec: options.durationSec,
  });
  saveAnalysisSession(session);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('drivesafely:progress-updated'));
  }
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
export const ACCEPTED_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/avi',
];
