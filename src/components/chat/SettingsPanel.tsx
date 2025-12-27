import { X, Bell, Lock, Palette, HelpCircle, LogOut, Moon, Sun, ChevronRight, Shield, Database, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { Avatar } from './Avatar';

export function SettingsPanel() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { setShowSettings, currentUser } = useChatStore();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const settingsSections = [
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      description: 'Message, group & call notifications',
    },
    {
      id: 'privacy',
      icon: Lock,
      label: 'Privacy',
      description: 'Block contacts, disappearing messages',
    },
    {
      id: 'security',
      icon: Shield,
      label: 'Security',
      description: 'Two-factor authentication',
    },
    {
      id: 'storage',
      icon: Database,
      label: 'Storage & Data',
      description: 'Manage storage, network usage',
    },
    {
      id: 'devices',
      icon: Smartphone,
      label: 'Linked Devices',
      description: 'Manage linked devices',
    },
    {
      id: 'appearance',
      icon: Palette,
      label: 'Appearance',
      description: 'Theme, wallpaper, font size',
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Help',
      description: 'Help center, contact us',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-[80vh] max-h-[600px] bg-background-secondary rounded-2xl shadow-lg border border-border animate-scale-in overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display font-bold text-lg">Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-border">
          <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <Avatar
              src={currentUser.avatar}
              fallback={currentUser.displayName}
              size="lg"
              isOnline={true}
              showStatus
            />
            <div className="flex-1 text-left">
              <h3 className="font-semibold">{currentUser.displayName}</h3>
              <p className="text-sm text-muted-foreground">{currentUser.about}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Settings List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Theme Toggle */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-warning" />
                )}
                <span className="font-medium">Dark Mode</span>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn(
                  'w-12 h-7 rounded-full transition-colors relative',
                  isDarkMode ? 'bg-primary' : 'bg-muted'
                )}
              >
                <div
                  className={cn(
                    'absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="p-2">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{section.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            ChatFlow v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
