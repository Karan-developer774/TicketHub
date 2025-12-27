import { useAuthStore } from '@/store/authStore';
import { AuthContainer } from './auth/AuthContainer';
import { ChatLayout } from '@/components/chat/ChatLayout';

const Index = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  return <ChatLayout />;
};

export default Index;
