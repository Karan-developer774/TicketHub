import { useState, useMemo } from 'react';
import { Search, Plus, Archive, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { ChatListItem } from './ChatListItem';
import { Avatar } from './Avatar';

export function ChatSidebar() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');
  const {
    chats,
    activeChat,
    setActiveChat,
    searchQuery,
    setSearchQuery,
    currentUser,
    setShowNewChat,
    setShowSettings,
    setShowProfile,
  } = useChatStore();

  const filteredChats = useMemo(() => {
    let result = chats.filter((chat) => !chat.isArchived);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((chat) => {
        if (chat.type === 'group' && chat.name) {
          return chat.name.toLowerCase().includes(query);
        }
        const participant = chat.participants.find(
          (p) => p.id !== currentUser.id
        );
        return participant?.displayName.toLowerCase().includes(query);
      });
    }

    // Apply category filter
    if (filter === 'unread') {
      result = result.filter((chat) => chat.unreadCount > 0);
    } else if (filter === 'groups') {
      result = result.filter((chat) => chat.type === 'group');
    }

    // Sort by pinned first, then by last message time
    return result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [chats, searchQuery, filter, currentUser.id]);

  const archivedCount = chats.filter((chat) => chat.isArchived).length;

  return (
    <div className="h-full flex flex-col bg-background-secondary border-r border-border">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowProfile(true)}
            className="hover:opacity-80 transition-opacity"
          >
            <Avatar
              src={currentUser.avatar}
              fallback={currentUser.displayName}
              size="md"
              isOnline={true}
              showStatus
            />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl gradient-text">
              ChatFlow
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowNewChat(true)}
            className="p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 flex gap-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'groups', label: 'Groups' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              filter === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
        {/* Pinned Section */}
        {filteredChats.some((chat) => chat.isPinned) && (
          <div className="mb-2">
            <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pinned
            </p>
            {filteredChats
              .filter((chat) => chat.isPinned)
              .map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={activeChat?.id === chat.id}
                  onClick={() => setActiveChat(chat)}
                />
              ))}
          </div>
        )}

        {/* All Chats */}
        {filteredChats.some((chat) => chat.isPinned) && (
          <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            All Chats
          </p>
        )}
        {filteredChats
          .filter((chat) => !chat.isPinned)
          .map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChat?.id === chat.id}
              onClick={() => setActiveChat(chat)}
            />
          ))}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <button
              onClick={() => setShowNewChat(true)}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Start a new chat
            </button>
          </div>
        )}
      </div>

      {/* Archived */}
      {archivedCount > 0 && (
        <button className="flex items-center gap-3 p-4 border-t border-border hover:bg-muted/50 transition-colors">
          <Archive className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Archived ({archivedCount})
          </span>
        </button>
      )}
    </div>
  );
}
