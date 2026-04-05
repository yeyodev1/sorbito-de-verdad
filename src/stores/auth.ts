import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

function persistUser(user: User | null) {
  if (user) {
    localStorage.setItem('sorbito_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('sorbito_user');
  }
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isLoading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin' || state.user?.role === 'owner',
    isOwner: (state) => state.user?.role === 'owner',
  },

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true;
      try {
        const response = await authService.login({ email, password });
        this.token = response.data.token;
        this.user = response.data.user;
        persistUser(response.data.user);
        return response;
      } finally {
        this.isLoading = false;
      }
    },

    async register(name: string, email: string, password: string) {
      this.isLoading = true;
      try {
        const response = await authService.register({ name, email, password });
        this.token = response.data.token;
        this.user = response.data.user;
        persistUser(response.data.user);
        return response;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      authService.logout();
      persistUser(null);
      this.token = null;
      this.user = null;
    },

    async fetchMe() {
      this.isLoading = true;
      try {
        const response = await authService.getMe();
        this.user = response.data;
        persistUser(response.data);
        return response;
      } catch {
        this.logout();
      } finally {
        this.isLoading = false;
      }
    },

    setFromToken(token: string, user: User) {
      this.token = token;
      this.user = user;
      persistUser(user);
    },

    async initAuth() {
      const token = localStorage.getItem('access_token');
      if (token) {
        this.token = token;
        await this.fetchMe();
      }
    },
  },
});
