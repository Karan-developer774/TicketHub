import { useState } from 'react';
import { X, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { Avatar } from './Avatar';
import { mockUsers } from '@/data/mockData';

export function NewChatModal() {
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const { setShowNewChat, currentUser } = useChatStore();

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.id !== currentUser.id &&
      (user.displayName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreate = () => {
    // In a real app, this would create a new chat
    console.log('Creating chat with:', selectedUsers, isGroup ? groupName : '');
    setShowNewChat(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-background-secondary rounded-2xl shadow-lg border border-border animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display font-bold text-lg">New Conversation</h2>
          <button
            onClick={() => setShowNewChat(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Group Toggle */}
        <div className="p-4 border-b border-border">
          <button
            onClick={() => setIsGroup(!isGroup)}
            className={cn(
              'flex items-center gap-3 w-full p-3 rounded-xl transition-colors',
              isGroup ? 'bg-primary/10' : 'hover:bg-muted'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                isGroup ? 'bg-primary' : 'bg-muted'
              )}
            >
              <svg
                className={cn(
                  'w-5 h-5',
                  isGroup ? 'text-primary-foreground' : 'text-muted-foreground'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium">Create Group Chat</p>
              <p className="text-sm text-muted-foreground">
                Chat with multiple people
              </p>
            </div>
          </button>

          {isGroup && (
            <input
              type="text"
              placeholder="Group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full mt-3 px-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
          )}
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Selected Users */}
        {selectedUsers.length > 0 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {selectedUsers.map((userId) => {
              const user = mockUsers.find((u) => u.id === userId);
              if (!user) return null;
              return (
                <button
                  key={userId}
                  onClick={() => toggleUser(userId)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm animate-scale-in"
                >
                  <span>{user.displayName}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        )}

        {/* User List */}
        <div className="max-h-64 overflow-y-auto scrollbar-thin">
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => toggleUser(user.id)}
              className={cn(
                'w-full flex items-center gap-3 p-4 transition-colors',
                selectedUsers.includes(user.id)
                  ? 'bg-primary/5'
                  : 'hover:bg-muted/50'
              )}
            >
              <Avatar
                src={user.avatar}
                fallback={user.displayName}
                size="md"
                isOnline={user.isOnline}
                showStatus
              />
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{user.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.about || user.email}
                </p>
              </div>
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                  selectedUsers.includes(user.id)
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground'
                )}
              >
                {selectedUsers.includes(user.id) && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground text-sm">No contacts found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleCreate}
            disabled={selectedUsers.length === 0 || (isGroup && !groupName.trim())}
            className={cn(
              'w-full py-3 rounded-xl font-semibold transition-all duration-200',
              selectedUsers.length > 0 && (!isGroup || groupName.trim())
                ? 'bg-primary text-primary-foreground hover:bg-primary-glow shadow-glow'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            {isGroup
              ? `Create Group (${selectedUsers.length} selected)`
              : selectedUsers.length > 0
              ? 'Start Chat'
              : 'Select Contact'}
          </button>
        </div>
      </div>
    </div>
  );
}
