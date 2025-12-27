import { X, Camera, Edit2, Check, Mail, Phone, Info } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { Avatar } from './Avatar';
import { getOtherParticipant, formatLastSeen } from '@/data/mockData';

export function ProfilePanel() {
  const { setShowProfile, activeChat, currentUser } = useChatStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentUser.displayName);
  const [editedAbout, setEditedAbout] = useState(currentUser.about || '');

  // If viewing another user's profile
  const otherUser = activeChat ? getOtherParticipant(activeChat, currentUser.id) : null;
  const displayUser = otherUser || currentUser;
  const isOwnProfile = !otherUser;

  const handleSave = () => {
    // In a real app, this would update the user profile
    console.log('Saving profile:', { name: editedName, about: editedAbout });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-background-secondary rounded-2xl shadow-lg border border-border animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-primary to-primary-muted">
          <button
            onClick={() => setShowProfile(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/20 hover:bg-background/30 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar */}
        <div className="relative -mt-16 flex justify-center">
          <div className="relative">
            <Avatar
              src={displayUser.avatar}
              fallback={displayUser.displayName}
              size="xl"
              isOnline={displayUser.isOnline}
              showStatus
              className="ring-4 ring-background-secondary"
            />
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary-glow transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-6 text-center">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-4 py-2 bg-muted rounded-xl text-center font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <textarea
                value={editedAbout}
                onChange={(e) => setEditedAbout(e.target.value)}
                placeholder="Add an about..."
                className="w-full px-4 py-2 bg-muted rounded-xl text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                rows={2}
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary-glow transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2">
                <h2 className="font-display font-bold text-xl">
                  {displayUser.displayName}
                </h2>
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className={cn(
                'text-sm mt-1',
                displayUser.isOnline ? 'text-online' : 'text-muted-foreground'
              )}>
                {displayUser.isOnline
                  ? 'Online'
                  : displayUser.lastSeen
                  ? `Last seen ${formatLastSeen(displayUser.lastSeen)}`
                  : 'Offline'}
              </p>
            </>
          )}
        </div>

        {/* Details */}
        {!isEditing && (
          <div className="px-6 pb-6 space-y-4">
            {displayUser.about && (
              <div className="p-4 bg-muted/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                      About
                    </p>
                    <p className="text-sm">{displayUser.about}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-muted/30 rounded-xl">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p className="text-sm">{displayUser.email}</p>
                </div>
              </div>
            </div>

            {!isOwnProfile && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium">Call</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Video</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-destructive"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium">Block</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
