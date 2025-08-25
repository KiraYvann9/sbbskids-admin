import {create} from 'zustand';
import {persist} from 'zustand/middleware'

import axios from 'axios';
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
          return data
          // set((state) => ({ users: [...state.users, data] }));
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },
      logout: async () => {
        try {
          await axios.post(`${API_URL}/logout`);
          set({ user: {} });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    {
      name: "admin-store"
    }
  )
);

