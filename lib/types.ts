export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface User {
  name: string;
  phone: string; // generated id used as webhook identifier
  xp: number;
}

export type Mode = 'study' | 'exam';

export interface ApiResponse {
  answer: string;
  student?: string;
  xp?: number;
}
