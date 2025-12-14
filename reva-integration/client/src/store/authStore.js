// client/src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => {
        set({ user: null, token: null });
        // remove any manual extras you stored
        localStorage.removeItem('farmerPhone');
        localStorage.removeItem('companyPhone');
        // if earlier you ever stored token/userType manually, clear them too:
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
