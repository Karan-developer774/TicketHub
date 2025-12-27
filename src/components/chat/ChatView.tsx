import { useMemo, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical, ArrowLeft, Search, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { Avatar, AvatarGroup } from './Avatar';
import { MessageBubble, DateSeparator, TypingIndicator } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { getOtherParticipant, formatLastSeen } from '@/data/mockData';

export function ChatView() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    activeChat,
    messages,
    currentUser,
    setActiveChat,
    isMobileView,
    setShowProfile,
  } = useChatStore();

  const chatMessages = activeChat ? messages[activeChat.id] || [] : [];

  const displayInfo = useMemo(() => {
    if (!activeChat) return null;
    
    if (activeChat.type === 'group') {
      return {
        name: activeChat.name || 'Group Chat',
        avatar: activeChat.avatar,
        subtitle: `${activeChat.participants.length} participants`,
        isGroup: true,
        participants: activeChat.participants,
      };
    }
    
    const other = getOtherParticipant(activeChat, currentUser.id);
    return {
      name: other?.displayName || 'Unknown',
      avatar: other?.avatar,
      subtitle: other?.isOnline
        ? 'Online'
        : other?.lastSeen
        ? `Last seen ${formatLastSeen(other.lastSeen)}`
        : 'Offline',
      isOnline: other?.isOnline,
      isGroup: false,
    };
  }, [activeChat, currentUser.id]);

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { date: Date; messages: typeof chatMessages }[] = [];
    let currentDate: string | null = null;

    chatMessages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toDateString();
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: new Date(message.createdAt), messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  }, [chatMessages]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!activeChat) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background chat-background">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary-muted flex items-center justify-center shadow-glow">
            <svg
              className="w-12 h-12 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Welcome to <span className="gradient-text">ChatFlow</span>
          </h2>
          <p className="text-muted-foreground">
            Select a conversation from the sidebar to start messaging, or create a new chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background-secondary">
        {isMobileView && (
          <button
            onClick={() => setActiveChat(null)}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <button 
          className="flex items-center gap-3 flex-1 min-w-0"
          onClick={() => setShowProfile(true)}
        >
          {displayInfo?.isGroup ? (
            <AvatarGroup
              avatars={displayInfo.participants?.slice(0, 3).map((p) => ({
                src: p.avatar,
                fallback: p.displayName,
              })) || []}
              size="sm"
            />
          ) : (
            <Avatar
              src={displayInfo?.avatar}
              fallback={displayInfo?.name}
              size="md"
              isOnline={displayInfo?.isOnline}
              showStatus
            />
          )}
          <div className="flex-1 min-w-0 text-left">
            <h2 className="font-semibold text-base truncate">
              {displayInfo?.name}
            </h2>
            <p className={cn(
              'text-xs truncate',
              displayInfo?.isOnline ? 'text-online' : 'text-muted-foreground'
            )}>
              {displayInfo?.subtitle}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <button className="p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 chat-background">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex}>
            <DateSeparator date={group.date} />
            {group.messages.map((message, messageIndex) => {
              const isFirstInGroup =
                messageIndex === 0 ||
                group.messages[messageIndex - 1].senderId !== message.senderId;
              const isLastInGroup =
                messageIndex === group.messages.length - 1 ||
                group.messages[messageIndex + 1].senderId !== message.senderId;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isFirstInGroup={isFirstInGroup}
                  isLastInGroup={isLastInGroup}
                />
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
}
