import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Mic, X, Image, FileText, Camera, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage, activeChat, setTyping } = useChatStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && activeChat) {
      sendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (activeChat) {
      setTyping(activeChat.id, e.target.value.length > 0);
    }
  };

  const attachmentOptions = [
    { icon: Image, label: 'Photo', color: 'text-purple-400' },
    { icon: Camera, label: 'Camera', color: 'text-pink-400' },
    { icon: FileText, label: 'Document', color: 'text-blue-400' },
    { icon: MapPin, label: 'Location', color: 'text-green-400' },
  ];

  return (
    <div className="relative">
      {/* Attachment Menu */}
      {showAttachments && (
        <div className="absolute bottom-full left-0 right-0 p-4 animate-slide-in-up">
          <div className="glass-strong rounded-2xl p-4 shadow-lg border border-border">
            <div className="grid grid-cols-4 gap-4">
              {attachmentOptions.map((option) => (
                <button
                  key={option.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                  onClick={() => setShowAttachments(false)}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full bg-muted flex items-center justify-center",
                    option.color
                  )}>
                    <option.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 md:p-4 border-t border-border bg-background-secondary safe-area-inset-bottom">
        <div className="flex items-end gap-2 md:gap-3">
          {/* Attachment Button */}
          <button
            onClick={() => setShowAttachments(!showAttachments)}
            className={cn(
              "p-2.5 rounded-full transition-all duration-200",
              showAttachments 
                ? "bg-primary text-primary-foreground rotate-45" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {showAttachments ? <X className="w-5 h-5" /> : <Paperclip className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-muted rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-muted-foreground scrollbar-thin"
              style={{ maxHeight: '120px' }}
            />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {}}
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* Send / Voice Button */}
          {message.trim() ? (
            <button
              onClick={handleSend}
              className="p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary-glow transition-all duration-200 shadow-glow animate-scale-in"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                "p-2.5 rounded-full transition-all duration-200",
                isRecording
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-primary text-primary-foreground hover:bg-primary-glow"
              )}
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="flex items-center gap-3 mt-3 px-2 animate-fade-in">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Recording...</span>
            <span className="text-sm font-mono text-foreground">0:05</span>
            <button
              onClick={() => setIsRecording(false)}
              className="ml-auto text-sm text-destructive hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
