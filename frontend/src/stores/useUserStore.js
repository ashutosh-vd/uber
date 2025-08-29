import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      setLoggedIn: (v) => set({ isLoggedIn: v }),

      isLoggingIn: false,
      setLoggingIn: (v) => set({ isLoggingIn: v }),

      isSigningUp: false,
      setSigningUp: (v) => set({ isSigningUp: v }),

      isCaptain: false,
      setCaptain: (v) => set({ isCaptain: v }),

      userFirstName: null,
      setName: (v) => set({ userFirstName: v }),

      logout: () => set({
        isLoggedIn: false,
        isCaptain: false,
        userFirstName: null,
      }),
    }),
    {
      name: "user-storage", // localStorage key
      getStorage: () => localStorage, // or sessionStorage
    }
  )
);
