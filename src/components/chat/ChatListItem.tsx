import { useMemo } from 'react';
import { Pin, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';
import { useChatStore } from '@/store/chatStore';
import { Avatar, AvatarGroup } from './Avatar';
import { formatMessageTime, getOtherParticipant } from '@/data/mockData';

interface ChatListItemProps {
  chat: Chat;
  isActive?: boolean;
  onClick?: () => void;
}

export function ChatListItem({ chat, isActive, onClick }: ChatListItemProps) {
  const currentUser = useChatStore((state) => state.currentUser);
  
  const displayInfo = useMemo(() => {
    if (chat.type === 'group') {
      return {
        name: chat.name || 'Group Chat',
        avatar: chat.avatar,
        isGroup: true,
        participants: chat.participants,
      };
    }
    const other = getOtherParticipant(chat, currentUser.id);
    return {
      name: other?.displayName || 'Unknown',
      avatar: other?.avatar,
      isOnline: other?.isOnline,
      isGroup: false,
    };
  }, [chat, currentUser.id]);

  const lastMessagePreview = useMemo(() => {
    if (!chat.lastMessage) return '';
    const isOwn = chat.lastMessage.senderId === currentUser.id;
    const prefix = isOwn ? 'You: ' : '';
    
    if (chat.lastMessage.isDeleted) {
      return '🚫 Message deleted';
    }
    
    switch (chat.lastMessage.type) {
      case 'image':
        return `${prefix}📷 Photo`;
      case 'video':
        return `${prefix}🎥 Video`;
      case 'audio':
        return `${prefix}🎵 Audio`;
      case 'document':
        return `${prefix}📄 Document`;
      case 'location':
        return `${prefix}📍 Location`;
      default:
        return `${prefix}${chat.lastMessage.content}`;
    }
  }, [chat.lastMessage, currentUser.id]);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 md:p-4 rounded-xl transition-all duration-200',
        isActive
          ? 'bg-chat-active'
          : 'hover:bg-chat-hover',
        'group'
      )}
    >
      {/* Avatar */}
      {displayInfo.isGroup ? (
        <AvatarGroup
          avatars={displayInfo.participants?.slice(0, 3).map((p) => ({
            src: p.avatar,
            fallback: p.displayName,
          })) || []}
          size="sm"
        />
      ) : (
        <Avatar
          src={displayInfo.avatar}
          fallback={displayInfo.name}
          size="md"
          isOnline={displayInfo.isOnline}
          showStatus
        />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm truncate">
            {displayInfo.name}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {chat.isPinned && (
              <Pin className="w-3 h-3 text-muted-foreground" />
            )}
            {chat.isMuted && (
              <VolumeX className="w-3 h-3 text-muted-foreground" />
            )}
            {chat.lastMessage && (
              <span className={cn(
                'text-xs',
                chat.unreadCount > 0 ? 'text-primary font-medium' : 'text-time'
              )}>
                {formatMessageTime(chat.lastMessage.createdAt)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={cn(
            'text-sm truncate',
            chat.unreadCount > 0 
              ? 'text-foreground font-medium' 
              : 'text-muted-foreground'
          )}>
            {lastMessagePreview || 'Start a conversation'}
          </p>
          {chat.unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
