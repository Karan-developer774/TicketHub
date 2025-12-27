import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { ChatSidebar } from './ChatSidebar';
import { ChatView } from './ChatView';
import { NewChatModal } from './NewChatModal';
import { SettingsPanel } from './SettingsPanel';
import { ProfilePanel } from './ProfilePanel';

export function ChatLayout() {
  const {
    activeChat,
    showNewChat,
    showSettings,
    showProfile,
    isMobileView,
    showChatOnMobile,
    setIsMobileView,
  } = useChatStore();

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileView]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <div className="h-full flex">
        {/* Sidebar */}
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out',
            isMobileView
              ? showChatOnMobile
                ? 'w-0 opacity-0'
                : 'w-full'
              : 'w-80 lg:w-88 xl:w-100 flex-shrink-0'
          )}
        >
          <ChatSidebar />
        </div>

        {/* Chat View */}
        <div
          className={cn(
            'h-full flex-1 transition-all duration-300 ease-in-out',
            isMobileView && !showChatOnMobile && 'hidden'
          )}
        >
          <ChatView />
        </div>
      </div>

      {/* Modals */}
      {showNewChat && <NewChatModal />}
      {showSettings && <SettingsPanel />}
      {showProfile && <ProfilePanel />}
    </div>
  );
}
