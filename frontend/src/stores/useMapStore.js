import { create } from "zustand";
import api from "../utils/api.js";

export const useMapStore = create((set, get) => ({
  map: null,
  setMap: (map) => set({ map }),
  
  //Location = { name , lat, lon}
  pickupLocation: null,
  setPickupLocation: (location) => set({ pickupLocation: location }),
  
  dropLocation: null,
  setDropLocation: (location) => set({ dropLocation: location }),

  pickupSuggestions: [],
  setPickupSuggestions: (pickupSuggestions) => set({ pickupSuggestions }),
  isLoadingPickupSuggestions: false,
  setIsLoadingPickupSuggestions: (isLoading) => set({ isLoadingPickupSuggestions: isLoading }),

  getPickupSuggestions: async (query) => {
    get().setIsLoadingDropSuggestions(true);
    try {
      const res = await api.post("/v1/api/map/get-suggestions", { query });
      if(!res.data) {
        get().setPickupSuggestions([]);
        return;
      }
      get().setPickupSuggestions(res.data);
    }
    catch(error) {
      console.error(error);
      get().setPickupSuggestions([]);
    }
    finally {
      get().setIsLoadingPickupSuggestions(false);
    }
  },

  testMap : async () => {
    try {
      const response = await api.get("/v1/api/map");
      return response.data;
    }
    catch(error) {
      console.error(error);
    }
  },

  dropSuggestions: [],
  setDropSuggestions: (dropSuggestions) => set({ dropSuggestions }),
  isLoadingDropSuggestions: false,
  setIsLoadingDropSuggestions: (isLoading) => set({ isLoadingDropSuggestions: isLoading }),
  getDropSuggestions: async (query) => {
    get().setIsLoadingDropSuggestions(true);
    try {
      const res = await api.post("/v1/api/map/get-suggestions", { query });
      if(!res.data) {
        get().setDropSuggestions([]);
        return;
      }
      get().setDropSuggestions(res.data);
    }
    catch(error) {
      console.error(error);
      get().setDropSuggestions([]);
    }
    finally {
      get().setIsLoadingDropSuggestions(false);
    }
  },

  isRouteLoading: false,
  setIsRouteLoading: (isLoading) => set({ isRouteLoading: isLoading }),

  getRoutes: async (pickupLat, pickupLon, dropLat, dropLon) => {
    if(!pickupLat || !pickupLon || !dropLat || !dropLon) {
      console.log("no route");
      return null;
    }
    get().setIsRouteLoading(true);
    try {
      const response = await api.post("/v1/api/map/get-dotted-route", { pickupLat, pickupLon, dropLat, dropLon });
      if(!response?.data) {
        console.log("no route response");
        return null;
      }
      return response.data;
    }
    catch(error) {
      console.error(error);
      return null;
    }
    finally {
      get().setIsRouteLoading(false);
    }
  }
}))