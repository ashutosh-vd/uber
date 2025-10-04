import { create } from "zustand";
import api from "../utils/api.js";

export const useRideStore = create((set, get) => ({
  getRideRequestsAll: async () => {
    try {
      const response = await api.get("/v1/api/ride/get-all-rides-for-captain");
      return response.data;
    }
    catch(error) {
      console.error("getRideRequestsAll error: ", error);
    }
  },

  isCheckingOtp: false,
  setIsCheckingOtp: (value) => set({ isCheckingOtp: value }),
  assignCaptainClient: async (otp, rideId) => {
    if(!otp) {
      console.error("invalid otp")
      return;
    }
    get().setIsCheckingOtp(true);
    try {
      const response = await api.post("/v1/api/ride/accept-ride-assign-captain", { otp, rideId });
      return response.data;
    }
    catch(error) {
      console.error("assignCaptainClient error: ", error);
    }
    finally {
      get().setIsCheckingOtp(false);
    }
  } 
}));