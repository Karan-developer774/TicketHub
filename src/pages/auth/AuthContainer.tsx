import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';

type AuthView = 'login' | 'register' | 'forgot-password';

export function AuthContainer() {
  const [view, setView] = useState<AuthView>('login');

  switch (view) {
    case 'register':
      return <RegisterPage onSwitchToLogin={() => setView('login')} />;
    case 'forgot-password':
      return <ForgotPasswordPage onSwitchToLogin={() => setView('login')} />;
    default:
      return (
        <LoginPage
          onSwitchToRegister={() => setView('register')}
          onSwitchToForgotPassword={() => setView('forgot-password')}
        />
      );
  }
}
