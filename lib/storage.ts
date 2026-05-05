import { Conversation, User } from './types';

const USER_KEY = 'edumate:user';
const CONVERSATIONS_KEY = 'edumate:conversations';

export function generatePhoneId(): string {
  // Generate a 10-digit pseudo phone number used purely as a stable user id.
  let id = '';
  for (let i = 0; i < 10; i++) id += Math.floor(Math.random() * 10).toString();
  return `9${id.slice(0, 9)}`;
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateUserXP(xp: number): void {
  const user = getUser();
  if (!user) return;
  saveUser({ ...user, xp });
}

export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function upsertConversation(conv: Conversation): Conversation[] {
  const all = getConversations();
  const idx = all.findIndex((c) => c.id === conv.id);
  if (idx >= 0) all[idx] = conv;
  else all.unshift(conv);
  saveConversations(all);
  return all;
}

export function deleteConversation(id: string): Conversation[] {
  const all = getConversations().filter((c) => c.id !== id);
  saveConversations(all);
  return all;
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
