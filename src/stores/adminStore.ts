import {create} from 'zustand';
import {persist} from 'zustand/middleware'

import axios from 'axios';

import {getAuthToken} from '@/services/authTokenService'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AdminStore = {
  user: any ;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      user: {},
      login: async (credentials) => {
        try {
          const { data } = await axios.post(`${API_URL}/login`, credentials);
          set({ user: data });
          // Persist token in cookie for middleware-based protection
          if (typeof document !== 'undefined' && data?.token) {
            // 1 day expiry by default; adjust as needed
            const maxAge = 60 * 60 * 24;
            document.cookie = `auth_token=${data.token}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
          }
          return data
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },
      logout: async () => {
          const token = getAuthToken();
        try {
          await axios.post(`${API_URL}/logout`, {},{
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          set({ user: {} });
          // Remove auth cookie
          if (typeof document !== 'undefined') {
            document.cookie = "auth_token=; Path=/; Max-Age=0; SameSite=Lax";
          }
        } catch (error) {
            throw error;
        }
      },
    }),
    {
      name: "admin-store"
    }
  )
);
