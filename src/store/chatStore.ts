import { create } from 'zustand';
import { Chat, Message, User, TypingIndicator } from '@/types/chat';
import { mockChats, mockMessages, currentUser } from '@/data/mockData';

interface ChatStore {
  // State
  chats: Chat[];
  activeChat: Chat | null;
  messages: Record<string, Message[]>;
  currentUser: User;
  typingUsers: TypingIndicator[];
  isLoading: boolean;
  searchQuery: string;
  showProfile: boolean;
  showNewChat: boolean;
  showSettings: boolean;
  isMobileView: boolean;
  showChatOnMobile: boolean;
  
  // Actions
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string, type?: Message['type']) => void;
  setSearchQuery: (query: string) => void;
  setShowProfile: (show: boolean) => void;
  setShowNewChat: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  setIsMobileView: (isMobile: boolean) => void;
  setShowChatOnMobile: (show: boolean) => void;
  markAsRead: (chatId: string) => void;
  deleteMessage: (messageId: string) => void;
  pinChat: (chatId: string) => void;
  muteChat: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: mockChats,
  activeChat: null,
  messages: mockMessages,
  currentUser: currentUser,
  typingUsers: [],
  isLoading: false,
  searchQuery: '',
  showProfile: false,
  showNewChat: false,
  showSettings: false,
  isMobileView: false,
  showChatOnMobile: false,

  setActiveChat: (chat) => {
    set({ activeChat: chat, showChatOnMobile: !!chat });
    if (chat) {
      get().markAsRead(chat.id);
    }
  },

  sendMessage: (content, type = 'text') => {
    const { activeChat, currentUser, messages, chats } = get();
    if (!activeChat || !content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChat.id,
      senderId: currentUser.id,
      content: content.trim(),
      type,
      status: 'sending',
      createdAt: new Date(),
    };

    // Add message to the chat
    const chatMessages = messages[activeChat.id] || [];
    const updatedMessages = {
      ...messages,
      [activeChat.id]: [...chatMessages, newMessage],
    };

    // Update chat's last message
    const updatedChats = chats.map(chat =>
      chat.id === activeChat.id
        ? { ...chat, lastMessage: newMessage, updatedAt: new Date() }
        : chat
    );

    set({ messages: updatedMessages, chats: updatedChats });

    // Simulate message being sent
    setTimeout(() => {
      set(state => ({
        messages: {
          ...state.messages,
          [activeChat.id]: state.messages[activeChat.id].map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
          ),
        },
      }));
    }, 500);

    // Simulate message being delivered
    setTimeout(() => {
      set(state => ({
        messages: {
          ...state.messages,
          [activeChat.id]: state.messages[activeChat.id].map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          ),
        },
      }));
    }, 1500);
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setShowProfile: (show) => set({ showProfile: show }),

  setShowNewChat: (show) => set({ showNewChat: show }),

  setShowSettings: (show) => set({ showSettings: show }),

  setIsMobileView: (isMobile) => set({ isMobileView: isMobile }),

  setShowChatOnMobile: (show) => set({ showChatOnMobile: show }),

  markAsRead: (chatId) => {
    set(state => ({
      chats: state.chats.map(chat =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ),
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map(msg => ({
          ...msg,
          status: msg.senderId !== state.currentUser.id ? 'read' : msg.status,
        })),
      },
    }));
  },

  deleteMessage: (messageId) => {
    set(state => {
      const updatedMessages: Record<string, Message[]> = {};
      Object.entries(state.messages).forEach(([chatId, msgs]) => {
        updatedMessages[chatId] = msgs.map(msg =>
          msg.id === messageId ? { ...msg, isDeleted: true, content: 'This message was deleted' } : msg
        );
      });
      return { messages: updatedMessages };
    });
  },

  pinChat: (chatId) => {
    set(state => ({
      chats: state.chats.map(chat =>
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      ),
    }));
  },

  muteChat: (chatId) => {
    set(state => ({
      chats: state.chats.map(chat =>
        chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
      ),
    }));
  },

  archiveChat: (chatId) => {
    set(state => ({
      chats: state.chats.map(chat =>
        chat.id === chatId ? { ...chat, isArchived: !chat.isArchived } : chat
      ),
    }));
  },

  addReaction: (messageId, emoji) => {
    const { currentUser } = get();
    set(state => {
      const updatedMessages: Record<string, Message[]> = {};
      Object.entries(state.messages).forEach(([chatId, msgs]) => {
        updatedMessages[chatId] = msgs.map(msg => {
          if (msg.id !== messageId) return msg;
          
          const reactions = msg.reactions || [];
          const existingReaction = reactions.find(r => r.userId === currentUser.id);
          
          if (existingReaction) {
            if (existingReaction.emoji === emoji) {
              // Remove reaction
              return { ...msg, reactions: reactions.filter(r => r.userId !== currentUser.id) };
            } else {
              // Change reaction
              return {
                ...msg,
                reactions: reactions.map(r =>
                  r.userId === currentUser.id ? { ...r, emoji } : r
                ),
              };
            }
          } else {
            // Add reaction
            return { ...msg, reactions: [...reactions, { userId: currentUser.id, emoji }] };
          }
        });
      });
      return { messages: updatedMessages };
    });
  },

  setTyping: (chatId, isTyping) => {
    // This would be connected to Socket.io in a real implementation
    console.log(`Typing in ${chatId}: ${isTyping}`);
  },
}));
