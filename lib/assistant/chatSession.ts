import { readUserJson, writeUserJson } from '@/lib/progress/progressUser';
import type { AssistantReply, AssistantRuleRef } from './assistantEngine';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
  imageDataUrl?: string;
  imageName?: string;
  rules?: AssistantRuleRef[];
  followUps?: string[];
  relatedLinks?: { label: string; href: string }[];
}

const STORAGE_KEY = 'drivesafely_assistant_chat';

export function loadChatMessages(): ChatMessage[] {
  return readUserJson<ChatMessage[]>(STORAGE_KEY, []);
}

export function saveChatMessages(messages: ChatMessage[]) {
  writeUserJson(STORAGE_KEY, messages.slice(-80));
}

export function clearChatMessages() {
  writeUserJson(STORAGE_KEY, []);
}

export function createUserMessage(
  text: string,
  image?: { dataUrl: string; name: string },
): ChatMessage {
  return {
    id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    role: 'user',
    text,
    createdAt: new Date().toISOString(),
    imageDataUrl: image?.dataUrl,
    imageName: image?.name,
  };
}

export function createAssistantMessage(reply: AssistantReply): ChatMessage {
  return {
    id: `a_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    role: 'assistant',
    text: reply.text,
    createdAt: new Date().toISOString(),
    rules: reply.rules,
    followUps: reply.followUps,
    relatedLinks: reply.relatedLinks,
  };
}
