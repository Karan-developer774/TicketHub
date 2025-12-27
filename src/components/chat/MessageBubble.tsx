import { Check, CheckCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { formatMessageTime } from '@/data/mockData';
import { useChatStore } from '@/store/chatStore';

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

export function MessageBubble({
  message,
  showAvatar = false,
  isFirstInGroup = true,
  isLastInGroup = true,
}: MessageBubbleProps) {
  const currentUser = useChatStore((state) => state.currentUser);
  const isOwn = message.senderId === currentUser.id;

  const StatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3.5 h-3.5 text-time" />;
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-time" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-time" />;
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-primary" />;
      default:
        return null;
    }
  };

  if (message.isDeleted) {
    return (
      <div
        className={cn(
          'flex',
          isOwn ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'max-w-[75%] md:max-w-[65%] px-4 py-2 rounded-2xl',
            isOwn
              ? 'bg-message-outgoing/50 rounded-br-sm'
              : 'bg-message-incoming/50 rounded-bl-sm'
          )}
        >
          <p className="text-sm italic text-muted-foreground">
            🚫 This message was deleted
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex animate-slide-in-up',
        isOwn ? 'justify-end' : 'justify-start',
        !isLastInGroup && 'mb-0.5',
        isLastInGroup && 'mb-2'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] md:max-w-[65%] px-4 py-2 shadow-message',
          isOwn
            ? 'message-bubble-out'
            : 'message-bubble-in',
          // Adjust border radius based on position in group
          isOwn && isFirstInGroup && !isLastInGroup && 'rounded-tr-lg',
          isOwn && !isFirstInGroup && !isLastInGroup && 'rounded-tr-lg rounded-br-lg',
          isOwn && !isFirstInGroup && isLastInGroup && 'rounded-tr-lg',
          !isOwn && isFirstInGroup && !isLastInGroup && 'rounded-tl-lg',
          !isOwn && !isFirstInGroup && !isLastInGroup && 'rounded-tl-lg rounded-bl-lg',
          !isOwn && !isFirstInGroup && isLastInGroup && 'rounded-tl-lg'
        )}
      >
        {message.replyTo && (
          <div className="mb-2 pl-2 border-l-2 border-primary/50 opacity-75">
            <p className="text-xs font-medium text-primary">
              {message.replyTo.senderId === currentUser.id ? 'You' : 'Reply'}
            </p>
            <p className="text-xs line-clamp-1">{message.replyTo.content}</p>
          </div>
        )}
        
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </p>
        
        <div
          className={cn(
            'flex items-center gap-1.5 mt-1',
            isOwn ? 'justify-end' : 'justify-start'
          )}
        >
          <span className="text-[10px] text-time">
            {formatMessageTime(message.createdAt)}
          </span>
          {message.isEdited && (
            <span className="text-[10px] text-time">edited</span>
          )}
          {isOwn && <StatusIcon />}
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 -mb-1">
            {message.reactions.map((reaction, index) => (
              <span
                key={index}
                className="text-sm bg-background/20 rounded-full px-1.5 py-0.5"
              >
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator({ name }: { name?: string }) {
  return (
    <div className="flex items-center gap-3 animate-fade-in">
      <div className="message-bubble-in px-4 py-3 flex items-center gap-2">
        <div className="typing-indicator flex gap-1">
          <span className="w-2 h-2 bg-primary rounded-full" />
          <span className="w-2 h-2 bg-primary rounded-full" />
          <span className="w-2 h-2 bg-primary rounded-full" />
        </div>
        {name && (
          <span className="text-xs text-muted-foreground ml-1">
            {name} is typing...
          </span>
        )}
      </div>
    </div>
  );
}

export function DateSeparator({ date }: { date: Date }) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="flex justify-center my-4">
      <span className="px-3 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-full">
        {formatDate(date)}
      </span>
    </div>
  );
}
