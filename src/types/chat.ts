export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  about?: string;
  lastSeen?: Date;
  isOnline: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'sticker';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: Message;
  reactions?: MessageReaction[];
  isDeleted?: boolean;
  isEdited?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
}

export interface Chat {
  id: string;
  type: 'private' | 'group';
  participants: User[];
  name?: string; // For group chats
  avatar?: string; // For group chats
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingIndicator {
  chatId: string;
  userId: string;
  userName: string;
}

export interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>;
  currentUser: User | null;
  isLoading: boolean;
  typingUsers: TypingIndicator[];
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
}

export interface VoiceMessage {
  id: string;
  duration: number;
  url: string;
  waveform?: number[];
}

export interface CallStatus {
  id: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'ongoing' | 'ended' | 'missed';
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
}
