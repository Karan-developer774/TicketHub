import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: {
    email: string;
    displayName: string;
  } | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock validation
    if (!email || !password) {
      set({ isLoading: false, error: 'Please fill in all fields' });
      return;
    }
    
    if (password.length < 6) {
      set({ isLoading: false, error: 'Invalid credentials' });
      return;
    }

    // Mock successful login
    set({
      isAuthenticated: true,
      isLoading: false,
      user: {
        email,
        displayName: email.split('@')[0],
      },
    });
  },

  register: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock validation
    if (!email || !password || !displayName) {
      set({ isLoading: false, error: 'Please fill in all fields' });
      return;
    }
    
    if (password.length < 6) {
      set({ isLoading: false, error: 'Password must be at least 6 characters' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      set({ isLoading: false, error: 'Please enter a valid email' });
      return;
    }

    // Mock successful registration
    set({
      isAuthenticated: true,
      isLoading: false,
      user: {
        email,
        displayName,
      },
    });
  },

  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    });
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (!email) {
      set({ isLoading: false, error: 'Please enter your email' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      set({ isLoading: false, error: 'Please enter a valid email' });
      return;
    }

    set({ isLoading: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));
