import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api.js";

export const useUserStore = create(
  persist(
    (set, get) => ({
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
      checkAuth: async () => {
        if(!get().isLoggedIn) {
          return;
        }

        let response = null;
        try {
          response = await api.get("/v1/api/auth/get-user");
        } 
        catch (err) {
          // console.error("first err: jwt auth error:", err?.message);
          console.log(err?.response);
          if (err?.response?.status === 401) {
            try {
              await api.post("/v1/api/auth/refresh-token");
              response = await api.get("/v1/api/auth/get-user");
              set({
                isLoggedIn: true,
                isCaptain: response?.data?.isCaptain,
                userFirstName: response?.data?.user?.fullname?.firstname,
              });
            } 
            catch (refreshErr) {
              console.error("Refresh token failed:", refreshErr);
              get().logout();
              throw refreshErr;
            }
          }
          else {
            get().logout();
            console.error("jwt auth error:", err?.message);
          }
        }
      },

    }),
    {
      name: "user-storage", // localStorage key
      getStorage: () => localStorage, // or sessionStorage
    }
  )
);
