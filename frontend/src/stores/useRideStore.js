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
  },

  //customer side

  activeRide: null,
  setActiveRide: (ride) => set({ activeRide: ride }),

  confirmAnyActiveRide: async () => {
    try {
      const response = await api.get("/v1/api/ride/get-active-ride");
      get().setActiveRide(response.data);
      return response.data;
    }
    catch (error) {
      console.log("setIsCreatedRideError: ", error);
      throw error;
    }
  },
  createRide: async ({pickup, drop}) => {
    if(!pickup || !drop) {
      console.error("pickup or drop not specified.");
      return;
    }
    try {
      const response = await api.post("/v1/api/ride/create-ride", {pickup, drop});
      get().setActiveRide(response.data);
      return response.data;
    }
    catch(error) {
      console.error("create ride error: ",error);
      throw error;
    }
  },

  cancelRide: async () => {
    try {
      const response = await api.post("/v1/api/ride/cancel-ride", get().activeRide);
      get().setActiveRide(null);
      return response.data;
    }
    catch(error) {
      console.error("cancelRide error: ",error);
      throw error;
    }
  }
}));