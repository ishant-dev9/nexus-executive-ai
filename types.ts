
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export interface StructuredResponse {
  plan: string[];
  execution: string;
  verification: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string | StructuredResponse;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}
