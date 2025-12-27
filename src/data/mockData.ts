import { User, Chat, Message } from '@/types/chat';

export const currentUser: User = {
  id: 'current-user',
  email: 'john.doe@example.com',
  displayName: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  about: 'Hey there! I am using ChatFlow',
  isOnline: true,
  createdAt: new Date('2024-01-01'),
};

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'sarah.wilson@example.com',
    displayName: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    about: 'Living my best life ✨',
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    email: 'mike.johnson@example.com',
    displayName: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    about: 'Software Developer | Coffee Lover',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000),
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'user-3',
    email: 'emma.davis@example.com',
    displayName: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    about: 'Photographer & Traveler 📷',
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'user-4',
    email: 'alex.chen@example.com',
    displayName: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    about: 'Tech enthusiast 🚀',
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000),
    createdAt: new Date('2024-03-01'),
  },
  {
    id: 'user-5',
    email: 'lisa.martinez@example.com',
    displayName: 'Lisa Martinez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    about: 'Designer | Art lover 🎨',
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date('2024-03-15'),
  },
  {
    id: 'user-6',
    email: 'david.brown@example.com',
    displayName: 'David Brown',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    about: 'Music is life 🎵',
    isOnline: false,
    lastSeen: new Date(Date.now() - 86400000),
    createdAt: new Date('2024-04-01'),
  },
];

export const mockMessages: Record<string, Message[]> = {
  'chat-1': [
    {
      id: 'msg-1',
      chatId: 'chat-1',
      senderId: 'user-1',
      content: 'Hey! How are you doing? 😊',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 3600000 * 2),
    },
    {
      id: 'msg-2',
      chatId: 'chat-1',
      senderId: 'current-user',
      content: 'Hi Sarah! I\'m doing great, thanks for asking. How about you?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 3600000 * 1.5),
    },
    {
      id: 'msg-3',
      chatId: 'chat-1',
      senderId: 'user-1',
      content: 'I\'m wonderful! Just finished a great workout 💪',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: 'msg-4',
      chatId: 'chat-1',
      senderId: 'current-user',
      content: 'That\'s awesome! I need to get back to the gym myself',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 1800000),
    },
    {
      id: 'msg-5',
      chatId: 'chat-1',
      senderId: 'user-1',
      content: 'We should go together sometime! It\'s more fun with a buddy',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 900000),
    },
    {
      id: 'msg-6',
      chatId: 'chat-1',
      senderId: 'current-user',
      content: 'That sounds like a great idea! When are you usually free?',
      type: 'text',
      status: 'delivered',
      createdAt: new Date(Date.now() - 300000),
    },
  ],
  'chat-2': [
    {
      id: 'msg-7',
      chatId: 'chat-2',
      senderId: 'user-2',
      content: 'Did you see the new React update?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      id: 'msg-8',
      chatId: 'chat-2',
      senderId: 'current-user',
      content: 'Not yet! What\'s new?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 7000000),
    },
    {
      id: 'msg-9',
      chatId: 'chat-2',
      senderId: 'user-2',
      content: 'They improved the compiler performance significantly. Check out the blog post!',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 6800000),
    },
  ],
  'chat-3': [
    {
      id: 'msg-10',
      chatId: 'chat-3',
      senderId: 'user-3',
      content: 'Check out this amazing sunset I captured! 🌅',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: 'msg-11',
      chatId: 'chat-3',
      senderId: 'current-user',
      content: 'Wow, that\'s stunning! Where was this taken?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 82800000),
    },
    {
      id: 'msg-12',
      chatId: 'chat-3',
      senderId: 'user-3',
      content: 'At the beach near my place. You should visit sometime!',
      type: 'text',
      status: 'delivered',
      createdAt: new Date(Date.now() - 79200000),
    },
  ],
  'chat-4': [
    {
      id: 'msg-13',
      chatId: 'chat-4',
      senderId: 'user-4',
      content: 'The new AI features are mind-blowing! 🤯',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 172800000),
    },
  ],
  'chat-5': [
    {
      id: 'msg-14',
      chatId: 'chat-5',
      senderId: 'user-5',
      content: 'I finished the design mockups. Want to review them?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 259200000),
    },
    {
      id: 'msg-15',
      chatId: 'chat-5',
      senderId: 'current-user',
      content: 'Yes please! Send them over',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 255600000),
    },
  ],
  'chat-group-1': [
    {
      id: 'msg-16',
      chatId: 'chat-group-1',
      senderId: 'user-1',
      content: 'Hey team! Ready for the meeting?',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 1800000),
    },
    {
      id: 'msg-17',
      chatId: 'chat-group-1',
      senderId: 'user-2',
      content: 'Yes! Just finishing up some notes',
      type: 'text',
      status: 'read',
      createdAt: new Date(Date.now() - 1500000),
    },
    {
      id: 'msg-18',
      chatId: 'chat-group-1',
      senderId: 'current-user',
      content: 'On my way! 🏃',
      type: 'text',
      status: 'delivered',
      createdAt: new Date(Date.now() - 1200000),
    },
  ],
};

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    type: 'private',
    participants: [currentUser, mockUsers[0]],
    lastMessage: mockMessages['chat-1'][mockMessages['chat-1'].length - 1],
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: 'chat-2',
    type: 'private',
    participants: [currentUser, mockUsers[1]],
    lastMessage: mockMessages['chat-2'][mockMessages['chat-2'].length - 1],
    unreadCount: 3,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(Date.now() - 6800000),
  },
  {
    id: 'chat-3',
    type: 'private',
    participants: [currentUser, mockUsers[2]],
    lastMessage: mockMessages['chat-3'][mockMessages['chat-3'].length - 1],
    unreadCount: 1,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date(Date.now() - 79200000),
  },
  {
    id: 'chat-group-1',
    type: 'group',
    participants: [currentUser, mockUsers[0], mockUsers[1], mockUsers[2]],
    name: 'Project Team 🚀',
    lastMessage: mockMessages['chat-group-1'][mockMessages['chat-group-1'].length - 1],
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(Date.now() - 1200000),
  },
  {
    id: 'chat-4',
    type: 'private',
    participants: [currentUser, mockUsers[3]],
    lastMessage: mockMessages['chat-4'][mockMessages['chat-4'].length - 1],
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    isArchived: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'chat-5',
    type: 'private',
    participants: [currentUser, mockUsers[4]],
    lastMessage: mockMessages['chat-5'][mockMessages['chat-5'].length - 1],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date(Date.now() - 255600000),
  },
];

export const getOtherParticipant = (chat: Chat, currentUserId: string): User | undefined => {
  return chat.participants.find(p => p.id !== currentUserId);
};

export const formatMessageTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export const formatLastSeen = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
